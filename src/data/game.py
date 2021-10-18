import os, requests, bs4, pprint, csv, datetime, time
import time, re, numpy, unicodedata, concurrent.futures

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, Float, String, Boolean
import sqlalchemy as sql

start_time = time.perf_counter()
#today = datetime.strftime(datetime.datetime.now(), "%b %d, %Y")

# helper
def mk_float(s):
    return float(s) if s else 0

os.chdir(r"C:\Users\Kyle\Desktop\CodeOandE\Python\Nba_Revised\Setting_Lines_and_Making_Dimes\data\interim")
# Basketball Reference's Team Codes
teams = ["TOR", "BOS", "PHI", "BRK", "NYK",
         "DEN", "UTA", "OKC", "POR", "MIN",
         "MIL", "IND", "CHI", "DET", "CLE",
         "MIA", "ORL", "WAS", "CHO", "ATL",
         "LAL", "LAC", "SAC", "PHO", "GSW",
         "DAL", "HOU", "MEM", "NOP", "SAS"]
# Filler to match uncommon or repeated team abbreviations to their proper code
key_matcher = {"Brooklyn Nets": "BRK", "New York K": "NYK", "Oklahoma City T": "OKC", "Charlotte Hornets": "CHO",
               "Los Angeles L": "LAL", "Los Angeles C": "LAC", "Golden State W": "GSW", "New Orleans P": "NOP", "San Antonio S":"SAS"}
# Regular Expression for Game Codes in the .txt files 
game_regex = re.compile(r"^\d{8}0.{3}")
# Regex for Team Full Opponent Names in .txt files
opponent_regex = re.compile(r"^[A-Z]+[a-z]+\s[A-Z0-9]+[a-z0-9]+\s?[A-Z]?")
# Regex for Dates
#date_regex = 
# Empty List for iterations
games=[]
opponents_codes = []

with open("results_Season_2021_postallstar.txt", "r") as season_file:
    full_text = season_file.readlines()
    for elements in full_text:
        elems = elements.split(",")
        if game_regex.search(elems[-2]) != None:
            # Game Found
            game_naught = game_regex.search(elems[-2])
            game_naught = game_naught.group(0)
            # Append Game Code to List
            games.append(game_naught)
            opponent = opponent_regex.search(elems[4])
            opponent = opponent.group(0)
            if opponent.upper()[:3] not in teams:
                # Append Corresponding non-obvious opponent code to List matching the appropiate game code
                opponent = key_matcher[opponent]
                opponents_codes.append(opponent)
            else:
                opponents_codes.append(opponent.upper()[:3])
                
        else:
            next
    season_file.close()

# Create the Appropiate Classes For Our 2 Seperate Statistical Tables
Base = declarative_base()
engine = sql.create_engine(f"sqlite:///NBA.db")
conn = engine.connect()

class Basic_Stats(Base):
    __tablename__ = 'basic_stats'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    minutes_played = Column(Float)
    fg = Column(Integer)
    fga = Column(Integer)
    fg_pct = Column(Float)
    fg3 = Column(Integer)
    fg3a = Column(Integer)
    fg3_pct = Column(Float)
    ft = Column(Integer)
    fta = Column(Integer)
    ft_pct = Column(Float)
    orb = Column(Integer)
    drb = Column(Integer)
    trb = Column(Integer)
    ast = Column(Integer)
    stl = Column(Integer)
    blk = Column(Integer)
    tov = Column(Integer)
    pf = Column(Integer)
    pts = Column(Integer)
    bpm = Column(Float)
    dnp = Column(Boolean)
    timetype = Column(String)
    team = Column(String)
    game_code = Column(String)

class Advanced_Stats(Base):
    __tablename__ = 'advanced_stats'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    minutes_played = Column(Float)
    ts_pct = Column(Float)
    efg_pct = Column(Float)
    fg3a_per_fga_pct = Column(Float)
    fta_per_fga_pct = Column(Float)
    orb_pct = Column(Float)
    drb_pct = Column(Float)
    trb_pct = Column(Float)
    ast_pct = Column(Float)
    stl_pct = Column(Float)
    blk_pct = Column(Float)
    tov_pct = Column(Float)
    usg_pct = Column(Float)
    off_rtg = Column(Float)
    def_rtg = Column(Float)
    bpm = Column(Float)
    dnp = Column(Boolean)
    timetype = Column(String)
    team = Column(String)
    game_code = Column(String)

