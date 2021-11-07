// Line Chart Reference : https://observablehq.com/@enjalot/power-usage-workbook
Promise.all([
  d3.csv("../../data/interim/line_chart_sample.csv"),
  d3.csv("../../data/interim/book_summary_sample.csv"),
  d3.csv("../../data/interim/power_rankings_sample.csv")
]).then(files => {

  let team_regex = /[A-Z]{3}/g

  t = "CLE"
  console.log(t.match(team_regex) !== null)
  // Grab Box
  dashboard = d3.select("#dashboard")
  parseDate = d3.utcParse("%Y-%m-%d")
  dashboard.attr("align", "center")

  dashboard = d3.select("#dashboard")
  parseDate = d3.utcParse("%Y-%m-%d")
  for (d of files[0]){
    d.date = parseDate(d.date)
    d.cumsum = Math.round(+d.cumsum, 2)
    d.winnings = Math.round(+d.winnings, 2)
  }

  var plot = Plot.dot(files[0], { x: "date", y: "cumsum", fill: "gray" }).plot({
    marks: [
      Plot.line(files[0], Plot.windowY({ x: "date", y: "cumsum", k: 5, stroke: "orange",  shift: "centered", curve: "step"})), // centered is by default,
      Plot.frame()
    ],
    x: {
      tickRotate: 45,
      tickFormat: d => d.toISOString().slice(0, 7),
    },
    y: {
      label: "↑ cumulative winnings per day"
    },
    marginLeft: 50,
    marginBottom: 50,
    width: 800,
    height: 600,
    grid: true,
    style: {
      fontSize: "9px",
      color: "black",
    }
  })

  dashboard.append(() => {return plot})

  d3.select("svg").style("margin-bottom", "20px")

  function createTable(data_array){
    headers = Object.keys(data_array[0])
    table = dashboard.append("table").attr("class", "table table-bordered")
    head = table.append("thead").style("text-align", "center").attr("class", "thead-dark")
    // Insert Each Row Into Table
    row = head.append("tr")
    for (header of headers){
      row.append("th").text(header)
    }
    body = table.append("tbody")
    for (d of data_array){
    row = body.append("tr")
    for (metric of Object.values(d)){
      if(metric.match(team_regex) !== null){
        row.append("td").append("img").attr("src", `Resources/assets/images/NBA/${metric}.png`).attr("width", 35).attr("height", 35)
      } else{
        row.append("td").text(metric)
      }
      
    }
  }

  }

  function compareObj(a, b){
    if (a.Avg_Spread > b.Avg_Spread){
      return -1
    } if (a.Avg_Spread < b.Avg_Spread){
      return 1
    } else {
      return 0
    }
  }
  
  createTable(files[1])
  
  power_rankings = files[2].sort(compareObj)
  createTable(power_rankings)
})