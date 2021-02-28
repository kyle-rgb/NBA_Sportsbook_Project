import os, requests, bs4, pprint, csv
import time, re

start_time = time.time()

os.chdir(r"C:\Users\Kyle\Desktop\nba project")

teams = ["TOR", "BOS", "PHI", "BRK", "NYK",
         "DEN", "UTA", "OKC", "POR", "MIN",
         "MIL", "IND", "CHI", "DET", "CLE",
         "MIA", "ORL", "WAS", "CHO", "ATL",
         "LAL", "LAC", "SAC", "PHO", "GSW",
         "DAL", "HOU", "MEM", "NOP", "SAS"]

schedule = r"https://www.basketball-reference.com/teams/"
teamz = r"/2019_games.html"

rez = []

regex = re.compile("(W|L)(\s\d\d|\s\d)")

away = "HOME"

overtime = "null"

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
    for x in games:
        y = x.getText()
        if y == "Box Score":
            next
        elif "@" in y:
           away = "AWAY"
        elif y == "\n":
            next
        elif "OT" in y.strip():
            overtime = y.strip()
        elif regex.search(y) != None:
            if away == "HOME":
                three_month_number_code = three_month_number_code + team 
            else:
                three_month_number_code = "null"
            rez.append(y + f",{away},{overtime},{team},{three_month_number_code}\n")
            away = "HOME"
            overtime = "null"
            three_month_number_code=""
            day_code=""
            year_code=""
        elif "," in y and (len(y) == 17 or len(y) == 18 or len(y) == 16):
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
