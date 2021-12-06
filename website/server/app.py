import flask
import pandas as pd, numpy as np, os, sqlalchemy as sql, re
from flask_cors import CORS, cross_origin

app = flask.Flask(__name__)
app.config["CORS_HEADERS"] = "Content-Type"
cors = CORS(app)

engine = sql.create_engine("sqlite:///static/data/baller.db")




@app.route("/")
@cross_origin()
def index():
    return "Success!"

@app.route("/intro")
@cross_origin()
def draw_index():
    print(os.getcwd())
    return flask.render_template("index.html")

@app.route("/game_log")
@cross_origin()
def draw_games():
    js = "gamelog.js"
    # Game Log Table  
    conn = engine.connect()
    table_data = pd.read_sql("SELECT results.date, results.home_abbv, results.away_abbv, pts_home, pts_away, m3_proj_home, m3_proj_away, markets.moneyline_home, markets.spread_home, markets.total, picks.ml_pk, picks.spread_pk, picks.total_pk, book_sums.Best_Book,results.season, picks.game_id, picks.ml_winnings, picks.spread_winnings, picks.total_winnings, picks.agg_winnings FROM results JOIN picks ON picks.game_id = results.game_id JOIN markets ON picks.game_id = markets.game_id JOIN book_sums ON book_sums.game_id = markets.game_id WHERE markets.book = 'average' AND picks.book='average' AND book_sums.metric = 'best'", con=conn)\
        .to_json(orient="records", double_precision=3)
    obj_dict = {"table_data": table_data}
    conn.close()
    return flask.render_template("DataHouse.html", js=js, id=0, obj_dict=obj_dict, page_name="Game Log")

@app.route("/overview")
@cross_origin()
def draw_dash():
    conn = engine.connect()
    js = "dashboard.js"
    money_chart_data = pd.read_sql("SELECT book, picks.game_id, ml_winnings, spread_winnings, total_winnings, SUM(agg_winnings) as agg_winnings, date(date) as day, season FROM picks JOIN results USING (game_id) GROUP BY book, day", con=conn)\
        .to_json(orient="records", double_precision=3)
    team_picks = pd.read_sql("SELECT * FROM picks JOIN (SELECT home_abbv, away_abbv, game_id, season FROM results) USING (game_id)", con=conn)\
        .to_json(orient="records", double_precision=3)
    conn.close()
    obj_dict = {"team_picks": team_picks, "money_chart_data": money_chart_data}
    return flask.render_template("DataHouse.html", js=js,id=0, obj_dict=obj_dict, page_name="Season Dashboard")


@app.route("/game")
@cross_origin()
def draw_game():
    conn = engine.connect()
    js = "game.js"
    id = flask.request.args["id"]
    # reg = re.compile(r"[^0-9]*;*")
    # if reg.match(id) != None:
    #     raise AttributeError
    markets_game = pd.read_sql(f"SELECT * FROM picks JOIN markets USING (game_id, book) JOIN results USING(game_id, home_abbv, away_abbv) WHERE picks.game_id = '{id}'", con=conn).drop(["index"], axis=1)\
        .to_json(orient="records", double_precision=3)
    markets_error = pd.read_sql(f"SELECT * FROM results JOIN (SELECT (ABS(market_home_error) + ABS(market_away_error)) market_whole_error, (ABS(m3_home_error) + ABS(m3_away_error)) m3_whole_error, (ABS(m3_mkt_dev_home) + ABS(m3_mkt_dev_away)) m3_whole_deviation, * FROM (SELECT markets.book, markets.market_score_home, markets.market_score_away, markets.game_id, (markets.market_score_home - results.pts_home) market_home_error, (markets.market_score_away - results.pts_away) market_away_error, (results.m3_proj_home - results.pts_home) m3_home_error, (results.m3_proj_away - results.pts_away) m3_away_error, (results.m3_proj_home - markets.market_score_home) m3_mkt_dev_home, (results.m3_proj_away - markets.market_score_away)  m3_mkt_dev_away  FROM results JOIN markets USING (game_id)) WHERE game_id = '{id}') USING (game_id)", con=conn)\
        .drop("game_id", axis=1).to_json(orient="records", double_precision=3)
    timeseries_game = pd.read_sql(f"SELECT * FROM time WHERE game_id = '{id}'", con=conn).to_json(orient="records")
    team_picks = pd.read_sql(f"SELECT * FROM picks JOIN (SELECT home_abbv, away_abbv, game_id FROM results) USING (game_id) WHERE game_id = '{id}'", con=conn)\
        .to_json(orient="records", double_precision=3)
    summary_table = pd.read_sql(f"SELECT * FROM book_sums WHERE game_id = '{id}'", con=conn).to_json(orient="records", double_precision=3)
    obj_dict = {"markets_game": markets_game, "markets_error": markets_error, "timeseries_game": timeseries_game,\
        "team_picks": team_picks, "summary_table": summary_table, "id": id}
    conn.close()
    return flask.render_template("DataHouse.html", js=js, obj_dict=obj_dict, page_name=f"Game #{id}")

@app.route("/breakdown")
@cross_origin()
def draw_team():
    conn = engine.connect()
    js = "team.js"
    team = flask.request.args["team"]
    results = pd.read_sql(f"SELECT *, DATE(date) as date_a FROM results JOIN markets USING (home_abbv, away_abbv, game_id) JOIN (SELECT agg_winnings, book, game_id FROM picks) USING (game_id, book) WHERE results.home_abbv = '{team}' OR results.away_abbv = '{team}' ORDER BY date", con=conn).drop("index", axis=1)\
        .to_json(orient="records", double_precision=3)
    moneys = pd.read_sql(f"SELECT * FROM picks JOIN (SELECT season, game_id, DATE(date) as date from results) USING (game_id) WHERE team_arr LIKE '%{team}' OR team_arr LIKE '{team}%' ORDER BY date", con=conn).drop("index", axis=1).to_json(orient="records")
    markets_error = pd.read_sql(f"SELECT * FROM results JOIN (SELECT (ABS(market_home_error) + ABS(market_away_error)) market_whole_error, (ABS(m3_home_error) + ABS(m3_away_error)) m3_whole_error, (ABS(m3_mkt_dev_home) + ABS(m3_mkt_dev_away)) m3_whole_deviation, * FROM (SELECT markets.book, markets.market_score_home, markets.market_score_away, markets.game_id, (markets.market_score_home - results.pts_home) market_home_error, (markets.market_score_away - results.pts_away) market_away_error, (results.m3_proj_home - results.pts_home) m3_home_error, (results.m3_proj_away - results.pts_away) m3_away_error, (results.m3_proj_home - markets.market_score_home) m3_mkt_dev_home, (results.m3_proj_away - markets.market_score_away)  m3_mkt_dev_away  FROM results JOIN markets USING (game_id))) USING (game_id) WHERE results.home_abbv = '{team}' OR results.away_abbv = '{team}'", con=conn)\
        .drop("game_id", axis=1).to_json(orient="records", double_precision=3)


    obj_dict = { "team": f"'{team}'", "results": results, "moneys": moneys, "markets_error": markets_error}
    conn.close()
    return flask.render_template("DataHouse.html", js=js, obj_dict=obj_dict, page_name=f"{team}'s Breakdown")

@app.route("/analysis")
@cross_origin()
def draw_analysis():
    return flask.render_template("analysis.html")


@app.route("/debrief")
@cross_origin()
def draw_debrief():
    return flask.render_template("debrief.html")


if __name__ == "__main__":
    app.run()

