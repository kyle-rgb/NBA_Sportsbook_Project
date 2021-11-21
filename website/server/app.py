import flask
import pandas as pd, numpy as np, os, sqlalchemy as sql
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
    return flask.render_template("DataHouse.html", js=js, id=0, obj_dict=obj_dict)

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
    return flask.render_template("DataHouse.html", js=js,id=0, obj_dict=obj_dict)


@app.route("/game")
@cross_origin()
def draw_game():
    js = "game.js"
    id = flask.request.args["id"]
    print(id)
    return flask.render_template("DataHouse.html", js=js, id=id)

@app.route("/debrief")
@cross_origin()
def draw_debrief():
    return flask.render_template("Debrief.html")



if __name__ == "__main__":
    app.run()

