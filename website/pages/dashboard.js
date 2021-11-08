// Line Chart Reference : https://observablehq.com/@enjalot/power-usage-workbook
Promise.all([
  d3.csv("../../data/interim/line_chart_sample.csv"),
  d3.csv("../../data/interim/book_summary_sample.csv"),
  d3.csv("../../data/interim/power_rankings_sample.csv")
]).then(files => {
  let year_set = new Set()
  let book_set = new Set()
  let book_array = files[1].columns
  for (d of files[2]){
    year_set.add(d.Season)
  }
  for (d of files[1]){
    book_set.add(d.Book)
  }

  var first_container = d3.select("body").append("div").classed("container", true).style("background-color", "rgba(102, 51, 153, 0.55)")

  createDataFilters(first_container, [Array.from(book_set), Array.from(year_set)], "Complete")


  let team_regex = /[A-Z]{3}?/
  // Create Dashboard
  //dashboard = d3.select("#dashboard")

  var dashboard = d3.select("body").append("div").classed("container", true).style("background-color", "rgba(102, 51, 153, 0.68)")
  .append("div").attr("class", "row").append("div").attr("class", "col-lg-12").append("div").attr("id", "dashboard")
  
  dashboard.append("h1").text("Dashboard").style("color", "white")
  
  parseDate = d3.utcParse("%Y-%m-%d")
  dashboard.attr("align", "center")
  parseDate = d3.utcParse("%Y-%m-%d")

  // Add Page Specific Filters
  let container = d3.select(".container")
  
  
  

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

  function createDataFilters(container, options, starting_value){
    // container :: string of container name
    // options :: array of arrays of options to place into selection
    // starting_value :: string for default
    let size = (12 / options.length) - 1
    let button_size = 2
    let i = 0
    for (let filters of options){
      if (i == 0){
        var row = container.append("form").append("div").attr("class", "row")
      }
      let selection = row.append("div").attr("class", `col-sm-${size}`).append("select").style("margin-top", "25px").style("margin-bottom", "25px").attr("class", "form-control form-control-sm")
      .attr("type", "text").attr("placeholder", starting_value)
      for (let option of filters){
        selection.append("option").text(option)
      }
      i++
    }
    let form = d3.select(".row")
    form.append("div").attr("class", `col-sm-${button_size}`).attr("align", "center").append("button").attr("class", "btn btn-warning").attr("type","button").style("max-height", "40px").style("max-width", "80px").style("margin-right", "10px")
    .style("margin-top", "20px").text("Submit").attr("id", "submitButton")
  }
  
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