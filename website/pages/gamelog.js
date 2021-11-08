d3.csv("../../data/interim/results_sample.csv").then(csvData => {
    // create container

    let filter_container = d3.select("body").append("div").attr("class", "container").style("background-color", "rgba(102,51,153,0.55)").attr("id", "filters")

    let container = d3.select("body").append("div").attr("class", "container-fluid").style("background-color", "rgba(102,51,153,0.62)").attr("id", "scoresTable") 

    container.append("h1").text("Game Log").style("color", "white")

    book_set = new Set()
      // season_set = new Set()
    team_set = new Set()
    day_set = new Set()

    for (let result of csvData){
        book_set.add(result.Best_Book)
        team_set.add(result.team)
        day_set.add(result.date)
    }

    var head_row = container.append("div").attr("class", "row").attr("id", "predRow")

    //head_row = d3.select("#predRow")
    // Create a Table
    data = csvData
    // Your Columns
    headers = Object.keys(data[0])
    // Insert Each Row Into Table
    table = head_row.append("table").attr("class", "table table-bordered")
    
    function addHeaders(array){
        head = table.append("thead").attr("class", "thead-dark")
        row = head.append("tr")
        for (header of array){
            row.append("th").text(header)
        }
    }
    createDataFilters(filter_container, [Array.from(book_set), Array.from(team_set),
        Array.from(day_set), "A"])
    addHeaders(headers)
    body = table.append("tbody")
    for (d of data){
        row = body.append("tr")
        for (metric of Object.values(d)){
            row.append("td").text(metric)
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

      

      



})
    
    