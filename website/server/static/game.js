// Promise.all([
//     d3.csv("static/data/game/markets_game.csv"), // Book and Aggregate Book Lines[0]
//     d3.csv("static/data/game/project_and_errors.csv"), // Project and Errors [1]
//     d3.csv("static/data/game/timeseries_game.csv"), // Timeseries of Markets[2]
//     d3.csv("static/data/game_log/time_agg.csv"), // Market factors[3]
//     d3.csv("static/data/dash/team_picks.csv"), // [4]
//     d3.csv("static/data/game_log/summary_table_results.csv"), //[5]
//   ]).then(files => {

files = [markets_game, markets_error, timeseries_game, [], team_picks, summary_table]


let results_and_preds = []
let home_cols = ['pts_home', 'market_score_home', 'm3_proj_home', 'm3_home_error', 'efg_pct_home', 'orb_pct_home', 'tov_pct_home', 'fta_per_fga_pct_home', 'game_possessions']
let away_cols = ['pts_away', 'market_score_away', 'm3_proj_away', 'm3_away_error', 'efg_pct_away', 'orb_pct_away', 'tov_pct_away', 'fta_per_fga_pct_away', 'game_possessions']
let market_makers = ['m3_proj_home', 'm3_proj_away', 'market_score_home', 'market_score_away',
'm3_whole_deviation', 'market_whole_error', "m3_whole_error"] // book and date
let tag_names = ["Score", "Market Projection", "Model Projection", "Model Error", "eFG%", "ORB%", "TOV%", "FTA/FGA%", "Pace"]
let tag_markets =[ "Market Spread", "Model Spread", "Market Total", "Model Total", "Difference", "True Spread", "True Total","Total Market Error", "Total Model Error"] // "Book", "Tip-Off",
book_summary_arr = files[0]//.filter((d) => d.game_id === sample_id)
mark_predictions_arr = files[1]//.filter((d) => d.game_id === sample_id)
time_summary_arr = files[2]//.filter((d) => d.game_id === sample_id)
// times_books_arr = files[3]//.filter((d) => d.game_id === sample_id)
picks_arr = files[4]//.filter((d) => d.game_id === sample_id)
book_range = files[5]//.filter((d) => d.game_id === sample_id)

open_ = book_summary_arr.filter((c) => c.book === "Opening")[0]
initial_spread = open_.market_score_away - open_.market_score_home; 
initial_total =  open_.market_score_away + open_.market_score_home;
var closing_market; 

// console.log(files[3])
// console.log(files[4])
// console.log(files[5])

// console.log(book_range)
// console.log(book_summary_arr) // book and book aggregates
// console.log(mark_predictions_arr) // mark predictions and results 
// console.log(time_summary_arr) // timeseries of all markets for game
// console.log(times_books_arr) // Summary Agg Information on Books
// console.log(picks_arr)



name_cleaner =  {'CHR': 'CHO', 'SAN': 'SAS', 'GS': 'GSW', 'BKN': 'BRK', 'NY': 'NYK'}
shark_names = Object.keys(name_cleaner)
book_set = new Set()
for (book of book_summary_arr){
    book_set.add(book.book)
}

let filter_container = d3.select("body").append("div").attr("class", "container").style("background-color", "rgba(102,51,153,0.55)").attr("id", "filters")

filter_container.append("h1").text("Overall Model").style("color", "white")
filter_container.append("p").text("Choose a Book to Analyze the Model's Performance").style("color", "white").attr("align", "center")

data_container = d3.select("body").append("div").style("background-color", "rgba(102,51,153,0.62)").attr("class", "container").attr("id", "DataHouse")
data_container.append("h1").style("color", "white").text(`Game #${id}`)
row = data_container.append("div").attr("class", "row").attr("id", "predRow")
var spread_market;
var total_market;
var money_market;

