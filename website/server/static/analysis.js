analysis_div = d3.select("#analysis_div")


console.log(analysis_div)

analysis_div.append("h1").text("Data Analysis").style("font-size", "105px") 

outline_columns = {
    "Data Collection": ["Web Scraping", "Data Cleaning and Transformation"],
    "Model Creation": ["Variable Selection", "Model 1", "Model 2", "Final Model"],
    "Model Evaluation": ["Sportsbook Markets Intro", "Marrying Markets and Predictions", "Best Performance"],
    "Web Application": ["Using Data to Drive Decisions", "Future Plans"]
}

section_colors = ["cyan", "green", "yellow", "red"]
i = 0 
for (k of Object.keys(outline_columns)){
    
    analysis_div.append("h3").append("i").append("u").text(k).style("font-size", "55px") 
    for (j of outline_columns[k]){
        analysis_div.append("h4").text(j).style("font-size", "35px").style("color", section_colors[i])
    }

    i++

}




