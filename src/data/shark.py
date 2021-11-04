import time, sys, requests, re, bs4, os, json, time, pandas as pd, sqlalchemy as sql
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

print(len(game_links))
# INSERT dfs into MySQL db

# Create Connection
Base = declarative_base()
engine = sql.create_engine(connection_str)
conn = engine.connect()
# Create db Classes
class Timestamp(Base):
    __tablename__ = "Timestamp"
    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime)
    spread = Column(Float) # currently in one column: Line (Home)
    spread_odds = Column(Integer) # Line (Home)
    over_under = Column(Float) # currently in one column: Over / Under
    over_under_odds = Column(Integer) # Over / Under
    book = Column(String)
    game_id = Column(Integer)

class Odds(Base):
    __tablename__ = "Odds"
    id = Column(Integer, primary_key=True)
    team_abbv = Column(String)
    book = Column(String)
    ml = Column(Integer)
    spread = Column(Float)
    spread_odds = Column(Integer)
    total = Column(Float)
    over_odds = Column(Integer)
    under_odds = Column(Integer)
    game_id = Column(Integer)

Base.metadata.create_all(engine)
# Write Function for grabData Async
    # Use session objects and commits for integrity 


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
    book_df = pd.DataFrame(columns=["team_abbv", "Book", "ML", "Spread", "Odds", "Total", "Over", "Under", "game_id"])
    table = table["oddsshark_gamecenter"]
    bookmaker_list = table["odds"]["data"]
    # Gather Nominal Data
    home_abbv = table["matchup"]["home_abbreviation"]
    away_abbv = table["matchup"]["away_abbreviation"]
    date = table["matchup"]["event_date"]
    game_id = table["matchup"]["event_id"]
    # Gather Odds Data
    for book in bookmaker_list:
        spread = book["money_line_spread"]
        # keys = ["home", "away"]
        for k in spread.keys():
            book_df.loc[i, "game_id"] = game_id
            book_df.loc[i, "Book"] = book["book"]["book_name"]
            book_df.loc[i, "Over"] = book["over_under"]["over"]
            book_df.loc[i, "Under"] = book["over_under"]["under"]
            book_df.loc[i, "Total"] = book["over_under"]["total"]
            if k == "home":
                book_df.loc[i, "team_abbv"] = home_abbv
            else:
                book_df.loc[i, "team_abbv"] = away_abbv
            book_df.loc[i, "ML"] = spread[k]["money_line"]
            book_df.loc[i, "Spread"] = spread[k]["spread"]
            book_df.loc[i, "Odds"] = spread[k]["spread_price"]
            i+=1   
    print(book_df)
    return book_df

def grabTimedMarkets(id):
# Grab Time Based Line Information From Embedded Link in Game Page
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
                df = df.rename(columns={col: "Timestamp"})
        market_df = pd.concat([market_df, df])
    market_df["game_id"] = id
    market_df.reset_index(inplace=True, drop=True)
    print(market_df)
    return market_df


def grabData(url):
    grabLines(url)
    grabTimedMarkets(id_regex.search(url)[0])
    print(time.time()-start)
    



#createLinkList(1500)

# Test For Grabbing All Data from Sample Game
grabData("https://www.oddsshark.com/nba/denver-utah-odds-october-26-2021-1459586")