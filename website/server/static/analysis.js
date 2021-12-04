analysis_div = d3.select("#analysis_div")


console.log(analysis_div)

analysis_div.append("h1").text("Data Analysis").style("font-size", "105px") 

outline_columns = {
    "Data Collection": ["Web Scraping", "Data Cleaning"],
    "Model Creation": ["Variable Selection", "Model 1", "Model 2", "Model Extension"],
    "Model Evaluation": ["Sportsbook Markets Intro", "Marrying Markets and Predictions", "Best Performance"],
    "Web Application": ["Using Data to Drive Decisions", "Future Plans"]
}


let paragraphs= {"Web Scraping": ["This analysis was born out of a genuine love for basketball and the growing field of sports analytics. The Big Four American Sports have\
for too long remained achingly static in their old ways. However, the games of our parent's generation are no longer the games of this generation. Due to the emergence of a small set of vanguard \
franchises who have used data and exploited the descrepancy in information power against a slow-to-move industry, the big four sports have seen an enormous surge in stylistic and formal changes in all aspects of their games.\
From baseball pitchers throwing 1 inning to basketball players only shooting 3s and free throws, data and data analysis has proved to be the most important resource to sports franchises and looks to continue to be for the rest time.\
With the reemergence of sports gambling in the United States, the value of sports data and analysis no longer remains solely with general managers, coaches and players, but to the entire sports gambling public.\
However, with the reawakening of sports gambling comes with it the same wedding of sports media and information and sportsbooks, who have a direct financial interest in keeping you ill-informed and mystfying the analytical processes and nuances that are driving the revolutions on your TV screens.\
The goal of this project is to demystify and to build up the analytical skills to approach the sports betting landscape with a strong foundation on the true factors that influence the game in order to say a step ahead of the public and the calculating sportsbooks.",
`Although it may appear that a gambling oasis sprung up from the Supreme Court Murphy v. NCAA decision in 2018, the reality is a data wasteland of market information that leaves the retail gambler vulnerable to sportsbook that have more information than you.
The federal statute (PAPSA) that was struck down went into effect in 1992, right as the proliferation of personal computers was beginning. So where the sports information ecosystem has evolved and grown with the evolution of the computer, the market information ecosystem about these games is comparatively sparse.
In order to create a meaningful analysis of both the markets and the games using past data and a meaningful model for future projections, I chose to use past market data from online sportsbooks known colloquially as 'off-shores'. Prior to the Supreme Court decision, these were the main sportsbooks, not in a casino, where Americans could place their bets.
These sportsbooks arose with the internet and so they have been consistently creating markets for all sports matches that I can use to analyze and create a comparison point to evaluate our predictions.
There were two sources of information that I needed to start this project, (1) the resulting statistics for each game played and (2) the markets and their movements for each game.
For this project, I was concerned with the past four seasons of NBA data, starting from late 2017 to the summer of 2021. I made this decision so that are data best conforms to the way the game is played today, more three pointers, more free throws, etc.
The basketball statistics were scraped using the requests and beautifulsoup Python libraries from basketball-reference.com. I scraped every basic counting statistic and the more advanced statistics calculated by basketball reference in order to ascertain maximum information for each game
and make sure our variable selection for the model is thorough. The sportsbook market information was scraped using the Selenium and Requests Libraries from oddsshark.com.
Odds Shark had no direct webpage for searching historical results, but only an updatable calendar that changed by a user's action. This allowed me to enhanced my webscraping skills with Selenium and write a program to simulate webpage actions and match Odds Shark's unique game classifying keys to the same games
from basketball-reference. Equipped with the game statistics and the markets, I was able to start my analysis.`],
"Data Cleaning": [`Choosing to scrape the data myself, I was able to get a relatively clean and structured information for both my datasets, thanks to beautiful logic inherent to HTML and Python.
The game statistics were very clean with small debugging only having to take place with special instances. Out of country games and uniquely hard to classify games brought about mid-season (i.e. the play-in game)
were the only games that needed special handling and further cleaning. The market information was relatively clean but provided more of a challenge. Unlike game data, which is tracked by an innumerable amount of providers and verified by the NBA,
the market data that Odds Shark tracks is fluid and can change rapidly without leaving a record behind of its history. Odds Shark listens to each sportsbook's market and records a change when it is updated for a variety of markets for each game.
Thankfully, the individual markets I am concerned with in this project have distict probable bounds which make outliers obvious and did not occur in any systematic pattern. Additionally, since I am collecting the same markets for several different sportsbooks, faulty data entries for a single book
do not rob me from meaningful data for that particular market for the entire game. Armed with these cleaned data, I confidently began the crafting of my model.`],
"Variable Selection": [`I start my model based off the work of Dean Oliver, who's own data model determined the team level statistics that most impact winning. Since the only criteria for a win is scoring more points than your oppentent, I felt this was a strong jumping off point for my own scoring model.
Oliver's model uses four variables, also known as Four Factors, to predict winning. They are (1) Offensive Rebound Percentage (2) Turnover Percentage (3) Free Throw Attempts Per Field Goal Attempts and (4) Effective Field Goal Percentage.
Offensive rebound % indicates how many of the total rebounds of a team were offensive and tells how many offensive possessions were extened due to an offensive rebound. Turnover percentage indicates the estimated turnovers for a team for every 100 possessions. It is crucial in telling the story of wasted possessions, those without a shot attempt.
Free throw attempts per field goal attempts indicates the ratio of free throw attempts per shots. Free throws are a crucial because of their uniqueness and regularity. They are shot attempts not bound by the shot or game clock which still count towards the score.
Every other in-game shot attempt is caught up and bound in time. Free throws exists out of it. Lastly, effective field goal % is the weighted average of traditional field goal percentage that accounts for the fact 3 pointers are worth 50% more than 2 pointers.
Each of these variables tells one specific part of the entire game story. Offensive rebounds tells of extended possessions, turnovers tell of wasted possessions, free throw attempts tell of free scoring oppertunities and effective field goal percentage ties it altogether by telling
how well a team's possessions led to points. They form the basis of my initial model.`],
"Model 1": [{pic: "model_1_vars.png", text: `Even though expressed above our starting model comes from a trusted, knowledgable source
it is always important to check the structure of the variables to ensure validity, reproducability and extrapolation of the model results.
In order to have a successful regression model, the variables must be identically distributed and independent. The above chart shows the distribution of each of the four factors distributions for the four season time period, 2017-2018 to 2020-2021.
Each variable follows a normal distribution. Thanks to being percentages, these variables stay in routine, concrete bounds and are not affected by outlier scoring performances as basic counting stats would be.    
The identically distributed condition is met.`, width: "1000px", height:"450px"},
{pic: "model_1_heatmap.png", text: `From the variables selection analysis above, we know that each factor tracks one piece of the basketball story.
Performance in one single factor should have no more influence on the others.
A team's proficiency in rebounding should not determine their success in effective field goal percentage, a team's turnover percentage should not determine their ability to get to the free throw line, etc.
This claim is validated by the heatmap above. Each one of the factors shows no correlation with its variable counterparts. The heatmap also confirms our intuition about our data, that teams with higher effective field goal percentages score more points and
teams with higher turnover percentages score less points. The name of the game is to put the bucket in the hoop. And with the indepence condition validated, I am lining up to take my first shot at creating a model.`, width: "800px", height:"600px"},
{pic: "model_1_comparison.png", text: `The above boxplots show the real distribution of teams' scores and the distribution of my predictions based on the four factors. Additionally, the two key factors of R-squared and the mean squared error are shown.
The R-squared statistic indicates that 72.16% of the variability in scoring is attributable to the four factors. This reconfirms the validity of Oliver's analysis and shows we are on the right path. The mean squared error indicates the average amount our score predictions were off
the true score, squared to prevent over and under calcualtions from canceling each other out. 
There is a key difference that deserves exploration. The model box plot has significantly more outliers than the actual scores. This can be understood by an examination of the model boxplot. The boxplot is more compressed than its score counterpart because of the model's lower standard deviation and variance.
A lower variance compresses the box and shortens its whiskers to bounds incommensurate with the true scoring distribution. This compression causes the model predictions to clump towards the mean and not properly reflect the true scoring bound of the games.
What is happening here?`, width: "1000px", height:"500px"},
{pic: "residuals_model_1.png", text: `The residual plot makes the issue clear. As teams score more, the model's reliability decreases precipitously, creating a fanning pattern in the residuals. The likeness of our variable types, all being percentages,
presents the issue before us. There is missing data informing team scoring, but not present in our model. The model's failings with extreme values point directly to this variable: time. High scoring affairs, typical of a game that goes to overtime, never transmit to the
four factors variables. The possession level data that four factors informs on does not have its counterpart to ground them back in time. This missing data leads to larger errrors and a less informative model.`, width: "800px", height:"500px"},
],
"Model 2": [{pic: "model_2_vars.png", text: `There is no universally agreed upon possession parameter. In theory, all possessions should lead to a scoring attempt, a continuation of the possession (a 'reset' via an offensive rebound) or a change in possession via a turnover, defensive rebound or made basket. However, the NBA's box score keeping methods create some noise that does not allow for a simple sum of a team's counting stats.
A rebound is recorded after every shot even after the first free throw and an offensive rebound is credited to a team if the ball deflects off a defender and goes out of bounds. Additionally, there are egde case possessions that happen regularly due to the time restraints on quarters. Should we value possession that end with dribbling out the clock or a last ditch half-court heave as much as most possessions that have the luxury of a full shot clock?
Thankfully, basketball-reference provides an estimate of possesssions per 48 minutes with their pace statistic in order to account for these small, but meaningful edge cases. It does not eliminate the larger error present in games with extended time but it provides a corrective to the previous model's clumping and fanning residuals by grounding our predictions back in time and adjusting to faster and slower played games. The added green histogram shows the distribution of the pace statistic and, like the variables before it,
confirms the identically distrubted condition. The previous model had isssues with predicting the tails of the points distribution, the purple histogram, incorporating possessions into the model should help us widen our predicted bounds for points by knowing how fast or slow a game is played.   
`, width: "1000px", height:"900px"},
{pic: "model_2_heatmap.png", text: `Thankfully, the newly added game possession variable does not provide any complications to our previous model's variables. In looking at the correlation of possessions with our model's dependent variable, points, we see that possessions show a medium correlation with points. Games with a faster pace have more possessions have more shots and therefore have more points.
The independence condition and our model can be created.`, width: "800px", height:"600px"},
{pic: "model_2_comparison.png", text: `Thanks to adding this new variable, there is a dramtic visual difference in the new model's boxplot and its evaluative measures.
The boxplot's bounds, median and whiskers now more closely resemble the true scoring distribution of points scored. The spread of the outliers also reaches the ceiling and floor of those scores actually observed in the data. The possession variable has brought our model's variance in line the real scoring distrbution's variance, allowing our predictions to be more agile in accounting for faster and slower styles.
The mean squared error of the model's predictions reduced by 60% to 2.07 and the model's R squared increased by a total of 23%. Now 95.76% of the variability in the scoring is accounted for by the variables in our model, four factors and pace.`, width: "1000px", height:"500px"},
{pic: "residuals_model_2.png", text: `The effect of the possession variable on the new predictions can be understood further by the model's residual plot. The scatter of the residuals of the new model are now homoscedastic, no visible trend in the residuals. The model is no longer worse at predicting high scores than it is at predicting low or average scores.
The fanning pattern that revealed itself in the first model dissappears with the admittance of the new pace variable. This is as close to perfect as a linear regression model can get without overfitting the data. The model has a high R squared, a low average squared error and a select number of noncorrelated variables.
Equipped with this model, I can now confidently build out predictions for future scores knowing that I have a tested, working model.`, width: "800px", height:"500px"}],
"Model Extension": [`The model creation portion of this project is only a sliver of the predictive modeling process. It is the end of the beginning. It is crucial to have a working model to locate the variables that have the most influence on the number the model predicts. However, the model works with perfect information, a luxury that no human or sports gambler will ever have.
This does not soil the model's usefulness, but it does mean our data has to be transformed to register this knowledge gap. To do so, I chose three specific factors to adjust my data to make the model useful for future predictions. The seperate factors are windowing functions, aggregations and windowing periods. I want my predictions to incoropate all available past data in order to predict an individual team's next game score. The windowing functions I use are rolling, expanding and exponentially weighted window. The windowing periods I define are 10, 15 and 20 days. The aggregations I use are mean and median.`,
`Windowing functions form the basis of my projections. They allow me to incorporate a select number of a team's past four factors and pace statistics, determined by the windowing period, that have already been generated
and use these to predict future scores. Each of the selected windowing functions provides a different selection of past games to inform a team's next game's variables. The rolling window selects and aggregates on only the last windowing period's amount of games. It takes into account only recent past performance to inform its predictions.
The expanding window starts at the widowing period's amount of games and expands outward to integrate each new game's set of results. Here, the starting window period is crucial in determining the rest of its season predictions. Exponentially weighted mean takes the amount of games from the windowing period and applies an exponentially higher weight to more recent results.
Of the three functions, it is the one that places the most emphasis on the most recent result and factors it immediately into the next prediction. Each of these windowing functions allow me to approach the available data and evaluate teams from various different angles. The rolling window gives a snapshot on how well a team in performing in the last window period's set of games.
The expanding window tells how well a team performs throughout the season. The exponentially weighted window places the greatest emphasis on the last game played and extends priority to the most recent games played in the window period. It tells the story of how a team is playing right now and places less on games that happended farther in the past.
The windowing periods of 10, 15 and 20 games were selected to represent a meaningful set of sample games during the 82 game season. The aggregations of mean and median are used to give me different representation of the variable values during the window period. Mean supplies the average and is influenced by tail values and median supplies the 50 percentile outcome and is less influenced by extreme values.`,
`Altogether, each one of these separate factors come together and provide the projected four factors and pace of a team given its past results. These variable projections are then input into my model which returns a score projection for each team for every game. In order to have projections for the start of the season, I use a team's averages of their four factors and pace from the previous season. This informs the team's projections for the starting window period until enough games are played in a season while still joining in current results.
The total set of models predicting a team's four factors and pace involves the combination of each window period, function and aggregation, which total to 18 models. Due to the aggregation inherit to the exponentially weighted window (i.e. the application of weights), the window can only be aggregated with mean. I chose to apply different smoothing values to the functions weight in an effort to explore the different capabilities of this particular windowing function.
Since each windowing function is working on the same data, I built a function, makeModel, to programmatically create each model permutation, fed these projected variables into the scoring model and return the scoring projections.
To evaluate and compare each model's effectiveness, I must now bring in the second part of this project, the sportsbook market data.   
`],
"Sportsbook Markets Intro": [`Since my model creates score projections for a team for each game adjusted by their past four factors and possession results, I chose to focus on the three major sportsbook markets that are derivatives of team scoring and are created for each game. The three markets focused in on this project are the total, the combined scores of both teams for a game, the spread, the addivitive inverse of a team's score and their opponents, and the moneyline, the odds associated with a team's score being higher than that of their opponents (i.e. that the team wins).
I selected these three markets because they allow my score projection to provide insights on different facets of the game and my data source of past markets, Odds Shark, only tracks these traditional markets.`, `Each of the separate markets, how it is structured and how my predictions inform on them desevere further analysis.
Two numbers comprise the spread and totals market. The spread number indicates how many points must be added or subtracted to a team's projected score in the market in order for the two projected scores to match. The favorite will always have a negative spread and the underdog's associated spread will always be the (positive) additive inverse of this number.
For the totals market, one number exists for each game which creates a binary market. The total is the sum of the projected scores for each team and the market presents the decision of whether the real total score of the game will be over or under this market sum. Attached to these market numbers is the previously referenced second number, the odds. The odds constitute the price one must pay for in order to place a bet on the market.
The third and final market, the moneyline, is solely comprised of its odds. They represent the wager a bettor must place if they believe the team will win the game.
For American bettors, the sportsbook's odds represent the payment outcome for a winning wager centered on $100 bets.
If the odds are negative, a bettor must wager this number to win $100. When positive, the odds represent the payout based on a $100 wager. The sportsbook market sets an initial number based on own past data of the sport and other sportsbook's market for the same game in an effort to select a number that will generate equal betting action on both sides.
The sportsbook will adjust these numbers as bets begin to take place with the goal to find an equilibrium in the market.`, `Having these specific market data for each game allows me to evaluate the effectiveness of my single score prediction for each team against the real market conditions present at the time of the game.
The sportsbook acts as an aggregate model that combines all the individual bettors that trust their own predictions enough to place a wager on it and sets a single number that corresponds to all these individual wagers.
All the information from sports media drivel to complicated mathematical models collectivizes in the market and provides for me a wealth of information to evaluate the performance of my model to the real world conditions of the market.
All in five simple numbers. The goal of my project is to use this historical market data with my prediction model to make selections for each game's markets, grade these based on the true results and find the model that optimizes winning over the large sample of four seasons. 
`],



"Marrying Markets and Predictions": [`The name of the game is to get a number based on a team's past data and use it to be on the right side of the line > 50% of the time. Since this is a binary decision, good and bad models have the ability to tell inform a useful prediction. Here the center of the data, 50%, is our dreaded enemy. Being able to select the correct side more than 50% of the time is our goal. The model's number remains static for the duration of the market,
while the market does not. Here enlies our edge. The key factors for our model are its decision number compared to one of the selected markets and the market analysis through time to pick the best number in the evolving market.`],


"Best Performance": [`A Book-based Analysis will be performed. A Team-based Analysis will be performed (records through time in a season; largest adjustments). Model Comparison and Performance.`],

"Using Data to Drive Decisions": [`Which model performed the best and why do I think that is the case? Allowing for users to see all the permutations of the data (season, team and game level). Getting a grasp between how markets value a team and how I value a team and using this numeric gap b/w numbers to drive future bets.`],

"Future Plans": [`Adding player based modeling for more granularity (injuries, trades and free agency). Creating more filters on Games based on the descrepancies between my predictions and the markets (where I was most off, where the market was most off, etc.). Bringing a Bayesian Approach. Integrating my current webscrapping scripts into the current website. Collecting data on derivative markets and live data. Improving this site into a streaming system.`],

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
                if (typeof(paragraphs[j][0]) === "object"){
                    var obj = paragraphs[j][i];
                    analysis_div.append("img").attr("src", `static/assets/images/Graphs/${obj.pic}`).attr("width", obj.width).attr("height", obj.height)
                    analysis_div.append("p").text(obj.text)
                    analysis_div.append("br")//.text(obj.text)
                } else {
                    analysis_div.append("p").text(paragraphs[j][i])
                    
                }

               
            }
            
        }
        
        analysis_div.append("br")
    }

    i++

}




