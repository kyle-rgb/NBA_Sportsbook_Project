Promise.all([
    d3.csv("../../data/interim/games/odds.csv"), // Book Summary Lines
    d3.csv("../../data/interim/games/results.csv"), // Team Overall Stats
    d3.csv("../../data/interim/games/timeseries.csv"), // Time Series of Spread and Total by Book
    d3.csv("../../data/interim/website/game/markets_game.csv"), // Book and Aggregate Book Lines
    d3.csv("../../data/interim/website/game/project_and_errors.csv"), // Project and Errors 
    d3.csv("../../data/interim/website/game/timeseries_game.csv") // Timeseries of Markets
  ]).then(files => {

    let sample_id = "888635"
    let results_and_preds = []
    let home_cols = ['home_abbv', 'pts_home', 'market_score_home', 'm3_proj_home', 'm3_home_error', 'efg_pct_home', 'orb_pct_home', 'tov_pct_home', 'fta_per_fga_pct_home', 'game_possessions']
    let away_cols = ['away_abbv', 'pts_away', 'market_score_away', 'm3_proj_away', 'm3_away_error', 'efg_pct_away', 'orb_pct_away', 'tov_pct_away', 'fta_per_fga_pct_away', 'game_possessions']
    let tag_names = ["Team", "Score", "Market Projection", "Model Projection", "Model Error", "eFG%", "ORB%", "TOV%", "FTA/FGA%", "Pace"]
    book_summary_arr = files[3].filter((d) => d.game_id === sample_id)
    mark_predictions_arr = files[4].filter((d) => d.game_id === sample_id)
    time_summary_arr = files[5].filter((d) => d.game_id === sample_id)

    for (mkt of mark_predictions_arr){
        if (mkt.book == "average"){
            results_and_preds.push(mkt)
            results_and_preds.push(mkt)
        }
    }
    console.log(book_summary_arr) // book and book aggregates
    console.log(results_and_preds) // mark predictions and results 
    console.log(time_summary_arr) // timeseries of all markets for game

    name_cleaner =  {'CHR': 'CHO', 'SAN': 'SAS', 'GS': 'GSW', 'BKN': 'BRK', 'NY': 'NYK'}
    shark_names = Object.keys(name_cleaner)
    book_set = new Set()
    for (book of files[3]){
        book_set.add(book.book)
    }

    let filter_container = d3.select("body").append("div").attr("class", "container").style("background-color", "rgba(102,51,153,0.55)").attr("id", "filters")

    filter_container.append("h1").text("Overall Model").style("color", "white")
    filter_container.append("p").text("Choose a Book to Analyze the Model's Performance").style("color", "white").attr("align", "center")
    
    data_container = d3.select("body").append("div").style("background-color", "rgba(102,51,153,0.62)").attr("class", "container").attr("id", "DataHouse")
    data_container.append("h1").style("color", "white").text("Game #500")
    row = data_container.append("div").attr("class", "row").attr("id", "predRow")

    function createResults(data){
        var k = 1
        for (d of data){
            let loc = "home"
            let starting_stats = home_cols
            if (k !== 1){
                loc = "away"
                starting_stats = away_cols
                row.append("div").style("width", "100%").style("text-align", "center").attr("class", "col-md-4")
            }

            d.game_possessions = parseFloat(d.game_possessions).toFixed(2)
            column = row.append("div").style("width", "100%")
                    .style("text-align", "center").attr("class", "col-md-4").attr("id", loc)
                    

            column.append("img").style("margin-bottom", "25px")
                    .style("height", "200px")
                    .style("width", "200px").attr("class", "img-fluid").attr("alt", "img-fluid")
                    .attr("align", "center").attr("src", `Resources/assets/images/NBA/${d[`${loc+"_abbv"}`]}.png`)
            
            let i = 0
            for (stat of starting_stats){
                column.append("h2").style("font-size", "20px").style("color", "white").text(`${tag_names[i]}:`)
                column.append("h3").style("font-size", "20px").style("color", "white").text(d[stat])
                i++
            }
            
            k = k + 1
        }
        row.append("br")
    }

    function createTime(data){

        let row = d3.select("#DataHouse").append("div").style("align", "center").attr("class", "row").attr("id", "secondrow")
        // column = row.append("div").style("text-align", "center").style("align", "center").attr("class", "col-m-12")
        // column.append("h1").style("color", "white").text("Market Analysis")
        // book_table = column.append("table").style("align", "center").style("margin-left", "400px").style("margin-bottom", "20px").style("max-width", "500px").attr("class", "table-sm")
        
        var plot_data = {}
        var columns = Object.keys(data[0])
        plot_data =  {}
        var trace_arr = [];
        for (book of book_set){
            book_data = data.filter((obj) => obj.book === book)
            plot_data[book] = {}
            x = []
            y = []
            y_1 = []
            book_data.forEach(item => {
                let date = new Date(item.timestamp)
                x.push(date)
                y.push(parseFloat(item.spread_line))
                y_1.push(parseFloat(item.spread_odds))

            })

            plot_data[book].x = x
            plot_data[book].y = y
            plot_data[book].y_1 = y_1
        }

        for (key of Object.keys(plot_data)){
            var trace = {
                x: plot_data[key].x, // date 
                y: plot_data[key].y, // spread line
                mode: "line+markets",
                line: {shape: "spline"},
                name: key

            }
            var trace_1 = {
                x: plot_data[key].x, // date 
                y: plot_data[key].y_1, // spread odds
                mode: "line+markets",
                line: {shape: "spline"},
                name: `${key} Odds`,
                yaxis: "y2"

            }

            trace_arr.push(trace)
            trace_arr.push(trace_1)
        }

        var layout = {
            title: 'Spread Market Movement',
            showlegend: true,
            height: 500,
            yaxis: {
                title: "line",
                side: 'right'
            },
            yaxis2: {
                title: 'Odds',
                overlaying: 'y',
                side: 'left'
              }
          };

        Plotly.newPlot("secondrow", trace_arr, layout);     
}
    function createBooks(data){
        let row = d3.select("#DataHouse").append("div").style("align", "left").attr("class", "row").attr("id", "bookrow")
        let circle_pairings = [["ml_pk", "moneyline_home"], ["spread_pk", "spread_home", "spread_odds_home"], ["total_pk", "total", "under_odds"],
        ["ml_pk", "ml_winnings", "moneyline_home"], ["spread_pk", "spread_winnings", "spread_odds_home"], ["total_pk", "total_winnings", "under_odds"], ["ovr_pk", "agg_winnings"]]
        let books_number = data.length
        let columns = Object.keys(data[0])
        let j = 0;
        //console.log(data)
        for (d of data){

            column = row.append("div").style("width", "50%")
                    .style("text-align", "left").style("align", "left").attr("class", "col-md-12")

            column.append("img").style("margin-bottom", "25px")
                    .style("height", "100px")
                    .style("width", "200px")
                    .attr("align", "left").attr("src", `Resources/assets/images/NBA/${d.book}.png`)
            // objects of via books
            // For every book I have the book associate's lines, the model evaluation with respect to pick and book and the associated winnings of the picks via the book's odds 
            // Display Book's Markets and Winnings in svgs
            // Use the pick grade to color the svg
            for (circle_cols of circle_pairings){
                var color = "green";
                svg = column.append("svg").style("height", "100px").style("width", "100px")
                if (d[circle_cols[0]]=== "L"){
                    color = "red"
                } else if (d[circle_cols[0]] === "P"){
                    color = "orange"
                }
                circle = svg.append("circle").text(d.spread_home).attr("cx", 50).attr("cy", 50).attr("r", 40).attr("style-width", 3).attr("fill", color)
                text = svg.append("text").attr("x", 25).attr("y", 50).attr("fill", "white").text(d[circle_cols[1]])
                for (t of circle_cols.slice(2)){
                    text.append("tspan").style("font-size", 12).attr("x", 30).attr("y", 65).text(d[t])
                }
            }
               
            j++
        
        



        }

    }

    function createDataFilters(container, options, starting_value){
        // container :: string of container name
        // options :: array of arrays of options to place into selection
        // starting_value :: string for default
        let size = (12 / options.length) - 1
        size % 2 == 1 ? size = size - 1 : size = size 
        let button_size = 2
        let i = 0
        for (let filters of options){
          if (i == 0){
            var row = container.append("form").append("div").attr("class", "row")
          }
          let selection = row.append("div").attr("class", `col-sm-${size}`).append("select").style("margin-top", "5px").style("margin-bottom", "25px").attr("class", "form-control form-control-sm")
          .attr("type", "text").attr("placeholder", starting_value)
          for (let option of filters){
            selection.append("option").text(option)
          }
          i++
        }
        let form = d3.select(".row")
        form.append("div").attr("class", `col-sm-${button_size}`).attr("align", "center").append("button").attr("class", "btn btn-warning").attr("type","button").style("max-height", "40px").style("max-width", "80px").style("margin-right", "10px")
        .style("margin-top", "5px").text("Submit").attr("id", "submitButton")
      }


    function buildCandleStick(data){
        let x = []
        let 




    }
    



    // Build Containers and Attach Data
    createDataFilters(filter_container, [Array.from(book_set)], "A")
    createResults(results_and_preds)
    createTime(time_summary_arr)
    createBooks(book_summary_arr)
  })