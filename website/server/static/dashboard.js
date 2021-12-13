// Line Chart Reference : https://observablehq.com/@enjalot/power-usage-workbook

files = [[], team_picks, money_chart_data]

let year_set = new Set()
let book_set = new Set()

for (d of files[2]){
  year_set.add(d.season)
}
for (d of files[2]){
  book_set.add(d.book)
}

year_set.add("All")

var first_container = d3.select("body").append("div").classed("container", true).style("background-color", "rgba(102, 51, 153, 0.55)")

arr_books = Array.from(book_set).sort((a, b) => a<b ? -1 : 1)
arr_year = Array.from(year_set).sort((a, b) => a<b ? -1 : 1)
createDataFilters(first_container, [arr_books,arr_year], "Complete")

let team_regex = /[A-Z]{3}?/
// Create Dashboard

var dashboard = d3.select("body").append("div").classed("container", true).style("background-color", "rgba(102, 51, 153, 0.68)")
.append("div").attr("class", "row").append("div").attr("class", "col-lg-12").append("div").attr("id", "dashboard")

dashboard.append("h1").text("Dashboard").style("color", "white")

dashboard.attr("align", "center")
parseDate = d3.utcParse("%Y-%m-%d")

// Add Page Specific Filters
let container = d3.select(".container")
var plot_data = files[2]
var book_data = files[1]
for (d of plot_data){
  d.day = parseDate(d.day)
  d.agg_winnings = +((+d.agg_winnings).toFixed(2))
}

function createMoneyPlot(wanted_book, wanted_season, data_m){
let div_plot = dashboard.append("div").attr("id", "winChart")
var data_l = data_m.filter((o) => ((o.season === wanted_season) & (o.book === wanted_book)))
var plot = Plot.dot(data_l, { x: "day", y: "agg_winnings", fill: "green" }).plot({
  marks: [
    Plot.line(data_l, Plot.windowY({ x: "day", y: "agg_winnings", k: 5, stroke: "orange",  shift: "centered", curve: "step"})), // centered is by default,
    Plot.frame()
  ],
  x: {
    tickRotate: 45,
    tickFormat: d => d.toISOString().slice(0, 7),
  },
  y: {
    label: "↑ winnings per day"
  },
  marginLeft: 50,
  marginBottom: 50,
  width: 800,
  height: 600,
  grid: true,
  style: {
    fontSize: "9px",
    color: "black"
  }
})

div_plot.append(() => {return plot})


}


d3.select("svg").style("margin-bottom", "20px")

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

function createBookTable(wanted_book, wanted_season, data_array, headers){
  let data = data_array.filter((o) => ((o.book === wanted_book) & (o.season === wanted_season)))
  table = dashboard.append("table").attr("class", "table table-bordered")
  head = table.append("thead").style("text-align", "center").attr("class", "thead-dark")
  let book_records = {
    spread: {"W": 0, "L":0, "P":0, "metric": "Spread"},
    total: {"W":0, "L": 0, "P":0, "metric": "Total"},
    ml: {"W": 0, "L":0, "P": 0,"metric": "Moneyline"},
    games: +data.length
  }
  var grade_cols = ["spread_pk", "total_pk", "ml_pk"]
  // aggregate spread records
  console.log(data)
  data.forEach((d) => {
    for (g of grade_cols){
      if (d[g] === "W"){
        book_records[g.replace("_pk", "")].W++
      } else if (d[g] === "P"){
        book_records[g.replace("_pk", "")].P++
      } else {
        book_records[g.replace("_pk", "")].L++
      }
    }
  })
  book_records.spread["Win %"] =((book_records.spread.W / book_records.games ) * 100).toFixed(2) + "%"
  book_records.total["Win %"] = ((book_records.total.W / book_records.games)*100).toFixed(2) + "%"
  book_records.ml["Win %"] = ((book_records.ml.W / book_records.games)*100).toFixed(2) + "%"

  // Insert Each Row Into Table
  
  row = head.append("tr")
  for (header of headers){
    row.append("th").text(header)
  }
  body = table.append("tbody")
  
  for (let k of Object.keys(book_records)){
    if (k !== "games"){
      row = body.append("tr")
      row.append("td").append("img").attr("src", `static/assets/images/NBA/${wanted_book}.png`).attr("width", 35).attr("height", 35)
      row.append("td").text(book_records[k].metric)
      row.append("td").text(book_records[k].W)
      row.append("td").text(book_records[k].L)
      row.append("td").text(book_records[k].P)
      row.append("td").text(book_records[k]["Win %"])        
    }
  }      
    
  
}

