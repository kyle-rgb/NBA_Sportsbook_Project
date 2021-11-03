import time, sys
from selenium import webdriver

# Test For Getting Game Specific Data
matchup_links = []
driver = webdriver.Chrome("./Python/scraping/chromedriver.exe")

driver.get(r"https://www.oddsshark.com/nba/scores")
time.sleep(5)
button = driver.find_element_by_css_selector('button.button--arrow-left')
wanted_links = driver.find_elements_by_link_text('Matchup')
for link in wanted_links:
    matchup_links.append(link.get_attribute("href"))

print(matchup_links)
time.sleep(5)
button.click()
time.sleep(5)
driver.quit()

# Test For Grabbing Books Data For Sample Game

# Test For Grabbing Time Based Line Information From Embedded Link in Game Page
