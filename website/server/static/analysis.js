analysis_div = d3.select("#analysis_div")


console.log(analysis_div)

analysis_div.append("h1").text("Data Analysis").style("font-size", "105px") 

outline_columns = {
    "Data Collection": ["Web Scraping", "Data Cleaning"],
    "Model Creation": ["Variable Selection", "Model 1", "Model 2", "Final Model"],
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
"Model 1": [{pic: "model_1_vars.png", text: "aaa", width: "1000px", height:"450px"},
{pic: "model_1_heatmap.png", text: "ggg", width: "800px", height:"600px"},
{pic: "model_1_errors_box.png", text: "blah blah bah", width: "1000px", height:"500px"},
{pic: "model_1_comparison.png", text: "whoo ah whoo ah *al pacino voice*", width: "1000px", height:"500px"}],


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




