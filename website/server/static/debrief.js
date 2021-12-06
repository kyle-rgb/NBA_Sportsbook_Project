let analysis_div = d3.select("#analysis_div")
analysis_div.append("h1").text("Debrief").style("font-size", "95px") 
analysis_div.append("img").attr("src", "static/assets/images/Graphs/debrief.png").attr("width", "400px").attr("height", "400px")

let list = analysis_div.append("ul")
var headings = [{head: "Build Front to Back", p: `Every data project should begin where it ends. The structure of the end product and its ability to provide concrete, digestable value to the end-user are the most important factors for all data projects.
Precise definitions for structure and value creates the centroid for analysis from which all features emanate out of.  As a general rule, applications should allow for iteration based on the design of the data and have an simple system to integrate new features as analysis grows.
Building projects from server to client synchronizes the complex processes of data analysis (querying, manipulation, shifting between programming languages, etc.) and distilles them into the valuable insights for display and decsion making in the end-product.`},
{head: "Ensure Data Integrity", p: `The data science hosting sites, such as data world and kaggle, provide great starting points in project idea generation. However, as resources of reliable, valuable or even clean data, they come up short. Data collection from web scraping sites and calling APIs should be my only main resources for data collection moving forward.
Professional APIs and current websites have a direct incentive to keep their data consistent and clean and therefore the data extraction can be done with much more confidence and less hassle. Moreover, these data extraction techniques allow for project analysis to be more easily extrapolated on future data these resources will track and which the created model's are trained to predict on. `},
{head: "Use Classes, Functions and Queries to Handle Data", p: `This project has taught me the importance of data storage and data handling. Data storage must be consistent and should contain only as much data that is necessary to perform the required analysis.
Manipulations and extensions of the data for analysis must take place outside of the database. All involved data transformations should be performed via classes and/or functions in order to ensure repeatability and reproducability.
Classes encase all the different permutations and details specific to the data in a single structure and act as an easy entry point for others to quickly replicate and validate the analysis's results.`}]

for (h of headings){
    list.append("li").append("h4").text(h.head)
    list.append("p").text(h.p)
}