function createResults(data, odds, eval, wanted_book){
    var k = 1
    // console.log(data)
    odds = odds.filter((o) => o.book === wanted_book)
    eval = eval.filter((o) => o.book === wanted_book)
    data = data.filter((o) => o.book === wanted_book)
    data.push(data[0])
    data.push(data[0])
    
    added_obj = {}

    const e_cols = ["ml_pick", "ml_pk", "ml_team", "spread_pick", "spread_pk", "spread_team", "total_pick", "total_pk"]
    let home_switch = 0
    const o_cols = ["over_odds", "moneyline_home", "spread_odds_home"]
    if (eval[0]["ml_team"] !== eval[0]["home_abbv"]){
        o_cols[1] = "moneyline_away"
    }

    if (eval[0]["spread_team"] !== eval[0]["home_abbv"]){
        o_cols[2] = "spread_odds_away"
    }
    
    if (eval[0]["total_pick"] === "U"){
        o_cols[0] = "under_odds"
    }

    for (o of o_cols){
        added_obj[o.replace("_home", "").replace("_away", "").replace("over_", "total_").replace("under_", "total_")] = odds[0][o]
    }
    for (e of e_cols){
        added_obj[e] = eval[0][e]
    }
    // from eval need to get: ml_pick, ml_pk, ml_team, spread_pick, spread_pk, spread_team, total_pick, total_pk
    // from odds need to get over_/under_odds, moneyline_home/_away, and spread_home, spread_away
    var market_obj = {}
    console.log(data)
    for (d of data){
        let loc = "home"
        let starting_stats = home_cols
        var img_name = `${d[loc+"_abbv"]}`
        var tags_names = tag_names
        
        if (k === 3){
            loc = "away"
            starting_stats = away_cols
            img_name = `${d[loc+"_abbv"]}` 
            
        } else if (k === 2){
            img_name = d.book
            tags_names = tag_markets
            loc = "market"
            market_obj["Market Score Projection"] = `${(+d.market_score_away - +d.market_score_home).toFixed(2)}`
            spread_market =  `${(+d.market_score_home - +d.market_score_away).toFixed(2)}`
            spread_side = spread_market * -1 
            market_obj["Model Score Projection"] = `${(+d.m3_proj_away-+d.m3_proj_home).toFixed(2)}`
            market_obj["Market Total"] = `${(+d.market_score_home+(+d.market_score_away)).toFixed(1)}`
            total_market = `${(+d.market_score_home+(+d.market_score_away)).toFixed(1)}`
            market_obj["Model Total"] = `${(+d.m3_proj_home+(+d.m3_proj_away)).toFixed(1)}`
            market_obj["Model Deviation"] = `${d.m3_whole_deviation}`
            market_obj["Real Spread"] = `${(+d.pts_away-(+d.pts_home)).toFixed(0)}`
            market_obj["Real Total"] = `${(+d.pts_home+(+d.pts_away)).toFixed(0)}`
            market_obj["Market Error"] = `${d.market_whole_error}`
            market_obj["Model Error"] = `${d.m3_whole_error}`
            starting_stats = Object.keys(market_obj)
            d = market_obj
        }

        d.game_possessions = parseFloat(d.game_possessions).toFixed(2)
        column = row.append("div").style("width", "100%")
                .style("text-align", "center").attr("class", "col-md-4").attr("id", loc)
                

        column.append("img").style("margin-bottom", "25px")
                .style("height", "200px")
                .style("width", "200px").attr("class", "img-fluid").attr("alt", "img-fluid")
                .attr("align", "center").attr("src", `static/assets/images/NBA/${img_name}.png`)
        
        let i = 0
        for (stat of starting_stats){
        
            column.append("h2").style("font-size", "20px").style("color", "white").text(`${tags_names[i]}:`)
            column.append("h3").style("font-size", "18px").style("color", "white").text(d[stat])
            i++
        }
        
        k = k + 1
    }
    row.append("br")
    let pk_to_num = {
        "W": spread_side > 0 ?`+${spread_side}`: `${spread_side}`, "L": spread_market > 0 ? `+${spread_market}`: `${spread_market}`,
        "O": "Over", "U": "Under"
    }
    row.append("div").style("width", "100%").style("text-align", "center").attr("class", "col-md-6").attr("id", "pickString")
        .append("h1").style("font-size", "55px").style("color", "white").text("Picks:")
    let p = d3.select("#pickString")
    let a_1 = p.append("a")
    a_1.append("img").style("margin-bottom", "5px").style("height", "100px").style("width", "100px").attr("class", "img-fluid").attr("alt", "img-fluid")
    .attr("align", "center").attr("src", `static/assets/images/NBA/${added_obj.spread_team}.png`)
    a_1.append("p").style("font-size", "25px").style("color", "white").text(`${pk_to_num[added_obj.spread_pick]} @ ${added_obj.spread_odds}`)
    let a_2 = p.append("a")
    a_2.append("img").style("margin-bottom", "10px").style("height", "100px").style("width", "100px").attr("class", "img-fluid").attr("alt", "img-fluid")
    .attr("align", "center").attr("src", `static/assets/images/NBA/${added_obj.ml_team}.png`)
    a_2.append("p").style("font-size", "25px").style("color", "white").text(`To Win @ ${added_obj.moneyline}`)
    let a_3 = p.append("a")
    a_3.append("img").style("margin-bottom", "10px").style("height", "100px").style("width", "100px").attr("class", "img-fluid").attr("alt", "img-fluid")
    .attr("align", "center").attr("src", `static/assets/images/NBA/${added_obj.total_pick}.png`)
    a_3.append("p").style("font-size", "25px").style("color", "white").text(`${pk_to_num[added_obj.total_pick]} ${total_market} @ ${added_obj.total_odds}`)
    
    best_books = []
    added_obj.spread_pick === "W"? best_books.push("spread_home_book") : best_books.push("spread_away_book")
    added_obj.ml_pick === "W"? best_books.push("moneyline_home_book") : best_books.push("moneyline_away_book")
    best_books.push("total_book")

    row.append("div").style("width", "100%").style("text-align", "center").attr("class", "col-md-6").attr("id", "bestBooks")
        .append("h1").style("font-size", "55px").style("color", "white").text("Best Lines:")
    let p2 = d3.select("#bestBooks")
    let final_obj = {"spread_away_book": "spread_odds_away", "spread_home_book": "spread_odds_home", "O": "over_odds", "U": "under_odds", "moneyline_home_book": "moneyline_home", "moneyline_away_book": "moneyline_away"}        
    for (let i=0; i<3; i++){
        m_obj = book_summary_arr.filter((o) => o.book === book_range[0][best_books[i]])[0]
        let a_4 = p2.append("a")
        a_4.append("img").style("margin-bottom", "5px").style("height", "100px").style("width", "100px").attr("class", "img-fluid").attr("alt", "img-fluid")
        .attr("align", "center").attr("src", `static/assets/images/NBA/${m_obj.book}.png`)
        total_line = m_obj[best_books[i].replace('_book', '')]
        if (i == 2 & added_obj.total_pick === "O"){
            best_books[2] = "O"
            total_line = m_obj["total"]                
        } else if (i === 2){
            best_books[2] = "U"
            total_line = m_obj["total"]
        }
        a_4.append("p").style("font-size", "25px").style("color", "white").text(`${total_line} @ ${m_obj[final_obj[best_books[i]]]}`)
        
    }



}