function createTeamTable(wanted_book, wanted_season, data_whole, headers){
  let team_set = new Set();
  var bulk_obj = {}
  data_whole[1].forEach((d) => {team_set.add(d.home_abbv)})
  team_set.forEach((t) => bulk_obj[t] = {"record": {"spread":{"W": 0, "L": 0, "P":0, "winnings": 0},
  "total": {"W": 0, "L": 0, "P": 0, "winnings": 0},
  "moneyline": {"W": 0, "L": 0, "winnings": 0}}, "overall": {"W": 0, "L": 0, "P": 0, "winnings": 0}})
  let teams_and_picks = data_whole[1].filter((o) => ((o.book === wanted_book) & (o.season === wanted_season)))
  let winnings = data_whole[2].filter((o) => ((o.book === wanted_book) & (o.season === wanted_season)));

  teams_and_picks.forEach((g) => {
    let teams_array_1 = g.team_arr.split(",") 
    if (g.spread_pk === "W"){
      bulk_obj[teams_array_1[0]].record.spread.W++
      bulk_obj[teams_array_1[1]].record.spread.W++
      bulk_obj[teams_array_1[0]].overall.W++
      bulk_obj[teams_array_1[1]].overall.W++

    } else if (g.spread_pk === "L"){
      bulk_obj[teams_array_1[0]].record.spread.L++
      bulk_obj[teams_array_1[1]].record.spread.L++
      bulk_obj[teams_array_1[0]].overall.L++
      bulk_obj[teams_array_1[1]].overall.L++

    } else {
      bulk_obj[teams_array_1[0]].record.spread.P++
      bulk_obj[teams_array_1[1]].record.spread.P++
      bulk_obj[teams_array_1[0]].overall.P++
      bulk_obj[teams_array_1[1]].overall.P++
    }
    bulk_obj[g.spread_team].record.spread.winnings += +g.spread_winnings
    bulk_obj[g.spread_team].overall.winnings += +g.spread_winnings
    if (g.ml_pk === "W"){
      bulk_obj[teams_array_1[0]].record.moneyline.W++
      bulk_obj[teams_array_1[1]].record.moneyline.W++
      bulk_obj[teams_array_1[0]].overall.W++
      bulk_obj[teams_array_1[1]].overall.W++
    } else {
      bulk_obj[teams_array_1[0]].record.moneyline.L++
      bulk_obj[teams_array_1[1]].record.moneyline.L++
      bulk_obj[teams_array_1[0]].overall.L++
      bulk_obj[teams_array_1[1]].overall.L++
    }
    bulk_obj[g.ml_team].record.moneyline.winnings += +g.ml_winnings
    bulk_obj[g.ml_team].overall.winnings += +g.ml_winnings
    
    if (g.total_pk === "W"){
      bulk_obj[g.away_abbv].record.total.W++
      bulk_obj[g.away_abbv].overall.W++
      bulk_obj[g.home_abbv].record.total.W++
      bulk_obj[g.home_abbv].overall.W++
    } else if (g.total_pk === "P") {
      bulk_obj[g.away_abbv].record.total.P++
      bulk_obj[g.home_abbv].record.total.P++
      bulk_obj[g.home_abbv].overall.P++
      bulk_obj[g.away_abbv].overall.P++
    } else {
      bulk_obj[g.away_abbv].record.total.L++
      bulk_obj[g.home_abbv].record.total.L++
      bulk_obj[g.home_abbv].overall.L++
      bulk_obj[g.away_abbv].overall.L++
    }
    bulk_obj[g.away_abbv].record.total.winnings += +g.total_winnings
    bulk_obj[g.home_abbv].record.total.winnings += +g.total_winnings
    bulk_obj[g.away_abbv].overall.winnings += +g.total_winnings
    bulk_obj[g.home_abbv].overall.winnings += +g.total_winnings
  })
  
  console.log(bulk_obj)

  table = dashboard.append("table").attr("class", "table table-bordered")
  head = table.append("thead").style("text-align", "center").attr("class", "thead-dark")
  row = head.append("tr")
  for (header of headers){
    row.append("th").text(header)
  }
  body = table.append("tbody")
  
  //bulk_obj = bulk_obj.filter((a, b) => (a.winnings > b.winnings? a : b))

  for (team of Object.keys(bulk_obj)){
    let row = body.append("tr")
    row.append("td").append("a").attr("href", `/breakdown?team=${team}`).append("img").attr("src", `static/assets/images/NBA/${team}.png`).attr("width", 50).attr("height", 50)
    // row.append("td").text(bulk_obj[team].rankings.market)
    // row.append("td").text(bulk_obj[team].rankings.my_rank)
    // row.append("td").text(bulk_obj[team].rankings.real)
    row.append("td").text(bulk_obj[team].overall.W)
    row.append("td").text(bulk_obj[team].overall.L)
    row.append("td").text(bulk_obj[team].overall.P)
    row.append("td").text(`${(((bulk_obj[team].overall.W) / (bulk_obj[team].overall.W + bulk_obj[team].overall.L)*100).toFixed(2))}%`)
    row.append("td").text(`$${(bulk_obj[team].record.spread.winnings).toFixed(2)}`)
    row.append("td").text(`$${(bulk_obj[team].record.moneyline.winnings).toFixed(2)}`)
    row.append("td").text(`$${(bulk_obj[team].record.total.winnings).toFixed(2)}`)
    row.append("td").text(`$${(bulk_obj[team].overall.winnings).toFixed(2)}`)


  }


}

d3.select("#submitButton").on("click", function(event) {
  var wanted_book = d3.select("#book")._groups[0][0].value
  var wanted_season = d3.select("#season")._groups[0][0].value
  document.getElementById("dashboard").innerHTML = ""
  var dashboard = d3.select("#dashboard").append("h1").style("color", "white").attr("align", "center").text("Dashboard")
  
  createMoneyPlot(wanted_book, wanted_season, plot_data)
  createBookTable(wanted_book, wanted_season, files[1], headers_1)
  createTeamTable(wanted_book, wanted_season,[files[0], files[1], files[2]], headers_2)
  })


createMoneyPlot("average", "17-18", plot_data)
let headers_1 = ["Book", "Metric", "Wins", "Losses", "Pushes", "Win %"]
createBookTable("average", "17-18", files[1], headers_1)
// power_rankings = files[2].sort(compareObj)
let headers_2 = ["Team", "W", "L", "P", "Win %", "Spread Winnings", "ML Winnings", "Totals Earnings", "Complete Earnings"]
createTeamTable("average", "17-18",[files[0], files[1], files[2]], headers_2)
