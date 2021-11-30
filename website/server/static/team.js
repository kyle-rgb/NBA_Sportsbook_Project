
season_filter = new Set();
book_filter = new Set();
results.forEach((o) => {season_filter.add(o.season); book_filter.add(o.book)})

let filter_container = d3.select("body").append("div").attr("class", "container").attr("id", "filters")

filter_container.append("h1").text("Overall Model").style("color", "white")
filter_container.append("p").text("Choose a Book to Analyze the Team's Performance").style("color", "white").attr("align", "center")


createDataFilters(filter_container, [season_filter, book_filter], "all")

var info = d3.select("body").append("div").classed("container", true).attr("align", "center").attr("id", "container2")
    .append("div").attr("class", "row").attr("id", "infoRow").append("div").attr("class", "col-lg-6")

info.append("h1").style("color", "white").text(team)
info.append("img").attr("src", `static/assets/images/NBA/${team}.png`).attr("width", 300).attr("height", 300).style("margin-bottom", "30px")
// var img = document.querySelector("img")
const colorThief = new ColorThief();
var img = d3.select("img")._groups[0][0]
const parseDate = d3.utcParse("%Y-%m-%d")

var c;
if (img.complete){
    c = colorThief.getColor(img)
} else {
    d3.select("img").on("load", () => {
        c = colorThief.getColor(img)
        console.log(c)
        d3.select("#container2").style("background-color", `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0.60)`)
        d3.select("#filters").style("background-color", `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0.85)`)
    })
}

var hist_div = d3.select("#container2").append("div").attr("class", "row").attr("id", "hist")
var scatter_div = d3.select("#container2").append("div").attr("class", "row").attr("id", "scatter")    

function unpack(rows, column){
    return rows.map(function (row) {
        return row[column]
    })
}

function cumsum(array){
    let sum = 0;
    array.forEach(a => {sum += a})
    return sum;
}

function cumsumArr(array){
    let sum = 0
    return_arr = []
    for (let i = 0; i<=array.length; i++){
        sum += array[i]
        return_arr.push(sum)
    }
    return return_arr.slice(0, -1)
}






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
    var table = d3.select("#container2").append("table").classed("table table-bordered", true);
    var thead = table.append("thead").classed("thead-dark", true).style("text-align", "center")
    var tbody = table.append("tbody")
    var header = ["home_abbv", "m3_proj_home", "market_score_home", "pts_home", "away_abbv", "m3_proj_away", "market_score_away", "pts_away", ]
    data = data.filter((d) => d.book === wanted_book & d.season === wanted_season)
    thead.append("tr").selectAll("th").data(header, function(d) {return Object.keys(d)}).enter().append("th").text((h) => h)
    

    // table.append("thead").data(Object.keys(data[0])).selectAll("th").data((h) => h)
    //console.log(data)
    tbody.selectAll("tr").data(data).enter().append("tr").selectAll("td").data((row) => {return header.map(function (col){ return {column: col, value:row[col]}})})
    .enter().append("td").text((d) => d.value)



}


function createFactorHistograms(data, factors, wanted_season, wanted_book){
    data_h = data.filter((d) => d.book === wanted_book & d.season === wanted_season)
    var traces = []
    var ff_obj = {"efg_pct": "eFG %", "tov_pct": "TOV %", "fta_per_fga_pct": "FTa/FGa %", "orb_pct": "ORB %"};
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
            name: `Team's ${ff_obj[factor]}`,
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
            name: `Opponent's ${ff_obj[factor]}`,
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

    
    var layout = {barmode: "overlay", grid: {rows: 2, columns: 2, pattern: "independent"}}

    Plotly.newPlot("hist", traces, layout)
    
}