function createTime(data){

    let row = d3.select("#DataHouse").append("div").style("align", "center").attr("class", "row").attr("id", "secondrow")
    // column = row.append("div").style("text-align", "center").style("align", "center").attr("class", "col-m-12")
    // column.append("h1").style("color", "white").text("Market Analysis")
    // book_table = column.append("table").style("align", "center").style("margin-left", "400px").style("margin-bottom", "20px").style("max-width", "500px").attr("class", "table-sm")
    
    var plot_data = {}
    var columns = Object.keys(data[0])
    plot_data =  {}
    var trace_arr_1 = [];
    var trace_arr_2 = [];
    for (book of book_set){
        book_data = data.filter((obj) => obj.book === book)
        plot_data[book] = {}
        x = []
        y = []
        y_1 = []
        t = [];
        t_1 = [];
        book_data.forEach(item => {
            let date = new Date(item.timestamp)
            x.push(date)
            y.push(parseFloat(item.spread_line))
            y_1.push(`Price: ${(item.spread_odds)}`)
            t.push(parseFloat(item.total_line))
            t_1.push(`Price: ${(item.over_odds)}`)


        })

        plot_data[book].x = x
        plot_data[book].y = y
        plot_data[book].y_1 = y_1
        plot_data[book].t = t
        plot_data[book].t_1 = t_1
    }
    
    for (key of Object.keys(plot_data)){
        var trace = {
            x: plot_data[key].x, // date 
            y: plot_data[key].y, // spread line
            mode: "lines+markers",
            text: plot_data[key].y_1,
            line: {shape: "vhv"},
            name: key

        }
        var trace_1 = {
            x: plot_data[key].x, // date 
            y: plot_data[key].t, // total line
            mode: "lines+markers",
            text: plot_data[key].t_1,
            line: {shape: "vhv"},
            name: `${key} Odds`
        }

        trace_arr_1.push(trace)
        trace_arr_2.push(trace_1)
    }

    var layout = {
        title: 'Spread Market Movement',
        showlegend: true,
        height: 500,
        yaxis: {
            title: "Home Spread",
            side: 'left'
        },
        xaxis: {
            title: "Time"
        }
        };

    var layout_2 = {
        title: 'Total Market Movement',
        showlegend: true,
        height: 500,
        yaxis: {
            title: "Total",
            side: 'left'
        },
        xaxis: {
            title: "Time"
        }
    }

    Plotly.newPlot("secondrow", trace_arr_1, layout);
    d3.select("#DataHouse").append("div").style("align", "center").attr("class", "row").attr("id", "thirdrow")
    Plotly.newPlot("thirdrow", trace_arr_2, layout_2);      
}
function createBooks(data, wanted_book, first){
    var row;
    if (first){
        row = d3.select("#DataHouse").append("div").style("align", "left").attr("class", "row").attr("id", "bookrow")
    } else {
        row = d3.select("#bookrow")
    }

    obj_agg= {}
    //book_dims = times_books_arr.map((o) => obj_agg[o["market"]+ "_" + o["calc"]] = o[wanted_book])
        
    let circle_pairings = [["ml_pk", "moneyline_home"], ["spread_pk", "spread_home", "spread_odds_home"], ["total_pk", "total", "under_odds"],
    ["ml_pk", "ml_winnings", "moneyline_home"], ["spread_pk", "spread_winnings", "spread_odds_home"], ["total_pk", "total_winnings", "under_odds"], ["ovr_pk", "agg_winnings"]]
    let books_number = data.length
    let columns = Object.keys(data[0])
    let j = 0;
    let cols_circle = ["ML Odds:", "Spread Line:", "Total Line:", "ML $" ,"Spread $", "Total $", "Game $"]
    g_data = data.filter((o) => o.book === wanted_book)

    for (d of g_data){

        column = row.append("div").style("width", "100%")
                .style("text-align", "left").style("align", "left").attr("class", "col-md-12")

        column.append("img").style("margin-bottom", "25px")
                .style("height", "100px")
                .style("width", "200px")
                .attr("align", "left").attr("src", `static/assets/images/NBA/${d.book}.png`)
        // objects of via books
        // For every book I have the book associate's lines, the model evaluation with respect to pick and book and the associated winnings of the picks via the book's odds 
        // Display Book's Markets and Winnings in svgs
        // Use the pick grade to color the svg

        for (circle_cols of circle_pairings){
            var color = "green";
            svg = column.append("svg").style("height", "120px").style("width", "120px").style("text-align", "center")//.style("margin-top", "25px")
            if (d[circle_cols[0]]=== "L"){
                color = "red"
            } else if (d[circle_cols[0]] === "P"){
                color = "orange"
            }
            circle = svg.append("circle").text(d.spread_home).attr("cx", 60).attr("cy", 60).attr("r", 50).attr("style-width", 3).attr("fill", color)
            text = svg.append("text").attr("x", 25).attr("y", 50).attr("fill", "white").style("font-size", 11).text(cols_circle[j])
            text.append("tspan").attr("x", 35).attr("y", 70).attr("fill", "white").text(d[circle_cols[1]])
            text.append("tspan").style("font-size", 8).attr("x", 25).attr("y", 90).text(d[t])
                
            
            j++
        }
            
        
    
    



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
        .attr("type", "text").attr("placeholder", starting_value).attr("id", "bookSelection")
        for (let option of filters){
        selection.append("option").text(option)
        }
        i++
    }
    let form = d3.select(".row")
    form.append("div").attr("class", `col-sm-${button_size}`).attr("align", "center").append("button").attr("class", "btn btn-warning").attr("type","button").style("max-height", "40px").style("max-width", "80px").style("margin-right", "10px")
    .style("margin-top", "5px").text("Submit").attr("id", "submitButton")
    }



// Build Containers and Attach Data
createDataFilters(filter_container, [Array.from(book_set)], "A")
results_and_preds.push(results_and_preds[1])
createResults(mark_predictions_arr, book_summary_arr, picks_arr, "average")
createTime(time_summary_arr)
createBooks(book_summary_arr, "average", true)

d3.select("#submitButton").on("click", function(event) {
    var wanted_book = d3.select("#bookSelection")._groups[0][0].value
    //console.log(wanted_book)
    document.getElementById("predRow").innerHTML = ""
    createResults(mark_predictions_arr, book_summary_arr, picks_arr, wanted_book)
    document.getElementById("bookrow").innerHTML = ""
    createBooks(book_summary_arr, wanted_book, false)
    

})