# Create tables based on Defined Classses
Base.metadata.create_all(engine)

rez = []

away = "HOME"

content =[]

# Function Args
test_data2 = zip(opponents_codes, games)

# Scrape Function
def sql_game_writer(a_tuple):
    oppo = a_tuple[0]
    game = a_tuple[1]
    url = f"https://www.basketball-reference.com/boxscores/{game}.html"
    response = requests.get(url)
    soup = bs4.BeautifulSoup(response.text, features='lxml')
    home_team_name = game[-3:]
    if home_team_name not in teams:
        home_team_name = key_matcher[home_team_name]
    # Select Stats Tables 
    tables = soup.select("table")
    num_tables = len(tables)
    # k = Tables per Team 
    k = num_tables / 2
    content =[]   
    for x in numpy.arange(0, num_tables):
        rows = tables[x].findAll('tr')
        length = len(rows)
        for entry in range(0, length):
            data = rows[entry]
            if data.attrs != {} or data.attrs.get("class", 0) != 0:
                continue
            else:
                try:
                    off = [z.text for z in data.contents]
                    if '' in off:
                        for elem in off:
                            if elem == '':
                                elem = mk_float(elem)
                    # Indicator shows how many different time periods we have in this game. Waterfall Approach helps with games that had overtime(s).
                    # Each If stmt. appends the 'global' variables of the game: team (oppo or home_team_name), type of statistics (TotalBasic, 1Q, 2Q, 1H, etc.) and Game ID.
                    indicator = x % k
                    if  indicator == 0:
                        off.append("TotalBasics")
                        if x < k:
                            off.append(oppo)
                        else:
                            off.append(home_team_name)
                        off.append(game)
                    elif  indicator == 1:
                        off.append("1Q")
                        if x < k:
                            off.append(oppo)
                        else:
                            off.append(home_team_name)
                        off.append(game)
                    elif indicator == 2:
                        off.append("2Q")
                        if x < k:
                            off.append(oppo)
                        else:
                            off.append(home_team_name)
                        off.append(game)
                    elif indicator == 3:
                        off.append("1H")
                        if x < k:
                            off.append(oppo)
                        else:
                            off.append(home_team_name)
                        off.append(game)
                    elif indicator == 4:
                        off.append("3Q")
                        if x < k:
                            off.append(oppo)
                        else:
                            off.append(home_team_name)
                        off.append(game)
                    elif indicator == 5:
                        off.append("4Q")
                        if x < k:
                            off.append(oppo)
                        else:
                            off.append(home_team_name)
                        off.append(game)
                    elif indicator == 6:
                        off.append("2H")
                        if x < k:
                            off.append(oppo)
                        else:
                            off.append(home_team_name)
                        off.append(game)
                    elif indicator + 1 == k:
                        off.append("Advanced")
                        if x < k:
                            off.append(oppo)
                        else:
                            off.append(home_team_name)
                        off.append(game)
                    elif indicator == 7:
                        off.append("OT")
                        if x < k:
                            off.append(oppo)
                        else:
                            off.append(home_team_name)
                        off.append(game)
                    elif indicator == 8:
                        off.append("2OT")
                        if x < k:
                            off.append(oppo)
                        else:
                            off.append(home_team_name)
                        off.append(game)
                    elif indicator == 9:
                        off.append("3OT")
                        if x < k:
                            off.append(oppo)
                        else:
                            off.append(home_team_name)
                        off.append(game)
                    elif indicator == 10:
                        off.append("4OT")
                        if x < k:
                            off.append(oppo)
                        else:
                            off.append(home_team_name)
                        off.append(game)
                    elif indicator == 11:
                        off.append("5OT")
                        if x < k:
                            off.append(oppo)
                        else:
                            off.append(home_team_name)
                        off.append(game)
                    elif indicator == 12:
                        off.append("6OT")
                        if x < k:
                            off.append(oppo)
                        else:
                            off.append(home_team_name)
                        off.append(game)
                    elif indicator == 13:
                        off.append("7OT")
                        if x < k:
                            off.append(oppo)
                        else:
                            off.append(home_team_name)
                        off.append(game)
                    content.append(off)
                except AttributeError:
                    continue 
    # Insert data into table
    session = Session(bind=engine)
    for player in content:
        if len(player) < 10: # length of Advanced Stat's Table
            if "Advanced" in player: # Will occur for players who Did Not Play
                db_entry = Advanced_Stats(name=player[0], dnp=True, timetype=player[2], team=player[3], game_code=player[4])
            else:
                db_entry = Basic_Stats(name=player[0], dnp=True, timetype=player[2], team=player[3], game_code=player[4])
        else:
            # Handle Time 
            if ":" in str(player[1]):
                time_naught = str(player[1]).split(":")
                minutes = int(time_naught[0])
                seconds = (int(time_naught[1])/60)
                player[1]= round((minutes + seconds), 4) 
            # Handle and Insert Float Heavy Advanced Stats
            if "Advanced" in player:
                player[1] = mk_float(player[1])
                dnp_a = True
                if player[1] < 1/75: # Check for badly Generated BPM(+/-) for Players incorrectly entered in as having played a second in a game. In Reality: DNP 
                    player[16] = 0.0
                    dnp_a = False
                db_entry = Advanced_Stats(name=player[0], minutes_played=player[1], ts_pct=mk_float(player[2]), efg_pct=mk_float(player[3]), fg3a_per_fga_pct=mk_float(player[4]),
                                          fta_per_fga_pct=mk_float(player[5]), orb_pct=mk_float(player[6]), drb_pct=mk_float(player[7]), trb_pct=mk_float(player[8]), ast_pct=mk_float(player[9]), stl_pct=mk_float(player[10]),
                                          blk_pct=mk_float(player[11]), tov_pct=mk_float(player[12]), usg_pct=mk_float(player[13]), off_rtg=mk_float(player[14]), def_rtg=mk_float(player[15]), bpm=mk_float(player[16]), dnp=dnp_a, timetype=player[17],
                                          team=player[18], game_code=player[19])
                
            else:                                    
                try:
                    # Insert Basic Stats
                    db_entry = Basic_Stats(name=player[0], minutes_played=player[1], fg=player[2], fga=player[3],
                    fg_pct=mk_float(player[4]), fg3=player[5], fg3a=player[6], fg3_pct=mk_float(player[7]),
                    ft=player[8], fta=player[9], ft_pct=mk_float(player[10]), orb=player[11],
                    drb=player[12], trb=player[13], ast=player[14], stl=player[15], blk=player[16],
                    tov=player[17], pf=player[18], pts=player[19], bpm=mk_float(player[20]), dnp=False, timetype=player[21],
                    team=player[22], game_code=player[23])
                except:
                    # Handle Empty Floats
                    fg_pct = 0
                    fg3_pct = 0
                    ft_pct = 0
                    db_entry = Basic_Stats(name=player[0], minutes_played=player[1], fg=player[2], fga=fg_pct,
                    fg_pct=player[4], fg3=player[5], fg3a=player[6], fg3_pct=fg3_pct,
                    ft=player[8], fta=player[9], ft_pct=ft_pct, orb=player[11],
                    drb=player[12], trb=player[13], ast=player[14], stl=player[15], blk=player[16],
                    tov=player[17], pf=player[18], pts=player[19], bpm=mk_float(player[20]), dnp=False, timetype=player[21],
                    team=player[22], game_code=player[23])
        session.add(db_entry)
    # Being function-defined and performing heavy write operations, these consecutive inserts must be done in a transaction to prevent incomplete inserts.  
    session.commit()
    session.close()
    pprint.pprint("processed game...")
    time.sleep(1)

'''### ____ FLAT FILE WRITER _____
    with open("list_five.txt", "a", encoding="UTF-8") as writer:
        for item in content:
            for elem in item:
                try:
                    writer.write(elem + ',')
                except UnicodeEncodeError:
                    try:
                        elem = unicodedata.normalize("NFKD", elem)
                        writer.write(elem + ',')
                    except UnicodeEncodeError:
                        print("UnicodeError with {}".format(elem))
            writer.write('\n')
        writer.close()
        #time.sleep(0.5)'''

with concurrent.futures.ThreadPoolExecutor() as executor:
    executor.map(sql_game_writer, test_data2, timeout=5)


# Test For One Game
#sql_game_writer((games[0], opponents[0]))

print(len(games))
print((time.perf_counter())-start_time)



