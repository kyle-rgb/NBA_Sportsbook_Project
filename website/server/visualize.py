import flask
import pandas as pd, numpy as np, os
from flask_cors import CORS, cross_origin


app = flask.Flask(__name__)
app.config["CORS_HEADERS"] = "Content-Type"
cors = CORS(app)


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
    return flask.render_template("Data.html")

@app.route("/overview")
@cross_origin()
def draw_dash():
    return flask.render_template("Dashboard.html")


@app.route("/game")
@cross_origin()
def draw_game():
    return flask.render_template("Game.html")

@app.route("/debrief")
@cross_origin()
def draw_debrief():
    return flask.render_template("Debrief.html")





if __name__ == "__main__":
    app.run()

