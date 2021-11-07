d3.csv("../../data/interim/results_sample.csv").then(csvData => {
    // Grab Box
    container = d3.select("#predRow")
    // Create a Table
    data = csvData
    // Your Columns
    headers = Object.keys(data[0])
    // Insert Each Row Into Table
    table = container.append("table").attr("class", "table table-bordered")
    
    function addHeaders(array){
        head = table.append("thead").attr("class", "thead-dark")
        row = head.append("tr")
        for (header of array){
            row.append("th").text(header)
        }
    }

    addHeaders(headers)
    body = table.append("tbody")
    for (d of data){
        row = body.append("tr")
        for (metric of Object.values(d)){
            row.append("td").text(metric)
        }
    }









})
    
    