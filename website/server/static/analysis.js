analysis_div = d3.select("#analysis_div")

analysis_div.append("h1").text("Data Analysis").style("font-size", "105px") 

outline_columns = {
    "Data Collection": ["Web Scraping", "Data Cleaning"],
    "Model Creation": ["Variable Selection", "Model 1", "Model 2", "Model Extension"],
    "Model Evaluation": ["Sportsbook Markets Intro", "Marrying Markets and Predictions", "Best Performance"],
    "Web Application": ["Using Data to Drive Decisions", "Future Plans"]
}


let paragraphs= {"Web Scraping": ["This analysis was born out of a genuine love for basketball and the growing field of sports analytics. The Big Four American Sports have \
for too long remained achingly static in their old ways. However, the games of our parent's generation are no longer the games of this generation. Due to the emergence of a small set of vanguard \
franchises who have used data and exploited the discrepancy in information power against a slow-to-move industry, the big four sports have seen an enormous surge in stylistic and formal changes in all aspects of their games. \
From baseball pitchers throwing 1 inning to basketball players only shooting 3s and free throws, data and data analysis has proved to be the most important resource to sports franchises and looks to continue to be for the rest time. \
With the reemergence of sports gambling in the United States, the value of sports data and analysis no longer remains solely with general managers, coaches and players, but to the entire sports gambling public. \
However, with the reawakening of sports gambling comes with it the same wedding of sports media and information and sportsbooks, who have a direct financial interest in keeping you ill-informed and mystifying the analytical processes and nuances that are driving the revolutions on your TV screens. \
The goal of this project is to demystify and to build up the analytical skills to approach the sports betting landscape with a strong foundation on the true factors that influence the game in order to say a step ahead of the public and the calculating sportsbooks.",
`Although it may appear that a gambling oasis sprung up from the Supreme Court Murphy v. NCAA decision in 2018, the reality is a data wasteland of market information that leaves the retail gambler vulnerable to sportsbook that have more information than you.
The federal statute (PAPSA) that was struck down went into effect in 1992, right as the proliferation of personal computers was beginning. So where the sports information ecosystem has evolved and grown with the evolution of the computer, the market information ecosystem about these games is comparatively sparse.
In order to create a meaningful analysis of both the markets and the games using past data and a meaningful model for future projections, I chose to use past market data from online sportsbooks known colloquially as 'off-shores'. Prior to the Supreme Court decision, these were the main sportsbooks, not in a casino, where Americans could place their bets.
These sportsbooks arose with the internet and so they have been consistently creating markets for all sports matches that I can use to analyze and create a comparison point to evaluate our predictions.
There were two sources of information that I needed to start this project, (1) the resulting statistics for each game played and (2) the markets and their movements for each game.
For this project, I was concerned with the past four seasons of NBA data, starting from late 2017 to the summer of 2021. I made this decision so that are data best conforms to the way the game is played today, more three pointers, more free throws, etc.
The basketball statistics were scraped using the Requests and BeautifulSoup Python libraries from basketball-reference.com. I scraped every basic counting statistic and the more advanced statistics calculated by basketball reference in order to ascertain maximum information for each game
and make sure our variable selection for the model is thorough. The sportsbook market information was scraped using the Selenium and Requests Libraries from oddsshark.com.
Odds Shark had no direct webpage for searching historical results, but only an updatable calendar that changed by a user's action. This allowed me to enhance my webscraping skills with Selenium and write a program to simulate webpage actions and match Odds Shark's unique game classifying keys to the same games
from basketball-reference. Equipped with the game statistics and the markets, I was able to start my analysis.`],
"Data Cleaning": [`Choosing to scrape the data myself, I was able to get a relatively clean and structured information for both my datasets, thanks to beautiful logic inherent to HTML and Python.
The game statistics were very clean with small debugging only having to take place with special instances. Out of country games and uniquely hard to classify games brought about mid-season (i.e., the play-in game)
were the only games that needed special handling and further cleaning. The market information was relatively clean but provided more of a challenge. Unlike game data, which is tracked by an innumerable amount of providers and verified by the NBA,
the market data that Odds Shark tracks is fluid and can change rapidly without leaving a record behind of its history. Odds Shark listens to each sportsbook's market and records a change when it is updated for a variety of markets for each game.
Thankfully, the individual markets I am concerned with in this project have distinct probable bounds which make outliers obvious and did not occur in any systematic pattern. Additionally, since I am collecting the same markets for several different sportsbooks, faulty data entries for a single book
do not rob me from meaningful data for that particular market for the entire game. Armed with these cleaned data, I confidently began the crafting of my model.`],
"Variable Selection": [`I start my model based off the work of Dean Oliver, who's own data model determined the team level statistics that most impact winning. Since the only criteria for a win is scoring more points than your opponent, I felt this was a strong jumping off point for my own scoring model.
Oliver's model uses four variables, also known as Four Factors, to predict winning. They are (1) Offensive Rebound Percentage (2) Turnover Percentage (3) Free Throw Attempts Per Field Goal Attempts and (4) Effective Field Goal Percentage.
Offensive rebound % indicates how many of the total rebounds of a team were offensive and tells how many offensive possessions were extended due to an offensive rebound. Turnover percentage indicates the estimated turnovers for a team for every 100 possessions. It is crucial in telling the story of wasted possessions, those without a shot attempt.
Free throw attempts per field goal attempts indicates the ratio of free throw attempts per shots. Free throws are a crucial because of their uniqueness and regularity. They are shot attempts not bound by the shot or game clock which still count towards the score.
Every other in-game shot attempt is caught up and bound in time. Free throws exist out of it. Lastly, effective field goal % is the weighted average of traditional field goal percentage that accounts for the fact 3 pointers are worth 50% more than 2 pointers.
Each of these variables tells one specific part of the entire game story. Offensive rebounds tell of extended possessions, turnovers tell of wasted possessions, free throw attempts tell of free scoring opportunities and effective field goal percentage ties it altogether by telling
how well a team's possessions led to points. They form the basis of my initial model.`],
"Model 1": [{type: "img", pic: "model_1_vars.png", text: `Even though expressed above our starting model comes from a trusted, knowledgeable source
it is always important to check the structure of the variables to ensure validity, reproducibility and extrapolation of the model results.
In order to have a successful regression model, the variables must be identically distributed and independent. The above chart shows the distribution of each of the four factors distributions for the four-season time period, 2017-2018 to 2020-2021.
Each variable follows a normal distribution. Thanks to being percentages, these variables stay in routine, concrete bounds and are not affected by outlier scoring performances as basic counting stats would be.    
The identically distributed condition is met.`, width: "1000px", height:"450px"},
{type: "img", pic: "model_1_heatmap.png", text: `From the variables selection analysis above, we know that each factor tracks one piece of the basketball story.
Performance in one single factor should have no more influence on the others.
A team's proficiency in rebounding should not determine their success in effective field goal percentage, a team's turnover percentage should not determine their ability to get to the free throw line, etc.
This claim is validated by the heatmap above. Each one of the factors shows no correlation with its variable counterparts. The heatmap also confirms our intuition about our data, that teams with higher effective field goal percentages score more points and
teams with higher turnover percentages score less points. The name of the game is to put the bucket in the hoop. And with the independencecondition validated, I am lining up to take my first shot at creating a model.`, width: "800px", height:"600px"},
{type: "img", pic: "model_1_comparison.png", text: `The above boxplots show the real distribution of teams' scores and the distribution of my predictions based on the four factors. Additionally, the two key factors of R-squared and the mean squared error are shown.
The R-squared statistic indicates that 72.16% of the variability in scoring is attributable to the four factors. This reconfirms the validity of Oliver's analysis and shows we are on the right path. The mean squared error indicates the average amount our score predictions were off
the true score, squared to prevent over and under calculationsfrom canceling each other out. 
There is a key difference that deserves exploration. The model box plot has significantly more outliers than the actual scores. This can be understood by an examination of the model boxplot. The boxplot is more compressed than its score counterpart because of the model's lower standard deviation and variance.
A lower variance compresses the box and shortens its whiskers to bounds incommensurate with the true scoring distribution. This compression causes the model predictions to clump towards the mean and not properly reflect the true scoring bound of the games.
What is happening here?`, width: "1000px", height:"500px"},
{type: "img", pic: "residuals_model_1.png", text: `The residual plot makes the issue clear. As teams score more, the model's reliability decreases precipitously, creating a fanning pattern in the residuals. The likeness of our variable types, all being percentages,
presents the issue before us. There is missing data informing team scoring, but not present in our model. The model's failings with extreme values point directly to this variable: time. High scoring affairs, typical of a game that goes to overtime, never transmit to the
four factors variables. The possession level data that four factors informs on does not have its counterpart to ground them back in time. This missing data leads to larger errorsand a less informative model.`, width: "800px", height:"500px"},
],
"Model 2": [{type: "img", pic: "model_2_vars.png", text: `There is no universally agreed upon possession parameter. In theory, all possessions should lead to a scoring attempt, a continuation of the possession (a 'reset' via an offensive rebound) or a change in possession via a turnover, defensive rebound or made basket. However, the NBA's box score keeping methods create some noise that does not allow for a simple sum of a team's counting stats.
A rebound is recorded after every shot even after the first free throw and an offensive rebound is credited to a team if the ball deflects off a defender and goes out of bounds. Additionally, there are edgecase possessions that happen regularly due to the time restraints on quarters. Should we value possession that end with dribbling out the clock or a last-ditch half-court heave as much as most possessions that have the luxury of a full shot clock?
Thankfully, basketball-reference provides an estimate of possessions per 48 minutes with their pace statistic in order to account for these small, but meaningful edge cases. It does not eliminate the larger error present in games with extended time, but it provides a corrective to the previous model's clumping and fanning residuals by grounding our predictions back in time and adjusting to faster and slower played games. The added green histogram shows the distribution of the pace statistic and, like the variables before it,
confirms the identically distributed condition. The previous model had issues with predicting the tails of the points distribution, the purple histogram, incorporating possessions into the model should help us widen our predicted bounds for points by knowing how fast or slow a game is played.   
`, width: "1000px", height:"900px"},
{type: "img", pic: "model_2_heatmap.png", text: `Thankfully, the newly added game possession variable does not provide any complications to our previous model's variables. In looking at the correlation of possessions with our model's dependent variable, points, we see that possessions show a medium correlation with points. Games with a faster pace have more possessions have more shots and therefore have more points.
The independence condition and our model can be created.`, width: "800px", height:"600px"},
{type: "img", pic: "model_2_comparison.png", text: `Thanks to adding this new variable, there is a dramatic visual difference in the new model's boxplot and its evaluative measures.
The boxplot's bounds, median and whiskers now more closely resemble the true scoring distribution of points scored. The spread of the outliers also reaches the ceiling and floor of those scores actually observed in the data. The possession variable has brought our model's variance in line the real scoring distribution’s variance, allowing our predictions to be more agile in accounting for faster and slower styles.
The mean squared error of the model's predictions reduced by 60% to 2.07 and the model's R squared increased by a total of 23%. Now 95.76% of the variability in the scoring is accounted for by the variables in our model, four factors and pace.`, width: "1000px", height:"500px"},
{type: "img", pic: "residuals_model_2.png", text: `The effect of the possession variable on the new predictions can be understood further by the model's residual plot. The scatter of the residuals of the new model are now homoscedastic, no visible trend in the residuals. The model is no longer worse at predicting high scores than it is at predicting low or average scores.
The fanning pattern that revealed itself in the first model disappears with the admittance of the new pace variable. This is as close to perfect as a linear regression model can get without overfitting the data. The model has a high R squared, a low average squared error and a select number of noncorrelated variables.
Equipped with this model, I can now confidently build out predictions for future scores knowing that I have a tested, working model.`, width: "800px", height:"500px"}],
"Model Extension": [`The model creation portion of this project is only a sliver of the predictive modeling process. It is the end of the beginning. It is crucial to have a working model to locate the variables that have the most influence on the number the model predicts. However, the model works with perfect information, a luxury that no human or sports gambler will ever have.
This does not soil the model's usefulness, but it does mean our data has to be transformed to register this knowledge gap. To do so, I chose three specific factors to adjust my data to make the model useful for future predictions. The separate factors are windowing functions, aggregations and windowing periods. I want my predictions to incorporate all available past data in order to predict an individual team's next game score. The windowing functions I use are rolling, expanding and exponentially weighted window. The windowing periods I define are 10, 15 and 20 days. The aggregations I use are mean and median.`,
`Windowing functions form the basis of my projections. They allow me to incorporate a select number of a team's past four factors and pace statistics, determined by the windowing period, that have already been generated
and use these to predict future scores. Each of the selected windowing functions provides a different selection of past games to inform a team's next game's variables. The rolling window selects and aggregates on only the last windowing period's amount of games. It considers only recent past performance to inform its predictions.
The expanding window starts at the widowing period's amount of games and expands outward to integrate each new game's set of results. Here, the starting window period is crucial in determining the rest of its season predictions. Exponentially weighted mean takes the amount of games from the windowing period and applies an exponentially higher weight to more recent results.
Of the three functions, it is the one that places the most emphasis on the most recent result and factors it immediately into the next prediction. Each of these windowing functions allow me to approach the available data and evaluate teams from various different angles. The rolling window gives a snapshot on how well a team in performing in the last window period's set of games.
The expanding window tells how well a team performs throughout the season. The exponentially weighted window places the greatest emphasis on the last game played and extends priority to the most recent games played in the window period. It tells the story of how a team is playing right now and places less on games that happened farther in the past.
The windowing periods of 10, 15 and 20 games were selected to represent a meaningful set of sample games during the 82 game season. The aggregations of mean and median are used to give me different representation of the variable values during the window period. Mean supplies the average and is influenced by tail values and median supplies the 50th-percentile outcome and is less influenced by extreme values.`,
`Altogether, each one of these separate factors come together and provide the projected four factors and pace of a team given its past results. These variable projections are then input into my model which returns a score projection for each team for every game. In order to have projections for the start of the season, I use a team's averages of their four factors and pace from the previous season. This informs the team's projections for the starting window period until enough games are played in a season while still joining in current results.
The total set of models predicting a team's four factors and pace involves the combination of each window period, function and aggregation, which total to 18 models. Due to the aggregation inherit to the exponentially weighted window (i.e., the application of weights), the window can only be aggregated with mean. I chose to apply different smoothing values to the functions weight in an effort to explore the different capabilities of this particular windowing function.
Since each windowing function is working on the same data, I built a function, makeModel, to programmatically create each model permutation, fed these projected variables into the scoring model and return the scoring projections.
To evaluate and compare each model's effectiveness, I must now bring in the second part of this project, the sportsbook market data.   
`],
"Sportsbook Markets Intro": [`Since my model creates score projections for a team for each game adjusted by their past four factors and possession results, I chose to focus on the three major sportsbook markets that are derivatives of team scoring and are created for each game. The three markets focused in on this project are the total, the combined scores of both teams for a game, the spread, the additive inverse of a team's score and their opponents, and the moneyline, the odds associated with a team's score being higher than that of their opponents (i.e., that the team wins).
I selected these three markets because they allow my score projection to provide insights on different facets of the game and my data source of past markets, Odds Shark, only tracks these traditional markets.`, `Each of the separate markets, how it is structured and how my predictions inform on them deserve further analysis.
Two numbers comprise the spread and totals market. The spread number indicates how many points must be added or subtracted to a team's projected score in the market in order for the two projected scores to match. The favorite will always have a negative spread and the underdog's associated spread will always be the (positive) additive inverse of this number.
For the totals market, one number exists for each game which creates a binary market. The total is the sum of the projected scores for each team and the market presents the decision of whether the real total score of the game will be over or under this market sum. Attached to these market numbers is the previously referenced second number, the odds. The odds constitute the price one must pay for in order to place a bet on the market.
The third and final market, the moneyline, is solely comprised of its odds. They represent the wager a bettor must place if they believe the team will win the game.
For American bettors, the sportsbook's odds represent the payment outcome for a winning wager centered on $100 bets.
If the odds are negative, a bettor must wager this number to win $100. When positive, the odds represent the payout based on a $100 wager. The sportsbook market sets an initial number based on own past data of the sport and other sportsbook's market for the same game in an effort to select a number that will generate equal betting action on both sides.
The sportsbook will adjust these numbers as bets begin to take place with the goal to find an equilibrium in the market.`, `Having these specific market data for each game allows me to evaluate the effectiveness of my single score prediction for each team against the real market conditions present at the time of the game.
The sportsbook acts as an aggregate model that combines all the individual bettors that trust their own predictions enough to place a wager on it and sets a single number that corresponds to all these individual wagers.
All the information from sports media drivel to complicated mathematical models collectivizes in the market and provides for me a wealth of information to evaluate the performance of my model to the real-world conditions of the market.
All in five simple numbers. The goal of my project is to use this historical market data with my prediction model to make selections for each game's markets, grade these based on the true results and find the model that optimizes winning over the large sample of four seasons. 
`],



"Marrying Markets and Predictions": [`The core of this project is to test my different model permutations to create the five predictive variables described in model 2, feed these projected variables into the scoring model and compare these scoring projections to the markets in order to decide which side of the market to place a bet on.
The evaluations of these bets against the real outcome of the game will guide me to the best model. The benchmark for these market decisions will be > 50%, representing the two possible outcomes for each market. Each of the respective teams for the spread and moneyline markets and the over or under for the totals market.
Since this is a binary decision, good and bad models have the ability to inform the usefulness of a model's decisions. A bad model is just as impactful in telling what bets not to place as a good model tells us which ones to place.
Here the center of the data, 50%, is our real dreaded enemy. Finding the model that places bets which meaningfully diverge from this 50% baseline is the ultimate goal. In order to systematically compare each one of my different model permutations, I defined a custom Python class, ModelAnalyzer, to combine both the markets and the game data sources, handle manipulation of the data sources and creation of their derivatives, and evaluate the success of a model's decisions.`,
`To acquire a decision for each game, the scoring data needs to be transformed into the equivalent markets. The sum of both team's model score projections represents the projected total. The additive inverse of the difference between teams' scores represents the projected spread. The greater of the two projected scores represent the projected moneyline decision.
The total and spread must reference the true market value in order to arrive at their respective decisions. Since the decision point for each market is game specific, the decisions must all be made with respect to a single team for evaluative purposes. I chose to ground my predictions to the home team. Due to the nature of betting, a single decision in favor of a team implies the inverse of this decision to their opponent.
Grounding the decisions to a single team, allows the initial team specific projections to create three game specific decisions and for these decisions to be easily evaluated.
The decisions for spread and total come from comparison of the combination of the projected scores with the individual market lines. If the projected spread is less than the market's spread, the home team will be selected, otherwise the away team. Similarly, if the projected total is less than the market's, the under will be selected, otherwise the over.
Once these decisions are made, the real markets are calculated and compared to the market's lines in order to evaluate which side of the market won based on the results of the game. The comparison of the market to the reality of the game is then compared directly to our model's decision matrix given the same market and evaluates how often the model's decisions matched reality.
Moreover, these graded decisions are then passed to a new matrix that contains the odds of the model's respective decisions and multiplied by the amount bet on each game by the associated odds for that market decision.`,
`What is left are a graded decision matrix based off all my bets and a winnings matrix based on the payout of all my decisions times their associated odds. These resulting matrices from my ModelAnalyzer's methods allow me to quickly and thoroughly evaluate the effectiveness of each different model's permutation in terms of winnings percentage and
amount of dollars won. The final model selection process can now begin.`],


"Best Performance": [{type: "img", pic: "table.png", text:`As referenced in the Sports Market Intro, the three subcategories' for the projection model, window-size, widow-type and aggregation type, variable combinations break down to 18 different models that predict a team's scoring model variables based on transformations unique to each model and its variable values. The benchmark for the spread and totals markets is 50% and 57% for the moneyline market.
Unlike its peer markets, the moneyline market consists only of odds and uses a wider range of odds to get equal action on both sides.
Since the model decision and grades are connected to the home team, the percentage of games won by the home team from 2017 to 2021 was 57%.
The goal is to find the best performer of the 18 models that exceeds the resepective benchmarks of the market and balances winning predictions across each market.
The process flow for each model is using the window-type, window-size and aggregations to generate a team's next game four factors and pace based off its past data, passing these predicted variables to the scoring model to generate a score prediction, calculating the projected markets based off these projections, comparing the projected markets to a common market to genereate a decision and using the game results
to grade these decisions. The baseline market I used to compare models was the opening market.
The opening market represents the first numbers and odds offered by one of the analyzed sportsbooks directly after a team's last game.
Since my models can generate their predictions immediately upon the conclusion of a team's last game, the opening market summarizes the best conditions my model can hope for before sportsbooks move their lines to conform to incoming wagers.
<br>

The results of each individual model are contained in the table above. For all the models, the moneyline market represented the highest positive deviation from the benchmark, 57%. 13 of the 18 models exceeded the benchmark and provide discernible value in choosing the winner of individual games backtested across 4 seasons worth of data.
The models that failed to exceed the moneyline benchmark were the 20-day expanding median, 10-day rolling median and the exponentially-weighted mean with an alpha of 0.5.
The shortcomings of the median models predictions are exemplified by these particular poor performances.
Since the expanding window grounds its predictions in a team's begining season results, the median projections for the four factors and pace tend to stay the same and will not unless a team over or underperforms for more than half the season. The result of this is a score projection that mostly stays the same over the entirety of the season, thus an expanding median model will never pick a team it values as less than its opponent to win.
Due to the variability of single game's results, expanding median models provide moneyline predictions worse than the baseline.
The 10 day rolling median suffers from a small sample size. 10 games represents only an eigth of the NBA regular season. Team performance can vary wildly during this small of window due to injuries, luck or strength of schedule, factors that appear in the data for models with larger sample sizes.
The final model to underperform the moneyline benchmark was the exponentially-weighted mean with alpha equal 0.5. Alpha is the numerical factor handling how past results should be weighted for future predictions. The high alpha value places more importance on a team's preceding four factors and pace and less on the other games in the window size than the other exponential model with a smaller alpha.
The extreme emphasis on the preceding game led to the worst performance of any model compared to the market's benchmark.
The best performing model was the 10-day expanding mean. Unlike the expanding median models, the expanding mean model changes with every new data point and generates unique predictions for each game.
The small window size creates a fluid prior which more easily shifts its evaluation of a team to current results. Since I use a team's previous four factors and pace averages from the last season to inform the starting window for each season, the smaller window allows for the scoring model to more quickly reevaluate those teams who have acquired or lost talent during the offseason.
Unlike the rolling model, the decreased window size helps the expanding models generate more winning decisions.   

<br>
17 out of the 18 models exceeded the spread market benchmark of 50%.
Of all the markets and models analyzed, the 10-day expanding median was the only model that produced more losses than wins.
The causes of this underperformance are similar to those of 20-day expanding median and the moneyline market.
The combination of an expanding window and a median aggregation lead to flat score projections that require a large amount of data to change.
This resistance to change is shown in the model's relative poor benchmark performance across markets.
Even its overperformance in the totals markets do not make up for the lack elsewhere.
Of all the model types, only the exponentially-weighted mean models with a high alpha performed worse in total wins.
The best performing spread models were the 15-day and 10-day rolling median that produced 144 and 128 more wins, respectively. Using only the 50th percentile factor outcomes during these smaller window period proved to be the best approach to beat the notoriously tough market.      

<br>
All of the 18 models exceeded the totals market benchmark of 50%.
The 20-day and 15-day expanding median as well as both exponentially-weighted mean models generated consistently winning bets.
Though they faltered in their spread and moneyline predictions, the consistent score predictions landed the total prediction on the right side most often.
Interestingly, the exponentially-weighted models, which placed the most weight on a team's preceding game factors, also generated the best totals bets.
The best performance in the totals market came from those models either steadfast in thier evaluations of a team or wildly oscillating from one game to the next.
Neither approaches proved successfully in selecting the winner or spread winner for a game, but they did provide the best strategies for approaching the total markets.       
<br>
Now understanding how the models grade out, I can select the best overall model.
The best model for overall betting performance is the 10-day expanding mean.
The model's moneyline winning percentage has the greatest positive deviation from the market baseline of all the models and generates winning wagers for the spread and totals market.
The preference for the best moneyline model is because correct decisions on the market provide for asymmetrical winnings.
The higher odds present in this market make correct predictions here more valuable than wins in other peer markets.
The model best balances winning across the seperate markets and provides inherent upside in its accuracy in moneyline predictions.

`,
width: "1050px", height:"335px"}],

"Using Data to Drive Decisions": [`The structure of the web application follows the structure of the NBA season. The starting dashboard gives an overview of the selected season. The scatter chart plots the winnings of every bet my final model selected per day throughout the season. Along with these points, the five day moving average of the winnings is plotted to show the performance trend of my model as the season progressed.
The dashboard's filters also contain the analyzed sportsbook along with season. The records for the three markets analyzed by the selected sportsbook are presented in the first table. These aggregate records represent the grades for my picks based off the closing lines offered for this sportsbook, which the secondary table breaks down by team. The dashboard performs as a hub to indicate how the model performed through time and against which baseline (sportsbook). From here, there are two paths to further analyze the data. The team table links to each team's breakdown page that expands and visualizes an individual team's variables and model performance.`,
`Here the aggregate records are broken down for each of the individual markets detailing the times the model chose the side of this particular team, the graded records of the model's picks involving this team, and the team's actual record when comparing the market to the results of the game. Next to these records are the major bounds of the cumulative returns for bets placed on this team. The bounds represent the maximum, minimum and final returns that picks made involving this team generated during the given season.
Moving to the charts, the collected histograms show the distribution of the team's and its opponent's four factors, the key variables in the scoring model. These visual instruments provide a look into backend of the model that ultimately influenced the crucial decision point.
Below, the cumulative winnings generated by the team's games are plotted versus time. I chose to show cumulative winnings as a representative of the model's performance because the individual game winnings data points do not represent the compounding effect of placing bets. A win and a loss in terms of winnings are similarly equivalent and make for a noisy graph. The cumulative winnings, however, allows the bettor to observe the health of her bankroll over the course of the season.
It keeps the bettor informed on the long-term results on placing bets on this team's by each market and as a whole. Finally, the individual game data points that make up the team analysis are presented in the bottom table. The table contains each team's model projected score, market projected score and actual score for each game. The table provides a brief overview on the different valuations of the game and the true result as well as a link to the game's page which expands on each of these numbers and provides all the data considered for each decision point.
The rows are colored based on whether or not the bets placed on the game as a whole positively contributed to the bankroll.`,
`The Game Log section of the web application gives an expanded view of the abbreviated game table found on the team's page. Along with the model projections and scores, it shows the average of the sportsbooks for each market, the grades and winnings based on these averages and the sportsbook with the highest odds for a particular game. The rows, as before, correspond to the sign of the aggregate winnings.
The page provides the user a quick summary of each game and the ability to quickly move in and out of wanted analyzed games without having to go back to return to a team's page.`,
`The lowest level of the application corresponds to the highest degree of specificity in my data, the game page. The game is the elemental unit serving as the bedrock for all my analyses.
The game page gives the application user a through analysis of all the important numbers factoring into my decision for the game. It combines the model and market data with the actual results to allow for a more detailed analysis of the market and the model.
The filter allows the user to select any of the sportsbooks that had market data for the game and evaluate the model based on the book's number and the true results. The team columns feature the results, four factors, pace and scoring, and projections, model and market, for the team. The middle sportsbook column shares its markets, the difference of these markets against the model's, the true markets given the results and the markets and model's errors.
These columns explain my decision point and its grade. The goal of this project to create correct predictions depends on my error being consistently lower than the market's. Seeing the degree to which the market's and my own projections diverge from each other and the true result, illustrates the user in the reasoning behind the model's decisions and evaluation.
The picks based on these numbers are presented in the lower left column. The lowest lines of the analyzed sportsbooks are given for each market in the lower right column.
Further down, the scatter charts plot the evolution of the spread and total market numbers through time. The charts provide the user with an understanding on how these markets adjusted their numbers from their opening until tipoff. The simple charts showcase the market's entire lifecycle, its ceiling, floor and resistance for the analyzed books.
Timing matters in sports gambling and observing how these markets either converge or diverge from my projections arms the user with more knowledge about my predictions and the market.
The final visualization gives the odds of the sportsbook and the winnings of my model's decision based off the market's number and odds. Like the table rows, the circles housing the odds and winnings are colored based on the particular pick's grade.`],

"Future Plans": [{type: "li", text:`Player Based Modeling`, inner_text: `The data scraped for this project includes all the available player data by game from basketball reference. Basketball reference segments player data by quarters and halves, but only for its basic counting statistics; the site calculates advanced statistics only for the complete game. In the effort to avoid further complicating my models, I elected to focus my models on teams and their game total statistics.
Now having the experience in building these models, I believe my analysis can be improved by bringing in player specific projections. Player projections would allow my model to reevaluate teams based on the bevy of new information generated by trades, free agency and injuries every season.
My models could only be improved by incorporating this new data.`},
{type: "li", text: "Bayesian Linear Regression", inner_text: `Along with enhancing the model specificity with player predictions, I would also like to approach the model creation phase from a more nuanced position. Using a Bayesian linear regression model, I would be able to attach specific uncertainty to my predictions beyond the predictions deviation from the market.
The uncertainty produced by a Bayesian model can be compared directly to the odds provided by each market and add more useful information to my decision-making process. Beyond this, a bayesian approach also provides a distribution of values for its scoring predictions to account for the inherit variability of single game basketball scores.`},
{type: "li", text: `Predictive Analysis on Current Games`,  inner_text: `The webscraping scripts developed for this project can be easily extended to the current NBA season. The scripts integration into the server will help provide users with the most up-to-date predictions on the day's games. On the market side, it can also alert users to currently available markets that deviate the farthest away from their peers and my prediction.`},
{type: "li", text: "Collecting and Analyzing Live Data",  inner_text: `As the sports betting industry awakes from its slumber, a treasure trove of new basketball markets has been and continue to be created. There is always a new combination of statistics or player props being offered in the market. The market now extends during the game and provides lines after every play. This appears to be the next frontier of sports gambling because of the short lifespan of these markets.
Whereas the traditional markets get bet up and down by bettors over an extended period of time and verified by comparisons to a book's peers, the live markets have to adjust to every individual play and the live wagers in real time. Thanks to the time-based nature of the player data described above, a player based model based in time could provide key information for live betting in the future.
This would entail collecting a large amount of streaming data from each website's live applications in order to understand how these live markets react to live data, requiring me to pair them with play-by-play data.`}],

}

