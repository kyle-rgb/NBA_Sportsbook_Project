import os, requests, bs4, pprint, csv
import time, re

#Timing Write Process
start_time = time.time()

# Change Directory to Current Repo
os.chdir(r"C:\Users\Kyle\Desktop\Python\Nba_Revised\Setting_Lines_and_Making_Dimes\nba_scrape")
# 3 Letter Identifier For Each of the 30 Teams
teams = ["TOR", "BOS", "PHI", "BRK", "NYK",
         "DEN", "UTA", "OKC", "POR", "MIN",
         "MIL", "IND", "CHI", "DET", "CLE",
         "MIA", "ORL", "WAS", "CHO", "ATL",
         "LAL", "LAC", "SAC", "PHO", "GSW",
         "DAL", "HOU", "MEM", "NOP", "SAS"]
# Base URLs (going through each Team's page and gathering game data for each season) :: The 2019 Games encapsulates the 2018-2019 Games which conclude in 2019.
schedule = r"https://www.basketball-reference.com/teams/"
teamz = r"/2019_games.html"

# List to store each game 
rez = []
# Steak Parser
regex = re.compile("(W|L)(\s\d\d|\s\d)")
# Parser for Special Game Sites
special_site_regex = re.compile("at (London, England|Mexico City, Mexico|Paris, France)")
# Location indicator variable :: switch on presence of '@', designating an away game
away = "HOME"
# Overtime base variable :: switch on when '{\d}?OT' occurs in row
overtime = "null"
# Neutral Site Location Variable
location = "null" 
# Variables to translate the current date to its numerical representation in order to get the proper game codes
three_month_number_code = ""
day_code = ""
year_code = ""

code_dict = {"Oct": '10', "Nov": '11', "Dec": '12', "Jan": '01',
             "Feb": '02', "Mar": '03', "Apr": '04', "May": '05',
             "Jun": '06', "Jul": '07', "Aug": '08', "Sep": '09'}


for team in teams:
    response = requests.get((schedule + team + teamz))
    soup = bs4.BeautifulSoup(response.text)
    games = soup.select("div > table > tbody > tr > td")
    # Iterating through each data row for each columns 
    for x in games:
        # Extract text the row's Columns
        y = x.getText()
        # Skip Box Score hyperlink
        if y == "Box Score":
            next
        # Switch from home to away
        elif "@" in y:
           away = "AWAY"
        # Empty Cell
        elif y == "\n":
            next
        # Switch on OT
        elif "OT" in y.strip():
            overtime = y.strip()
        elif special_site_regex.search(y) != None:
            location = y        
        # Winning/Losing Streak Cell Found, indicating end of line
        elif regex.search(y) != None:
            # Only create the url Code for Home teams b/c home teams define the game codes
            if away == "HOME":
                three_month_number_code = three_month_number_code + team 
            else:
                three_month_number_code = "null"
            # Add Dates and changing variables as well as line terminators to finish game entry
            rez.append(y + f",{away},{overtime},{team},{three_month_number_code}\n")
            # Reset mutable variables
            away = "HOME"
            overtime = "null"
            location = "null"
            three_month_number_code=""
            day_code=""
            year_code=""
        elif "," in y and (len(y) == 17 or len(y) == 18 or len(y) == 16): # Date Handler
            rez.append(y + ",")
            y = y.split(",")
            date = y[1]
            date = date.strip()
            date = date.split(" ")
            three_month_number_code = date[0]
            try:
                day_code = date[1]
                if len(day_code) < 2:
                    day_code = "0" + day_code
                three_month_number_code = code_dict[three_month_number_code]
                year_code = y[2]
                year_code = year_code.strip()
                three_month_number_code = year_code + three_month_number_code + day_code + "0"
            except:
                print(f"{date} problem")
        elif len(y) != 0:
            rez.append(y + ",")
        else:
            next
    
with open("results_Season.txt", "w", newline="\n") as file:
    for i in rez:
        file.write(i)
    file.close()
    
print("{} seconds".format(time.time()-start_time))
