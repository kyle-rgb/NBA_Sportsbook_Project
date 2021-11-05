import time, sys, requests, re, bs4, os, json, time
import pandas as pd, numpy as np, sqlalchemy as sql, datetime as dt
from concurrent.futures import ThreadPoolExecutor
from selenium import webdriver
from db_info import connection_str

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, Float, String, DateTime

start = time.time()
id_regex = re.compile("\d{6,7}") # -12-2017-{6,7}
game_links = []

# Read in List of URL
with open("wanted_links.txt", "r") as f:
    game_links = f.read().splitlines()
# INSERT dfs into MySQL db

# Create Connection
Base = declarative_base()
engine = sql.create_engine(connection_str)
conn = engine.connect()
# Create db Classes
class Time(Base):
    __tablename__ = "time"
    id = Column(Integer, primary_key=True)
    timestamp = Column(String(100))
    book = Column(String(50))
    spread = Column(String(100)) # currently in one column: Line (Home)
    total = Column(String(100)) # currently in one column: Over / Under
    game_id = Column(Integer)
    

class Odds(Base):
    __tablename__ = "Odds"
    id = Column(Integer, primary_key=True)
    team_abbv = Column(String(3))
    book = Column(String(50))
    moneyline = Column(Integer)
    spread = Column(Float)
    spread_odds = Column(Integer)
    total = Column(Float)
    over_odds = Column(Integer)
    under_odds = Column(Integer)
    game_id = Column(Integer)

class GameCodes(Base):
    __tablename__ = "GameCodes"
    id = Column(Integer, primary_key=True)
    home_abbv = Column(String(3))
    away_abbv = Column(String(3))
    date = Column(DateTime)
    game_id = Column(Integer)

Base.metadata.create_all(engine)
# Write Function for grabData Async
    # Use session objects and commits for integrity 

def columnHelper(market, i):
    try:
        return market.split(" ")[i]
    except IndexError:
        print(IndexError)
        return -999

def mknum(number):
    return -999 if number.lower() in  ['', "pk", "ev"] else number

def mkstr(string):
    return "X" if string == "" or string == " " else string

def createLinkList(days=7):
    # Use Selenium To Game Specific URLs
    match_index = 0
    matchup_links = []
    driver = webdriver.Chrome("../../../../../Python/scraping/chromedriver.exe")
    driver.get("https://www.oddsshark.com/nba/scores")
    time.sleep(5) # Wait for Data to Appear 
    for _ in range(days):
        button = driver.find_element_by_css_selector('button.button--arrow-left')
        wanted_links = driver.find_elements_by_link_text('Matchup')
        for link in wanted_links:
            matchup_links.append(link.get_attribute("href"))
        button.click()
        time.sleep(2)

    with open("wanted_links.txt", "a") as f:
        for url in matchup_links:
            f.write(url +"\n")
        f.close()
    
    driver.quit()

# These two tasks should be handled functionally.
def grabLines(url):
    # Press See More Button
    session = Session(bind=engine)
    response = requests.get(url)
    soup = bs4.BeautifulSoup(response.text, features="lxml")
    tables = soup.select("script")
    table = json.loads(tables[2].text)
    i = 0
    # odds_shark_df = pd.DataFrame(columns=["home_abbv", "away_abbv", "date", "game_id"])
    book_df = pd.DataFrame(columns=["team_abbv", "book", "moneyline", "spread", "spread_odds", "total", "over_odds", "under_odds", "game_id"])
    table = table["oddsshark_gamecenter"]
    bookmaker_list = table["odds"]["data"]
    # Gather Nominal Data
    home_abbv =  table["matchup"]["home_abbreviation"]
    away_abbv = table["matchup"]["away_abbreviation"]
    game_id = table["matchup"]["event_id"]
    date = table["matchup"]["event_date"]

    session.add(GameCodes(home_abbv=home_abbv, away_abbv=away_abbv, date=date, game_id=game_id))
    # Gather Odds Data
    for book in bookmaker_list:
        spread = book["money_line_spread"]
        # keys = ["home", "away"]
        for k in spread.keys():
            if k == "home":
                team_abbv = home_abbv
            else:
                team_abbv= away_abbv
            session.add(Odds(team_abbv=team_abbv, book=book["book"]["book_name"], over_odds=mknum(book["over_under"]["over"]), under_odds=mknum(book["over_under"]["under"]),total=mknum(book["over_under"]["total"]),
            moneyline=mknum(spread[k]["money_line"]), spread=mknum(spread[k]["spread"]), spread_odds=mknum(spread[k]["spread_price"]), game_id=game_id))
            i+=1  
    session.commit()
    session.close()
    return None

def grabTimedMarkets(id):
# Grab Time Based Line Information From Embedded Link in Game Page
    session = Session(bind=engine)
    market_df = pd.DataFrame()
    columns_list = ["Line (Home)", "Over / Under"]
    response = requests.get(f"https://www.oddsshark.com/nba/odds/line-history/{str(id)}")
    soup = bs4.BeautifulSoup(response.text, features="lxml")
    tables = soup.select("table")
    df_list = pd.read_html(str(tables))
    
    for df in df_list:
        for col in df.columns:
            if col not in columns_list:
                df["Book"] = col
                df = df.rename(columns={col: "timestamp"})
        market_df = pd.concat([market_df, df])
    
    
    
    market_df = market_df.rename(columns={"Line (Home)": "spread", "Over / Under": "total"})
    market_df = market_df.fillna(value="X")
    market_dict_list = market_df.to_dict(orient="records")
    for dict in market_dict_list:
        session.add(Time(timestamp=mkstr(dict["timestamp"]), spread=mkstr(dict["spread"]), total=mkstr(dict["total"]), book=mkstr(dict["Book"]), game_id=id))
        session.commit()

    
    session.commit()
    session.close()
    return None


def grabData(url):
    grabLines(url)
    grabTimedMarkets(id_regex.search(url)[0])

#createLinkList(1500)
# Test For Grabbing All Data from Sample Game
# grabData("https://www.oddsshark.com/nba/denver-utah-odds-october-26-2021-1459586")

with ThreadPoolExecutor() as executor:
    executor.map(grabData, game_links) 

print(f"completed in: {time.time()-start} seconds.")