model_images = {"Model 1": ["model_1_vars", "model_1_heatmap" ,"model_1_errors_box", "model_1_comparison"]}
section_colors = ["cyan", "blue", "yellow", "red"]
i = 0 
for (k of Object.keys(outline_columns)){
    
    analysis_div.append("h3").append("i").append("u").text(k).style("font-size", "55px") 
    for (j of outline_columns[k]){
        analysis_div.append("h4").text(j).style("font-size", "35px").style("color", section_colors[i])

        if (j in paragraphs){
            for (let i =0; i <paragraphs[j].length; i++){
                if (typeof(paragraphs[j][0]) === "object" & paragraphs[j][0].type === "img"){
                    var obj = paragraphs[j][i];
                    analysis_div.append(obj.type).attr("src", `static/assets/images/Graphs/${obj.pic}`).attr("width", obj.width).attr("height", obj.height)
                    analysis_div.append("p").text(obj.text.split("<br>")[0])
                    analysis_div.append("br")//.text(obj.text)
                    if (obj.text.includes("<br>")){
                        let remeaning_text = obj.text.split("<br>").slice(1)
                        for (r of remeaning_text){
                            analysis_div.append("p").text(r)
                            analysis_div.append("br")
                        }
                    }


                } else if (paragraphs[j][0].type === "li"){
                    var obj = paragraphs[j][i];
                    var ul; 
                    if (i === 0){
                        ul = analysis_div.append("ul").attr("id", "futurePlans").attr("align", "left")
                    } else {
                        ul = d3.select("#futurePlans")
                    }
                    let li = ul.append(obj.type)
                    li.append("b").text(obj.text).style("font-size", "20px")
                    li.append("ul").append("li").text(obj.inner_text)

                } else {
                    analysis_div.append("p").text(paragraphs[j][i])
                    
                }

               
            }
            
        }
        
        analysis_div.append("br")
    }

    i++

}




