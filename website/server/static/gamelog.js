Promise.all([
  d3.csv("static/data/game_log/summary_table_results.csv"), // best number and associated book
  d3.csv("static/data/game_log/table_results.csv") // results with projections
]).then(files => {
    var csvData = files[1]
  
    // console.log(files[1]) // best number and associated book
    // console.log(files[2]) // results with projections
  
    // create container
    console.log(csvData)
    console.log(files[0])
    let filter_container = d3.select("body").append("div").attr("class", "container").style("background-color", "rgba(102,51,153,0.55)").attr("id", "filters")

    let container = d3.select("body").append("div").attr("class", "container-fluid").style("background-color", "rgba(102,51,153,0.62)").attr("id", "scoresTable") 

    container.append("h1").text("Game Log").style("color", "white")

    book_set = new Set()
    season_set = new Set()
    team_set = new Set()
    day_set = new Set()
    date_regex = /\d+-\d+-\d+/
    name_regex = /[A-Z]{3}/

    for (let result of csvData){
        book_set.add(result.Best_Book)
        team_set.add(result.home_abbv)
        result.date = result.date.match(date_regex)[0]
        day_set.add(result.date)
        season_set.add(result.season)
    }

    var head_row = container.append("div").attr("class", "row").attr("id", "predRow")
    // console.log(day_set)
    //head_row = d3.select("#predRow")
    // Create a Table
    data = csvData

    // Your Columns
    headers = Object.keys(data[0])
    headers = headers.filter((row_h) => ((row_h !== "date") & (row_h !== "season") & (row_h !== "game_id")))
    header_cleaner = {
      "home_abbv":"Home",
      "away_abbv": "Away",
      "pts_home": "Home Points",
      "pts_away": "Away Points",
      "m3_proj_home": "Home Model Projection",
      "m3_proj_away": "Away Model Projection",
      "moneyline_home_number": "Avg. Moneyline",
      "spread_home_number": "Avg. Spread",
      "total_number": "Avg. Total",
      "ml_pk": "Model ML Pick",
      "spread_pk": "Model Spread Pick",
      "total_pk": "Model Total Pick",
      "Best_Book": "Highest Odds",
      "ml_winnings": "Moneyline Winnings",
      "spread_winnings": "Spread Winnings",
      "total_winnings": "Total Winnings",
      "agg_winnings": "Aggregate Winnings"
    }
    // Insert Each Row Into Table
    var headers_2 = [];
    headers.forEach((o) => {headers_2.push(header_cleaner[o])})
    teams_arr = Array.from(team_set)
    season_arr =  Array.from(season_set)
    day_set = Array.from(day_set)
    teams_arr.push("team")
    season_arr.push("season")
    day_set.push("day")
    createDataFilters(filter_container, [teams_arr, season_arr])
    writeTable(headers, data, "CLE", "17-18", true)

    function writeTable(headers, data, wanted_team, wanted_season, first_time=false){

      let data_objs = data.filter((d) => (((d.home_abbv === wanted_team) & (d.season === wanted_season)) | ((d.away_abbv === wanted_team) & (d.season === wanted_season)))) 

      if (first_time){
        table = head_row.append("table").attr("class", "table table-bordered")
        head = table.append("thead").attr("class", "thead-dark")
        row = head.append("tr")
        for (header of headers_2){
          row.append("th").text(header)
        }
        body = table.append("tbody").attr("id", "tbody")
       } else {
        document.getElementById("tbody").innerHTML = ""
      }
      console.log(data_objs)
      
      for (d of data_objs){
        let winner = "table-success";
        if (parseFloat(d.agg_winnings) < 0){
          winner = "table-danger"
        }
        row = body.append("tr").attr("class", winner)
        for (metric of headers){
          if (metric.endsWith("_abbv")){
            row.append("td").append("a").attr("href", `game?id=${d.game_id}`).append("img").attr("src", `static/assets/images/NBA/${d[metric]}.png`).attr("width", 35).attr("height", 35)
          } else {
            if (metric.endsWith("_winnings")){
              row.append("td").text(`$${d[metric]}`)
            } else {
              row.append("td").text(d[metric])
            }
            
          }
      }

    }
  }

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
          let id = filters.slice(-1)
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

  d3.select("#submitButton").on("click", function(event) {
    var wanted_team = d3.select("#team")._groups[0][0].value
    var wanted_season = d3.select("#season")._groups[0][0].value
    //d3.select("tbody").innerHTML = ""
    writeTable(headers, data, wanted_team, wanted_season, false)

    })

      



})
    
    