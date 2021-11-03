import time, sys, requests, bs4, os, json, pandas as pd
from selenium import webdriver

# Test For Getting Game Specific Data
matchup_links = []
#driver = webdriver.Chrome("./Python/scraping/chromedriver.exe")

# driver.get("https://www.oddsshark.com/nba/scores")
# time.sleep(5)
# button = driver.find_element_by_css_selector('button.button--arrow-left')
# wanted_links = driver.find_elements_by_link_text('Matchup')
# for link in wanted_links:
#     matchup_links.append(link.get_attribute("href"))
# print(matchup_links)
# time.sleep(5)
# button.click()
# time.sleep(5)
# driver.quit()

# These two tasks should be handled functionally.
# Test For Grabbing Books Data For Sample Game
def grabLines(url):
    # Press See More Button
    response = requests.get(url)
    soup = bs4.BeautifulSoup(response.text, features="lxml")
    tables = soup.select("script")
    table = json.loads(tables[2].text)
    i = 0
    odds_shark_df = pd.DataFrame(columns=["home_abbv", "away_abbv", "date", "game_id"])
    book_df = pd.DataFrame(columns=["team_abbv", "Book", "ML", "Spread", "Odds", "Total", "Over", "Under", "game_id"])
    table = table["oddsshark_gamecenter"]
    # Gather Nominal Game Data
    odds_shark_df.loc[i, "home_abbv"] = table["matchup"]["home_abbreviation"]
    odds_shark_df.loc[i, "away_abbv"] = table["matchup"]["away_abbreviation"]
    odds_shark_df.loc[i, "date"] = table["matchup"]["event_date"]
    odds_shark_df.loc[i, "game_id"] = table["matchup"]["event_id"]
    # Gather Odds Data
    bookmaker_list = table["odds"]["data"]
    for book in bookmaker_list:
        spread = book["money_line_spread"]
        # keys = ["home", "away"]
        for k in spread.keys():
            book_df.loc[i, "game_id"] = table["matchup"]["event_id"]
            book_df.loc[i, "Book"] = book["book"]["book_name"]
            book_df.loc[i, "Over"] = book["over_under"]["over"]
            book_df.loc[i, "Under"] = book["over_under"]["under"]
            book_df.loc[i, "Total"] = book["over_under"]["total"]
            if k == "home":
                book_df.loc[i, "team_abbv"] = table["matchup"]["home_abbreviation"]
            else:
                book_df.loc[i, "team_abbv"] = table["matchup"]["away_abbreviation"]
            book_df.loc[i, "ML"] = spread[k]["money_line"]
            book_df.loc[i, "Spread"] = spread[k]["spread"]
            book_df.loc[i, "Odds"] = spread[k]["spread_price"]
            i+=1    
    #book_df=book_df.fillna(method="ffill")
    print(book_df)

    # with open("data_structure.txt", "a") as file:
    #     file.write("\n")
    #     file.write(f"{table['oddsshark_gamecenter'].keys()}")
    #     # for key, value in table["oddsshark_gamecenter"].items():
    #     #     file.write("> " + key)
    #     #     file.write("\n")
    #     #     if type(value) == dict:
    #     #         for k in value.keys():
    #     #             file.write("\t> " + str(k) + "\n")
    #     file.write("\n")
    #     file.close()
    #print(response.text)
    # Gather Book Table (for Moneyline and Spread)
        # 2 Rows per Book 
            # Top: Away - ML Odds - Spread Line (Odds)
            # Bottom: Home - ML Odds - Spread Line (Odds)
    # Press Total/Ou Button
        # 2 Rows for over odds (away column) and under odds ()
        # As Well As A Joined Column encasing the book's total number (since there is only one number here)
# Test For Grabbing Time Based Line Information From Embedded Link in Game Page
    # Get Element on Game Page Where Link Text is Line History
    # Will Come to a Page With Book Information and Time Information for Available Books
    # Table be structured as such:
        # Table Headers
            # Bookname
            # Line (Home)
            # Over / Under
        # Table Rows
            # Bookname: A UTC Timestamp on Lines and Odds at Specific Book at this moment in Time
            # Line (Home): Contains Both Book's Line and Associated Odds at time point
            # Over / Under: Total and Book's Assocaited Odds at time point (curiously these totals have a spread-like look to time with an explicit + sign. Will need to be cleaned)


grabLines("https://www.oddsshark.com/nba/denver-utah-odds-october-26-2021-1459586")