function createEarningsCharts(data, wanted_season, wanted_book){
    var data_b = data.filter((d) => d.book === wanted_book & d.season == wanted_season)
    var games = data_b.length
    var data_div = d3.select("#infoRow").append("div").classed("col-lg-6", true).attr("id", "records")
    var data_summary = {"spread_choice": 0, "moneyline_choice": 0, "over_choice": 0, "under_choice": 0,
    "spread_wins": 0, "total_wins": 0, "ml_wins": 0,
    "spread_losses": 0, "total_losses": 0, "ml_losses": 0,
    "spread_push": 0, "total_push": 0}

    data_b.forEach((d) => {
        d.date = parseDate(d.date)
        d.spread_team === team? data_summary["spread_choice"]++: data_summary["spread_choice"];
        d.ml_team === team? data_summary["moneyline_choice"]++ : data_summary["moneyline_choice"];
        d.total_pick === "O"? data_summary["over_choice"]++ : data_summary["under_choice"]++;
        d.spread_pk === "W"? data_summary["spread_wins"]++ : d.spread_pk === "P"? data_summary["spread_push"]++ : data_summary["spread_losses"]++ ;
        d.total_pk === "W"? data_summary["total_wins"]++ :  d.total_pk === "P"? data_summary["total_push"]++ : data_summary["total_losses"]++ ;
        d.ml_pk === "W"? data_summary["ml_wins"]++ :  data_summary["ml_losses"]++;
    })
    console.log(data_summary)
    data_table_array = [
        {
            metric: "moneyline",
            pick_record: `${data_summary.ml_wins}-${data_summary.ml_losses}`,
            actual_record: 0,
            high: Math.max.apply(Math, cumsumArr(unpack(data_b, "ml_winnings"))).toFixed(2),
            low: Math.min.apply(Math, cumsumArr(unpack(data_b, "ml_winnings"))).toFixed(2),
            close: cumsum(unpack(data_b, "ml_winnings")).toFixed(2),
            model_error: 0.3,
            market_error: .12,
        },
        {
            metric: "spread",
            pick_record: `${data_summary.spread_wins}-${data_summary.spread_losses}-${data_summary.spread_push}`,
            actual_record: 0,
            high: Math.max.apply(Math, cumsumArr(unpack(data_b, "spread_winnings"))).toFixed(2),
            low: Math.min.apply(Math, cumsumArr(unpack(data_b, "spread_winnings"))).toFixed(2),
            close: cumsum(unpack(data_b, "spread_winnings")).toFixed(2),
            model_error: 0.3,
            market_error: .12,
        },
        {
            metric: "total",
            pick_record: `${data_summary.total_wins}-${data_summary.total_losses}-${data_summary.total_push}`,
            actual_record: 0,
            high: Math.max.apply(Math, cumsumArr(unpack(data_b, "total_winnings"))).toFixed(2),
            low: Math.min.apply(Math, cumsumArr(unpack(data_b, "total_winnings"))).toFixed(2),
            close: cumsum(unpack(data_b, "total_winnings")).toFixed(2),
            model_error: 0.3,
            market_error: .12,
        },
        {
            metric: "overall",
            pick_record: `${data_summary.total_wins+data_summary.spread_wins+data_summary.ml_wins}-${data_summary.total_losses+data_summary.spread_losses+data_summary.ml_losses}-${data_summary.total_push +data_summary.spread_push}`,
            actual_record: 0,
            high: Math.max.apply(Math, cumsumArr(unpack(data_b, "agg_winnings"))).toFixed(2),
            low: Math.min.apply(Math, cumsumArr(unpack(data_b, "agg_winnings"))).toFixed(2),
            close: cumsum(unpack(data_b, "agg_winnings")).toFixed(2),
            model_error: 0.3,
            market_error: .12,
        },
    ]




    let headers = ["Pick Type", "Pick Record", "Actual Record", "High $s", "Low $s", "Close $s", "Model Error", "Market Error"]
    let keys = Object.keys(data_table_array[0])
    var table = data_div.append("table").classed("table table-bordered", true)//.style("margin-top", "75px");
    var thead = table.append("thead").classed("thead-dark", true).style("text-align", "center")
    var tbody = table.append("tbody")
    thead.append("tr").selectAll("th").data(headers, function(d) {return Object.keys(d)}).enter().append("th").text((h) => h) 
    tbody.selectAll("tr").data(data_table_array).enter().append("tr").selectAll("td").data((row) => {return keys.map(function (col){return {col: col, value:row[col]} })})
    .enter().append("td").text((d) => {return d.value})


    // data_div.append("h5").text(`I selected ${team} to Win ${data_summary.moneyline} Times,
    // to Cover ${data_summary.spread} Times and for their Games to Go Over ${data_summary.over} Times.
    // My Spread Picks Went ${data_summary.spread_wins}-${games-data_summary.spread_wins}, My Total Picks Went ${data_summary.total_wins}-${games-data_summary.total_wins} and
    // My Moneyline Picks Went ${data_summary.ml_wins}-${games-data_summary.ml_wins}.`
    // )

    let winnings_columns = ["agg_winnings", "spread_winnings", "total_winnings", "ml_winnings"]
    let colors = ["#F06A6A", "#CD00FF", "#FFB600", "#5C0F9C"]
    let initial_visibility = [true, false, false, false]
    var traces = []
    let j = 0
    for (w of winnings_columns){
        traces.push({
            x: unpack(data_b, "date"),
            y: unpack(data_b, w),
            mode: "lines+markers",
            type: "scatter",
            name: w,
            marker: {color: colors[j]},
            line: {color: colors[j]},
            visible: initial_visibility[j]
            
        })
        j++ 
    }

    var updatemenus = [{
        buttons:[
            {
                args: [
                    {'visible': [true, false, false, false]},
                    {"title": 'Aggregate Winnings'}],
                label: "Aggregate",
                method: 'update'
            },
            {
                args: [
                    {'visible': [false, true, false, false]},
                    {"title": 'Spread Winnings'}],
                label: "Spread",
                method: 'update'
            },
            {
                args: [
                    {'visible': [false, false, true, false]},
                    {"title": 'Totals Winnings'}],
                label: "Totals",
                method: 'update'
            },
            {
                args: [
                    {'visible': [false, false, false, true]},
                    {"title": 'Moneyline Winnings'}],
                label: "Moneyline",
                method: 'update'
            },
            {
                args: [
                    {'visible': [true, true, true, true]},
                    {"title": 'Complete Winnings'}],
                label: "All",
                method: 'update'
            }],
        direction: 'left',
        pad: {'r': 10, 't': 15},
        showactive: true,
        type: 'buttons',
        x: .02,
        y: 1.2,
        xanchor: 'left',
        yanchor: 'top'
    }]

    var layout = {
        title: `${team}'s Aggregate Model Winnings`,
        updatemenus: updatemenus,
        showlegend: false
    }
    
    
    Plotly.newPlot("scatter", traces, layout)

}





createFactorHistograms(results, ["efg_pct", "tov_pct", "orb_pct", "fta_per_fga_pct"], "17-18", "average");
createTable(results, "17-18", "average")
createEarningsCharts(moneys, "17-18", "average")






































