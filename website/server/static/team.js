
season_filter = new Set();
book_filter = new Set();
results.forEach((o) => {season_filter.add(o.season); book_filter.add(o.book)})

let filter_container = d3.select("body").append("div").attr("class", "container").style("background-color", "rgba(256,51,153,0.55)").attr("id", "filters")

filter_container.append("h1").text("Overall Model").style("color", "white")
filter_container.append("p").text("Choose a Book to Analyze the Team's Performance").style("color", "white").attr("align", "center")


createDataFilters(filter_container, [season_filter, book_filter], "all")

var info = d3.select("body").append("div").classed("container", true).style("background-color", "rgba(250, 0, 0, 0.50)").attr("align", "center").attr("id", "container2")
    .append("div").attr("class", "row").attr("id", "infoRow").append("div").attr("class", "col-lg-12")

info.append("h1").text(team)
info.append("img").attr("src", `static/assets/images/NBA/${team}.png`).attr("width", 300).attr("height", 300).style("margin-bottom", "30px")

var dashboard = d3.select("#container2").append("div").attr("class", "row").attr("id", "dashboard")


    


function createDataFilters(container, options, starting_value){
    // container :: string of container name
    // options :: array of arrays of options to place into selection
    // starting_value :: string for default
    let size = (12 / options.length) - 1
    let button_size = 2
    let i = 0
    for (let filters of options){
      var id = "season"
      if (i == 0){
        var row = container.append("form").append("div").attr("class", "row")
        id = "book"
      }
      let selection = row.append("div").attr("class", `col-sm-${size}`).append("select").style("margin-top", "25px").style("margin-bottom", "25px").attr("class", "form-control form-control-sm")
      .attr("type", "text").attr("placeholder", starting_value).attr("id", id)
      for (let option of filters){
        selection.append("option").text(option)
      }
      i++
    }
    let form = d3.select(".row")
    form.append("div").attr("class", `col-sm-${button_size}`).attr("align", "center").append("button").attr("class", "btn btn-warning").attr("type","button").style("max-height", "40px").style("max-width", "80px").style("margin-right", "10px")
    .style("margin-top", "20px").text("Submit").attr("id", "submitButton")
  }

function createTable(data, wanted_season, wanted_book){
    var table = d3.select("#dashboard").append("table").classed("table table-bordered", true);
    var thead = table.append("thead").classed("thead-dark", true).style("text-align", "center")
    var tbody = table.append("tbody")
    var header = Object.keys(data[0])
    data = data.filter((d) => d.book === wanted_book & d.season === wanted_season)
    thead.append("tr").selectAll("th").data(header, function(d) {return Object.keys(d)}).enter().append("th").text((h) => h)
    
    // 
    // table.append("thead").data(Object.keys(data[0])).selectAll("th").data((h) => h)
    console.log(data)
    tbody.selectAll("tr").data(data).enter().append("tr").selectAll("td").data((row) => {return header.map(function (col){ return {column: col, value:row[col]}})})
    .enter().append("td").text((d) => d.value)



}


function createFactorHistograms(data, factors, wanted_season, wanted_book){
    data_h = data.filter((d) => d.book === wanted_book & d.season === wanted_season)
    var traces = []
    i = 1
    for (factor of factors) {    
        var trace1 = {
            x: data_h.map((d) => {
                if (d.home_abbv === team){
                    return d[factor+"_home"]
                } else {
                    return d[factor+"_away"]
                }
            }),
            type: "histogram",
            opacity: 0.6,
            marker: {
                color: "red"
            },
            name: `Team's`,
            xbins: {
                start: 0,
                end: .75, 
                size: 0.025 
            },
            xaxis: `x${i > 1 ? i : ""}`,
            yaxis: `y${i > 1 ? i : ""}`

        }
        var trace2 = {
            x: data_h.map((d) => {
                if (d.home_abbv !== team){
                    return d[factor+"_home"]
                } else {
                    return d[factor+"_away"]
                }
            }),
            type: "histogram",
            opacity: 0.6,
            marker: {
                color: "green"
            },
            name: `Opponent's`,
            xbins: {
                start: 0,
                end: .75, 
                size: 0.025 
            },
            xaxis: `x${i > 1 ? i : ""}`,
            yaxis: `y${i > 1 ? i : ""}`

        }
        traces.push(trace1)
        traces.push(trace2)
        i++
    }

    
    var layout = {barmode: "overlay", grid: {rows: 2, columns: 2, pattern: "independent"}, showlegend: false}

    Plotly.newPlot("dashboard", traces, layout)
    
}



createFactorHistograms(results, ["efg_pct", "tov_pct", "orb_pct", "fta_per_fga_pct"], "17-18", "average");
// createTable(results, "17-18", "average")












































