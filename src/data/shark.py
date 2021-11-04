import time, sys, requests, re, bs4, os, json, time, pandas as pd, numpy as np, sqlalchemy as sql, datetime as dt
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
    game_links = f.readlines()
# INSERT dfs into MySQL db

# Create Connection
Base = declarative_base()
engine = sql.create_engine(connection_str)
conn = engine.connect()
# Create db Classes
class Time(Base):
    __tablename__ = "Time"
    id = Column(Integer, primary_key=True)
    timestamp = Column(String(100))
    book = Column(String(50))
    spread = Column(Float) # currently in one column: Line (Home)
    spread_odds = Column(Integer) # Line (Home)
    total = Column(Float) # currently in one column: Over / Under
    over_odds = Column(Integer) # Over / Under
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
        return -999

def mknum(number):
    return -999 if number == '' else number


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
    response = requests.get(url)
    soup = bs4.BeautifulSoup(response.text, features="lxml")
    tables = soup.select("script")
    table = json.loads(tables[2].text)
    i = 0
    # odds_shark_df = pd.DataFrame(columns=["home_abbv", "away_abbv", "date", "game_id"])
    book_df = pd.DataFrame(columns=["team_abbv", "book", "moneyline", "spread", "spread_odds", "total", "over_odds", "under_odds", "game_id"])
    table = table["oddsshark_gamecenter"]
    bookmaker_list = table["odds"]["data"]
    session = Session(bind=engine)
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
    return book_df

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

    market_df["spread"] = market_df["Line (Home)"].apply(columnHelper, i=0).astype("float32")
    market_df["spread_odds"] = market_df["Line (Home)"].apply(columnHelper, i=1).astype("int32")
    market_df["total"] = market_df["Over / Under"].apply(columnHelper, i=0).astype("float32")
    market_df["over_odds"] = market_df["Over / Under"].apply(columnHelper, i=1).astype("int32")
    market_df["game_id"] = id
    market_df.drop(["Over / Under", "Line (Home)"], axis=1,inplace=True)
    market_df.reset_index(inplace=True, drop=True)

    market_df.to_sql("time", con=conn, if_exists="append", index=False)    
    session.commit()
    session.close()
    return market_df


def grabData(url):
    df_1 = grabLines(url)
    df_2 = grabTimedMarkets(id_regex.search(url)[0])
    print(time.time()-start)
    
    



#createLinkList(1500)

# Test For Grabbing All Data from Sample Game
grabData("https://www.oddsshark.com/nba/denver-utah-odds-october-26-2021-1459586")