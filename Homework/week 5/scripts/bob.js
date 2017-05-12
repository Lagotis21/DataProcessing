function lambda(){
    var margin = {top: 20, right: 30, bottom: 40, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // creating and appending an SVG to the <body> of the index page
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // x, y axis and colour
    var x = d3.time.scale().range([0, width]),
        y = d3.scale.linear().range([height, 0]),
        z = d3.scale.ordinal(d3.schemeCategory10);

    // scales x axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    // scales y axis
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // time parsing
    var formatDate = d3.time.format("%Y%m%d")
    // line variables
    var linemin = d3.svg.line()
        .x(function(d) {
            return x(formatDate.parse(d.date));
        })
        .y(function(d) {
            return y(d.minimum / 10);
        });

    var lineaverage = d3.svg.line()
        .x(function(d) {
            return x(formatDate.parse(d.date));
        })
        .y(function(d) {
            return y(d.average / 10);
        });

    var linemax = d3.svg.line()
        .x(function(d) {
            return x(formatDate.parse(d.date));
        })
        .y(function(d) {
            return y(d.maximum/ 10);
        });
}


// gemerate amd display barchart data
queue()
    .defer(d3.json, './Data/KNMI2010.json')
    .defer(d3.json, './Data/KNMI2011.json')
    .defer(d3.json, './Data/KNMI2012.json')
    .defer(d3.json, './Data/KNMI2013.json')
    .defer(d3.json, './Data/KNMI2014.json')
    .defer(d3.json, './Data/KNMI2015.json')
    .defer(d3.json, './Data/KNMI2016.json')
    .await(make_map);

    function make_map(error, data1, data2, data3, data4, data5, data6){
        if (error) {
            console.error("Oh my, something went wrong: " + error);
        }
        else {
            x.domain(d3.extent(data1, function(d) { return formatDate.parse(d.date); }));
            y.domain(d3.extent([
                d3.min(data3, function(d) {return Math.min(d.minimum / 10 )} ),
                d3.max(data1, function(d) {return Math.min(d.maximum / 10 )} )
            ]));

            svg.append("g")
             .attr("class", "x axis")
             .attr("transform", "translate(0," + height + ")")
             .call(xAxis)
             .append("text")
             .attr("y", 37)
             .attr("x", width )
             .style("text-anchor", "end")
             .text("Months of the year");

             svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
             .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -35)
                .attr("x", -(height / 4) - 30)
                .style("text-anchor", "end")
                .text("Temperature in celcius");

                function Load2011data() {
                    svg.append("g")
                        .attr("class", "minimum")
                        .append("g")
                            .attr("class", "year")
                            .append("path")
                                .attr("class", "line")
                                .attr("d", linemin(data1))
                                .attr("stroke", "orange")
                                .attr("stroke-width", 2)
                                .attr("fill", "none")

                    svg.append("g")
                        .attr("class", "average")
                        .append("g")
                            .attr("class", "year")
                            .append("path")
                                .attr("class", "line")
                                .attr("d", lineaverage(data1))
                                .attr("stroke", "blue")
                                .attr("stroke-width", 2)
                                .attr("fill", "none")

                    svg.append("g")
                        .attr("class", "maximum")
                        .append("g")
                            .attr("class", "eeat")
                            .append("path")
                                .attr("class", "line")
                                .attr("d", linemax(data1))
                                .attr("stroke", "red")
                                .attr("stroke-width", 2)
                                .attr("fill", "none")
                }

                function Load2011data() {
                            svg.append("g")
                                .attr("class", "minimum")
                                .append("g")
                                    .attr("class", "year")
                                    .append("path")
                                        .attr("class", "line")
                                        .attr("d", linemin(data1))
                                        .attr("stroke", "orange")
                                        .attr("stroke-width", 2)
                                        .attr("fill", "none")

                            svg.append("g")
                                .attr("class", "average")
                                .append("g")
                                    .attr("class", "year")
                                    .append("path")
                                        .attr("class", "line")
                                        .attr("d", lineaverage(data1))
                                        .attr("stroke", "blue")
                                        .attr("stroke-width", 2)
                                        .attr("fill", "none")

                            svg.append("g")
                                .attr("class", "maximum")
                                .append("g")
                                    .attr("class", "eeat")
                                    .append("path")
                                        .attr("class", "line")
                                        .attr("d", linemax(data1))
                                        .attr("stroke", "red")
                                        .attr("stroke-width", 2)
                                        .attr("fill", "none")
                }

        }
    };

}
