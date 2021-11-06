img_obj = {
    'Baltimore Ravens': ['134922', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/einz3p1546172463.png"], 
    'San Francisco 49ers': ['134948', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/bqbtg61539537328.png"], 
    'Kansas City Chiefs': ['134931', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/936t161515847222.png"], 
    'New England Patriots': ['134920', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/xtwxyt1421431860.png"], 
    'New Orleans Saints': ['134944', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/nd46c71537821337.png"], 
    'Seattle Seahawks': ['134949', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/wwuqyr1421434817.png"],
    'Green Bay Packers': ['134940', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/rqpwtr1421434717.png"],
    'Minnesota Vikings': ['134941', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/qstqqr1421609163.png"], 
    'Buffalo Bills': ['134918', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/6pb37b1515849026.png"], 
    'Tennessee Titans': ['134929', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/m48yia1515847376.png"], 
    'Houston Texans': ['134926', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/wqyryy1421436627.png"], 
    'St. Louis Rams': ['135907', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/8e8v4i1599764614.png"],
    'Pittsburgh Steelers': ['134925', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/2975411515853129.png"],
    'Dallas Cowboys': ['134934', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/wrxssu1450018209.png"], 
    'Oakland Raiders': ['134932', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/xqusqy1421724291.png"], 
    'Philadelphia Eagles': ['134936', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/pnpybf1515852421.png"],
    'Tampa Bay Buccaneers': ['134945', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/2dfpdl1537820969.png"], 
    'Chicago Bears': ['134938', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/uwtwtv1420941123.png"], 
    'Cleveland Browns': ['134924', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/squvxy1420942389.png"], 
    'Denver Broncos': ['134930', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/upsspx1421635647.png"], 
    'Indianapolis Colts': ['134927', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/wqqvpx1421434058.png"], 
    'New York Jets': ['134921', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/rurvuu1421435228.png"], 
    'Atlanta Falcons': ['134942', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/rrpvpr1420658174.png"] ,
    'Carolina Panthers': ['134943', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/xxyvvy1420940478.png"], 
    'Miami Dolphins': ['134919', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/trtusv1421435081.png"], 
    'New York Giants': ['134935', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/vxppup1423669459.png"], 
    'Arizona Cardinals': ['134946', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/xvuwtw1420646838.png"], 
    'San Diego Chargers': ['135908', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/wbhu3a1548320628.png"],
    'Jacksonville Jaguars': ['134928', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/0mrsd41546427902.png"], 
    'Detroit Lions': ['134939', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/lgsgkr1546168257.png"], 
    'Cincinnati Bengals': ['134923', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/qqtwwv1420941670.png"], 
    'Washington Redskins': ['134937', "https:\/\/www.thesportsdb.com\/images\/media\/team\/badge\/1m3mzp1595609069.png"]
}

//console.log(img_obj)

d3.csv('webData.csv').then(csvData => {
    var yearS = d3.select("#YearSelect")
    var weekS = d3.select("#WeekSelect")
    var gameS = d3.select("#GameSelect")
    var data = csvData
    var gameIDs = [];

    for (d of data){
        gameIDs.push(d.GAMEID)
    }



    // var home_Score = d3.select("#ModelScoreH")
    // var true_h = d3.select("#TrueScoreH")
    // var error_h= d3.select("#ErrorH")
    // var name_h= d3.select("#TeamNameH")

    // var away_Score = d3.select("#ModelScoreA")
    // var true_a = d3.select("#TrueScoreA")
    // var error_a= d3.select("#ErrorA")
    // var name_a= d3.select("#TeamNameA")
    // var img_h= document.getElementById("HomeImage")
    // var img_a= document.getElementById("AwayImage")//.src="../template/save.png";


    let isFirst = false 


    var gameid = [];
    var sss = [];
    console.log(typeof(data))

    function getGames(year, week){
        if(isFirst){console.log(gameS.selectAll("select.child"))
            console.log(typeof(gameS.selectAll("select.child")))
        }
        for (scores of data){

            if ((scores.Year == year) & (scores.Week2 == week) ) {
                var rightWeek = scores.Week_x
                var otherWeek = scores.Week2
                
                gameS.append("option").text(scores.GAMEID).attr("class", "child")
                //gameid.push(scores.GAMEID)

            }
        }
        isFirst = true;
    }

    console.log(data)

    var teamOne = data[0]
    var teamTwo = data[1]
    var row = d3.select("#predRow")
    function display(d1){
    document.getElementById("predRow").innerHTML="";
    
    let arre = [];
    let f = 0;
    let games = d1.length / 2;
    for (var r of d1){
        var m1 = r.Model1_Prediction
        var m2 = r.Model2_Prediction
        var m3 = r.Model3_Prediction
        var m5 = r.Model5_Prediction
        m5 = parseFloat(m5).toFixed(2)
        
        var e5 = r.Model5_Error
        e5 = parseFloat(e5).toFixed(2)
        var real = r.TEAM_POINTS
        var teamName = r.FINAL_TEAM_NAME
        let img_N = teamName.replace(/\s/g, "_")
        row.append("div").enter().attr("class", "col-md-6").attr("id", "HomeTEAM")
            .style("width", "100%")
            .style("text-align", "center")
        if (f % 2 == 0){
            var column = row.append("div").attr("class", "col-md-6").attr("id", `HomeTEAM${f}`)
            .style("width", "100%")
            .style("text-align", "center")
            
            column.append("h2")
            .style("font-size", "36px")
            .style("color", "white")
            .attr("id", `HomeTEAM${f}NAME`)
            .text(teamName)
            

            column.append("a").attr("id", `link${f}`)
            .append("img").attr("id", `HOMEIMAGE${f}`).attr("class", "img-fluid").attr("alt", "img-fluid")
            .style("width", "100%").style("margin-bottom", "25px")
            .style("max-height", "200px")
            .style("max-width", "200px")
            .attr("align", "center").attr("src", `Resources/assets/images/${img_N}.png`)

            column.append("h3").append("b")
            .attr("text-align", "center")
            .text("Predicted Score:")

            column.append("h4").append("b")
            .style("text-align", "center")
            .text(m5)

            column.append("br")

            column.append("h3").append("b")
            .attr("text-align", "center")
            .text("Game Score:")

            column.append("h4").append("b")
            .style("text-align", "center")
            .text(real)

            column.append("br")

            column.append("h3").append("b")
            .attr("text-align", "center")
            .text("MSE:")

            column.append("h4").append("b")
            .style("text-align", "center")
            .text(e5)

            column.append("br")
            // margin-bottom: 25px; max-height: 200px; max-width: 200px;" align="center"

            
    
            
        } else{
            var column = row.append("div").attr("class", "col-md-6").attr("id", `AwayTEAM${f}`)
            .style("width", "100%")
            .style("text-align", "center")
            
            column.append("h2")
            .style("font-size", "36px")
            .style("color", "white")
            .attr("id", `AwayTEAM${f}NAME`)
            .text(teamName)
            

            column.append("a").attr("id", `link${f}`)
            .append("img").attr("id", `AwayIMAGE${f}`).attr("class", "img-fluid").attr("alt", "img-fluid")
            .style("width", "100%").style("margin-bottom", "25px")
            .style("max-height", "200px")
            .style("max-width", "200px")
            .attr("align", "center").attr("src", `Resources/assets/images/${img_N}.png`)

            column.append("h3").append("b")
            .attr("text-align", "center")
            .text("Predicted Score:")

            column.append("h4").append("b")
            .style("text-align", "center")
            .text(m5)

            column.append("br")

            column.append("h3").append("b")
            .attr("text-align", "center")
            .text("Game Score:")

            column.append("h4").append("b")
            .style("text-align", "center")
            .text(real)

            column.append("br")

            column.append("h3").append("b")
            .attr("text-align", "center")
            .text("MSE:")

            column.append("h4").append("b")
            .style("text-align", "center")
            .text(e5)

            column.append("br")
            
            //img_a.src = img_obj[teamName][1]
            arre.push([m1, m2, m3, m5])
        }

        f += 1
    }

    // newlist = []
    // model1s = toString(arre[0][0]) + "/" +  toString(arre[1][0]) 
    // model2s = toString(arre[0][1]) + "/" +  toString(arre[1][1]) 
    // model3s = toString(arre[0][2]) + "/" +  toString(arre[1][2]) 
    // model5s = toString(arre[0][3]) + "/"+  toString(arre[1][3]) 


    // body = d3.select('#modelPerformance')
    //     svg = body.append('svg').attr('height', 135).attr('width', 400)
    //     rect = svg.append('rect').attr('width', 100)
    //           .attr('height', 100)
    //           .attr('x', 50)
    //           .attr('y', 20)
    //           .attr('rx', 20)
    //           .attr('ry', 20)
    //           .style('fill', 'red')
    //           .style('opacity', 0.7)
    //           .attr('stroke', 'black')
    //           .attr('stroke-width', 5)
    //     text = svg.append('text').text('FPI') // FPI
    //           .attr('x', 83)
    //           .attr('y', 60)
    //           .style('font-size', 24)
    //           .style('font-weight', 'bold')
    //           .attr('fill', 'white')
    //     texta = svg.append('text').text(model1s)
    //           .attr('x', 72)
    //           .attr('y', 90)
    //           .style('font-size', 22)
    //           .style('font-weight', 'bold')
    //           .attr('fill', 'orange')
    // // Model 2
    //     svg2 = body.append('svg').attr('height', 135).attr('width', 400)
    //     rect2 = svg2.append('rect').attr('width', 100)
    //           .attr('height', 100)
    //           .attr('x', 50)
    //           .attr('y', 20)
    //           .attr('rx', 20)
    //           .attr('ry', 20)
    //           .style('fill', 'red')
    //           .style('opacity', 0.7)
    //           .attr('stroke', 'black')
    //           .attr('stroke-width', 5)
    //     text2 = svg2.append('text').text('Deluxe FPI')
    //           .attr('x', 60)
    //           .attr('y', 60)
    //           .style('font-size', 16)
    //           .style('font-weight', 'bold')
    //           .attr('fill', 'white')
    //     text2a = svg2.append('text').text(model2s)
    //           .attr('x', 72)
    //           .attr('y', 90)
    //           .style('font-size', 22)
    //           .style('font-weight', 'bold')
    //           .attr('fill', 'orange')
    // // Model 3: Pts. and Turnovers
    //     svg3 = body.append('svg').attr('height', 135).attr('width', 400)
    //     rect3 = svg3.append('rect').attr('width', 100)
    //           .attr('height', 100)
    //           .attr('x', 50)
    //           .attr('y', 20)
    //           .attr('rx', 20)
    //           .attr('ry', 20)
    //           .style('fill', 'green')
    //           .style('fill-opacity', 0.78)
    //           //.style('opacity', 0.7)
    //           .attr('stroke', 'black')
    //           .attr('stroke-width', 5)
    //     text3 = svg3.append('text').text('YDs + TOs')
    //           .attr('x', 64)
    //           .attr('y', 60)
    //           .style('font-size', 16)
    //           .style('font-weight', 'bold')
    //           .attr('fill', 'white')
    //     svg3.append('text').text(model3s)
    //           .attr('x', 72)
    //           .attr('y', 90)
    //           .style('font-size', 22)
    //           .style('font-weight', 'bold')
    //           .attr('fill', 'orange')
    // // Model 5: EPA and Success Rate
    //     svg4 = body.append('svg').attr('height', 135).attr('width', 400)
    //     rect4 = svg4.append('rect').attr('width', 100)
    //           .attr('height', 100)
    //           .attr('x', 50)
    //           .attr('y', 20)
    //           .attr('rx', 20)
    //           .attr('ry', 20)
    //           .style('fill', 'green')
    //           .style('opacity', 0.85)
    //           .attr('stroke', 'black')
    //           .attr('stroke-width', 5)
    //     text4 = svg4.append('text').text('EPA and SR')
    //           .attr('x', 58)
    //           .attr('y', 60)
    //           .style('font-size', 16)
    //           .style('font-weight', 'bold')
    //           .attr('fill', 'white')
    //     svg4.append('text').text(model5s)
    //           .attr('x', 72)
    //           .attr('y', 90)
    //           .style('font-size', 22)
    //           .style('font-weight', 'bold')
    //           .attr('fill', 'white')
}
    getGames("2020", "9")
    var date = Date.now();
    console.log(date)
    newGame()

    function newGame(){
    var wanted_year = d3.select("#YearSelect")._groups[0][0].value
    var wanted_week = d3.select("#WeekSelect")._groups[0][0].value
    //var wanted_game = d3.select("#GameSelect")._groups[0][0].value
    d3.select("#WeekSelect").placeholder =  wanted_week
    d3.select("#WeekYear").placeholder =  wanted_year
    var fvalues = [];
    let hj = {};


    for (scores of data){
        if ((scores.Year == wanted_year) & (scores.Week2 == wanted_week)) {
            fvalues.push(scores)
        }
    }

    fvalues.sort((a, b) => {
        return a.GAMEID - b.GAMEID
    })

    console.log("SORTED")
    console.log(fvalues)
    display(fvalues)
    getGames(wanted_year, wanted_week)
    }




    d3.select("#submitButton").on("click", function(event) {
        newGame();
        var wanted_year = d3.select("#YearSelect")._groups[0][0].value
        var wanted_week = d3.select("#WeekSelect")._groups[0][0].value
        getGames(wanted_year, wanted_week)


    })

    d3.select("#weekSelect").on("change", function(event) {


        var wanted_year = d3.select("#YearSelect")._groups[0][0].value
        var wanted_week = d3.select("#WeekSelect")._groups[0][0].value
        //var wanted_game = d3.select("#GameSelect")._groups[0][0].value

        var fvalues = [];

        for (scores of data){
            if ((scores.Year == wanted_year) & (scores.Week2 == wanted_week)) {
                fvalues.push(scores)
            }
        }

        d3.select(".column-md-6").exit();

        getGames(wanted_year, wanted_week)

    })

})