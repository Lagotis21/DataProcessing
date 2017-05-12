// Naam: Troy C. Breijaert
// studentnummer: 11587407

function Load2010Data(){
    // removes the svg so a fresh one is created
    d3.select("svg").remove();
    var margin = {top: 20, right: 30, bottom: 40, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // creating and appending an SVG to the <body> of the index page
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // x, y axis
    var x = d3.time.scale().range([0, width]),
        y = d3.scale.linear().range([height, 0]);

    // scales x axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    // scales y axis
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // time parsing
    var formatDate = d3.time.format("%Y%m%d");

    // line variable for the minimum temperature
    var linemin = d3.svg.line()
        .x(function(d) {
            return x(formatDate.parse(d.date));
        })
            .y(function(d) {
        return y(d.minimum / 10);
    });

    // line variable for the average temperature
    var lineaverage = d3.svg.line()
        .x(function(d) {
            return x(formatDate.parse(d.date));
        })
        .y(function(d) {
            return y(d.average / 10);
    });

    // line variable for the maximum temperature
    var linemax = d3.svg.line()
        .x(function(d) {
            return x(formatDate.parse(d.date));
        })
        .y(function(d) {
            return y(d.maximum/ 10);
    });

    var bisectDate = d3.bisector(function(d) { return formatDate.parse(d.date); }).left;

    // data parsing and loading
    d3.json("./Data/KNMI2010.json", function(error, data) {
        if (error) {
            console.error("Oh my, something went wrong: " + error);
        }
        else {
            // sets x and y domains
            x.domain(d3.extent(data, function(d) { return formatDate.parse(d.date); }));
            y.domain(d3.extent([
            d3.min(data, function(d) {return Math.min(d.minimum / 10 )} ),
            d3.max(data, function(d) {return Math.min(d.maximum / 10 )} )
            ]));

            // appends the x axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                    .attr("y", 37)
                    .attr("x", width)
                    .style("text-anchor", "end")
                    .text("Months of the year");

            // appends the y axis
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -35)
                    .attr("x", -(height / 4) - 30)
                    .style("text-anchor", "end")
                    .text("Temperature in celcius");

            // appends the minimum temperature line
            svg.append("g")
                .attr("class", "minimum")
                    .append("g")
                    .attr("class", "year")
                    .append("path")
                        .attr("class", "line")
                        .attr("d", linemin(data))
                        .attr("stroke", "blue")
                        .attr("stroke-width", 2)
                        .attr("fill", "none")

            // appends the average temperature line
            svg.append("g")
                .attr("class", "average")
                .append("g")
                    .attr("class", "year")
                    .append("path")
                        .attr("class", "line")
                        .attr("d", lineaverage(data))
                        .attr("stroke", "orange")
                        .attr("stroke-width", 2)
                        .attr("fill", "none")

            // appends the maximum temperature line
            svg.append("g")
                .attr("class", "maximum")
                .append("g")
                    .attr("class", "eeat")
                    .append("path")
                        .attr("class", "line")
                        .attr("d", linemax(data))
                        .attr("stroke", "red")
                        .attr("stroke-width", 2)
                        .attr("fill", "none")

            // appends a rect for max value
            d3.select("svg").append("rect")
                .attr("id", "max")
                .attr("class", "st1")
                .attr("x", width)
                .attr("y", 0)
                .attr('width', 15)
                .attr('height', 15)
                .style('fill', 'red');

            // appends text
            d3.select('svg').append('text')
                .attr('id', 'maxtemp')
                .attr('x', width - 150)
                .attr('y', 12)
                .text('maximum temperature');

            // appends a rect for average value
            d3.select("svg").append("rect")
                .attr("id", "avr")
                .attr("class", "st2")
                .attr("x", width)
                .attr("y", 20)
                .attr('width', 15)
                .attr('height', 15)
                .style('fill', 'orange');

            // appends text
            d3.select('svg').append('text')
                .attr('id', 'avrtemp')
                .attr('x', width - 135)
                .attr('y', 32)
                .text('average temperature');

            // appends a rect for min value
            d3.select("svg").append("rect")
                .attr("id", "min")
                .attr("class", "st3")
                .attr("x", width)
                .attr("y", 40)
                .attr('width', 15)
                .attr('height', 15)
                .style('fill', 'blue');

            // appends text
            d3.select('svg').append('text')
                .attr('id', 'mintemp')
                .attr('x', width - 147)
                .attr('y', 52)
                .text('minimum temperature');

            // something for the mouseover to focus on
            var focus = svg.append("g")
                .style("display", "none");

            // append the circle at the intersection
            focus.append("circle")
                .attr("class", "y")
                .style("fill", "none")
                .style("stroke", "blue")
                .attr("r", 4);

            // append the rectangle to capture mouse
            svg.append("rect")
                .attr("width", width)
                .attr("height", height)
                .style("fill", "none")
                .style("pointer-events", "all")
                .on("mouseover", function() { focus.style("display", null); })
                .on("mouseout", function() { focus.style("display", "none"); })
                .on("mousemove", mousemove);

            // function to display data on move
            function mousemove() {
                var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;

                focus.select("circle.y")
                .attr("transform",
                "translate(" + x(formatDate.parse(d.date)) + "," +
                         y(d.average) + ")");
            }
        }
    });
}

/*To make it easier on you, everything below here is a direct copy of the part above
  just with a incremental function name and a different json is loaded.

  Also it isn't exactly easy to code when the chrome/firefox console decides to be slow AF*/

function Load2011Data(){
    // removes the svg so a fresh one is created
    d3.select("svg").remove();

    var margin = {top: 20, right: 30, bottom: 40, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // creating and appending an SVG to the <body> of the index page
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // x, y axis
    var x = d3.time.scale().range([0, width]),
        y = d3.scale.linear().range([height, 0]);

    // scales x axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    // scales y axis
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // time parsing
    var formatDate = d3.time.format("%Y%m%d");

    // line variable for the minimum temperature
    var linemin = d3.svg.line()
        .x(function(d) {
            return x(formatDate.parse(d.date));
        })
        .y(function(d) {
            return y(d.minimum / 10);
        });

    // line variable for the average temperature
    var lineaverage = d3.svg.line()
        .x(function(d) {
            return x(formatDate.parse(d.date));
        })
        .y(function(d) {
            return y(d.average / 10);
        });

    // line variable for the maximum temperature
    var linemax = d3.svg.line()
        .x(function(d) {
            return x(formatDate.parse(d.date));
        })
        .y(function(d) {
            return y(d.maximum/ 10);
    });

    var bisectDate = d3.bisector(function(d) { return formatDate.parse(d.date); }).left;

    // data parsing and loading
    d3.json("./Data/KNMI2011.json", function(error, data) {
        if (error) {
            console.error("Oh my, something went wrong: " + error);
        }
        else {
            // sets x and y domains
            x.domain(d3.extent(data, function(d) { return formatDate.parse(d.date); }));
            y.domain(d3.extent([
            d3.min(data, function(d) {return Math.min(d.minimum / 10 )} ),
            d3.max(data, function(d) {return Math.min(d.maximum / 10 )} )
            ]));

            // appends the x axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                    .attr("y", 37)
                    .attr("x", width)
                    .style("text-anchor", "end")
                    .text("Months of the year");

            // appends the y axis
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -35)
                    .attr("x", -(height / 4) - 30)
                    .style("text-anchor", "end")
                    .text("Temperature in celcius");

            // appends the minimum temperature line
            svg.append("g")
                .attr("class", "minimum")
                .append("g")
                .attr("class", "year")
                .append("path")
                      .attr("class", "line")
                      .attr("d", linemin(data))
                      .attr("stroke", "blue")
                      .attr("stroke-width", 2)
                      .attr("fill", "none")

            // appends the average temperature line
            svg.append("g")
                .attr("class", "average")
                .append("g")
                    .attr("class", "year")
                    .append("path")
                        .attr("class", "line")
                        .attr("d", lineaverage(data))
                        .attr("stroke", "orange")
                        .attr("stroke-width", 2)
                        .attr("fill", "none")

            // appends the maximum temperature line
            svg.append("g")
            .attr("class", "maximum")
            .append("g")
                .attr("class", "eeat")
                .append("path")
                    .attr("class", "line")
                    .attr("d", linemax(data))
                    .attr("stroke", "red")
                    .attr("stroke-width", 2)
                    .attr("fill", "none")

            // appends a rect for max value
            d3.select("svg").append("rect")
                .attr("id", "max")
                .attr("class", "st1")
                .attr("x", width)
                .attr("y", 0)
                .attr('width', 15)
                .attr('height', 15)
                .style('fill', 'red');

            // appends text
            d3.select('svg').append('text')
                .attr('id', 'maxtemp')
                .attr('x', width - 150)
                .attr('y', 12)
                .text('maximum temperature');

            // appends a rect for average value
            d3.select("svg").append("rect")
                .attr("id", "avr")
                .attr("class", "st2")
                .attr("x", width)
                .attr("y", 20)
                .attr('width', 15)
                .attr('height', 15)
                .style('fill', 'orange');

            // appends text
            d3.select('svg').append('text')
                .attr('id', 'avrtemp')
                .attr('x', width - 135)
                .attr('y', 32)
                .text('average temperature');

            // appends a rect for min value
            d3.select("svg").append("rect")
                .attr("id", "min")
                .attr("class", "st3")
                .attr("x", width)
                .attr("y", 40)
                .attr('width', 15)
                .attr('height', 15)
                .style('fill', 'blue');

            // appends text
            d3.select('svg').append('text')
                .attr('id', 'mintemp')
                .attr('x', width - 147)
                .attr('y', 52)
                .text('minimum temperature');

            // mouseover focus
            var focus = svg.append("g")
                .style("display", "none");

            // append the circle at the intersection
            focus.append("circle")
                .attr("class", "y")
                .style("fill", "none")
                .style("stroke", "blue")
                .attr("r", 4);

            // append the rectangle to capture mouse
            svg.append("rect")
                .attr("width", width)
                .attr("height", height)
                .style("fill", "none")
                .style("pointer-events", "all")
                .on("mouseover", function() { focus.style("display", null); })
                .on("mouseout", function() { focus.style("display", "none"); })
                .on("mousemove", mousemove);

            // function to display data on move
            function mousemove() {
                var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;

                focus.select("circle.y")
                    .attr("transform",
                    "translate(" + x(formatDate.parse(d.date)) + "," +
                                   y(d.average) + ")");
            }
        }
    });
}

function Load2012Data(){
    // removes the svg so a fresh one is created
    d3.select("svg").remove();

    var margin = {top: 20, right: 30, bottom: 40, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // creating and appending an SVG to the <body> of the index page
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // x, y axis
    var x = d3.time.scale().range([0, width]),
        y = d3.scale.linear().range([height, 0]);

    // scales x axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    // scales y axis
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // time parsing
    var formatDate = d3.time.format("%Y%m%d");

    // line variable for the minimum temperature
    var linemin = d3.svg.line()
        .x(function(d) {
            return x(formatDate.parse(d.date));
        })
            .y(function(d) {
        return y(d.minimum / 10);
    });

    // line variable for the average temperature
    var lineaverage = d3.svg.line()
        .x(function(d) {
            return x(formatDate.parse(d.date));
        })
        .y(function(d) {
            return y(d.average / 10);
    });

    // line variable for the maximum temperature
    var linemax = d3.svg.line()
        .x(function(d) {
            return x(formatDate.parse(d.date));
        })
        .y(function(d) {
            return y(d.maximum/ 10);
    });

    var bisectDate = d3.bisector(function(d) { return formatDate.parse(d.date); }).left;

    // data parsing and loading
    d3.json("./Data/KNMI2012.json", function(error, data) {
        if (error) {
            console.error("Oh my, something went wrong: " + error);
        }
        else {
            // sets x and y domains
            x.domain(d3.extent(data, function(d) { return formatDate.parse(d.date); }));
            y.domain(d3.extent([
            d3.min(data, function(d) {return Math.min(d.minimum / 10 )} ),
            d3.max(data, function(d) {return Math.min(d.maximum / 10 )} )
            ]));

            // appends the x axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                    .attr("y", 37)
                    .attr("x", width)
                    .style("text-anchor", "end")
                    .text("Months of the year");

            // appends the y axis
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -35)
                    .attr("x", -(height / 4) - 30)
                    .style("text-anchor", "end")
                    .text("Temperature in celcius");

            // appends the minimum temperature line
            svg.append("g")
                .attr("class", "minimum")
                    .append("g")
                    .attr("class", "year")
                    .append("path")
                        .attr("class", "line")
                        .attr("d", linemin(data))
                        .attr("stroke", "blue")
                        .attr("stroke-width", 2)
                        .attr("fill", "none")

            // appends the average temperature line
            svg.append("g")
                .attr("class", "average")
                .append("g")
                    .attr("class", "year")
                    .append("path")
                        .attr("class", "line")
                        .attr("d", lineaverage(data))
                        .attr("stroke", "orange")
                        .attr("stroke-width", 2)
                        .attr("fill", "none")

            // appends the maximum temperature line
            svg.append("g")
                .attr("class", "maximum")
                .append("g")
                    .attr("class", "eeat")
                    .append("path")
                        .attr("class", "line")
                        .attr("d", linemax(data))
                        .attr("stroke", "red")
                        .attr("stroke-width", 2)
                        .attr("fill", "none")

            // appends a rect for max value
            d3.select("svg").append("rect")
                .attr("id", "max")
                .attr("class", "st1")
                .attr("x", width)
                .attr("y", 0)
                .attr('width', 15)
                .attr('height', 15)
                .style('fill', 'red');

            // appends text
            d3.select('svg').append('text')
                .attr('id', 'maxtemp')
                .attr('x', width - 150)
                .attr('y', 12)
                .text('maximum temperature');

            // appends a rect for average value
            d3.select("svg").append("rect")
                .attr("id", "avr")
                .attr("class", "st2")
                .attr("x", width)
                .attr("y", 20)
                .attr('width', 15)
                .attr('height', 15)
                .style('fill', 'orange');

            // appends text
            d3.select('svg').append('text')
                .attr('id', 'avrtemp')
                .attr('x', width - 135)
                .attr('y', 32)
                .text('average temperature');

            // appends a rect for min value
            d3.select("svg").append("rect")
                .attr("id", "min")
                .attr("class", "st3")
                .attr("x", width)
                .attr("y", 40)
                .attr('width', 15)
                .attr('height', 15)
                .style('fill', 'blue');

            // appends text
            d3.select('svg').append('text')
                .attr('id', 'mintemp')
                .attr('x', width - 147)
                .attr('y', 52)
                .text('minimum temperature');

            // something for the mouseover to focus on
            var focus = svg.append("g")
                .style("display", "none");

            // append the circle at the intersection
            focus.append("circle")
                .attr("class", "y")
                .style("fill", "none")
                .style("stroke", "blue")
                .attr("r", 4);

            // append the rectangle to capture mouse
            svg.append("rect")
                .attr("width", width)
                .attr("height", height)
                .style("fill", "none")
                .style("pointer-events", "all")
                .on("mouseover", function() { focus.style("display", null); })
                .on("mouseout", function() { focus.style("display", "none"); })
                .on("mousemove", mousemove);

            // function to display data on move
            function mousemove() {
                var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;

                focus.select("circle.y")
                .attr("transform",
                "translate(" + x(formatDate.parse(d.date)) + "," +
                         y(d.average) + ")");
            }
        }
    });
}


function Load2013Data(){
    // removes the svg so a fresh one is created
    d3.select("svg").remove();

    var margin = {top: 20, right: 30, bottom: 40, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // creating and appending an SVG to the <body> of the index page
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // x, y axis
    var x = d3.time.scale().range([0, width]),
        y = d3.scale.linear().range([height, 0]);

    // scales x axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    // scales y axis
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // time parsing
    var formatDate = d3.time.format("%Y%m%d");

    // line variable for the minimum temperature
    var linemin = d3.svg.line()
        .x(function(d) {
            return x(formatDate.parse(d.date));
        })
        .y(function(d) {
            return y(d.minimum / 10);
        });

    // line variable for the average temperature
    var lineaverage = d3.svg.line()
        .x(function(d) {
            return x(formatDate.parse(d.date));
        })
        .y(function(d) {
            return y(d.average / 10);
        });

    // line variable for the maximum temperature
    var linemax = d3.svg.line()
        .x(function(d) {
            return x(formatDate.parse(d.date));
        })
        .y(function(d) {
            return y(d.maximum/ 10);
    });

    var bisectDate = d3.bisector(function(d) { return formatDate.parse(d.date); }).left;

    // data parsing and loading
    d3.json("./Data/KNMI2013.json", function(error, data) {
        if (error) {
            console.error("Oh my, something went wrong: " + error);
        }
        else {
            // sets x and y domains
            x.domain(d3.extent(data, function(d) { return formatDate.parse(d.date); }));
            y.domain(d3.extent([
            d3.min(data, function(d) {return Math.min(d.minimum / 10 )} ),
            d3.max(data, function(d) {return Math.min(d.maximum / 10 )} )
            ]));

            // appends the x axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                    .attr("y", 37)
                    .attr("x", width)
                    .style("text-anchor", "end")
                    .text("Months of the year");

            // appends the y axis
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -35)
                    .attr("x", -(height / 4) - 30)
                    .style("text-anchor", "end")
                    .text("Temperature in celcius");

            // appends the minimum temperature line
            svg.append("g")
                .attr("class", "minimum")
                .append("g")
                .attr("class", "year")
                .append("path")
                      .attr("class", "line")
                      .attr("d", linemin(data))
                      .attr("stroke", "blue")
                      .attr("stroke-width", 2)
                      .attr("fill", "none")

            // appends the average temperature line
            svg.append("g")
                .attr("class", "average")
                .append("g")
                    .attr("class", "year")
                    .append("path")
                        .attr("class", "line")
                        .attr("d", lineaverage(data))
                        .attr("stroke", "orange")
                        .attr("stroke-width", 2)
                        .attr("fill", "none")

            // appends the maximum temperature line
            svg.append("g")
            .attr("class", "maximum")
            .append("g")
                .attr("class", "eeat")
                .append("path")
                    .attr("class", "line")
                    .attr("d", linemax(data))
                    .attr("stroke", "red")
                    .attr("stroke-width", 2)
                    .attr("fill", "none")

            // appends a rect for max value
            d3.select("svg").append("rect")
                .attr("id", "max")
                .attr("class", "st1")
                .attr("x", width)
                .attr("y", 0)
                .attr('width', 15)
                .attr('height', 15)
                .style('fill', 'red');

            // appends text
            d3.select('svg').append('text')
                .attr('id', 'maxtemp')
                .attr('x', width - 150)
                .attr('y', 12)
                .text('maximum temperature');

            // appends a rect for average value
            d3.select("svg").append("rect")
                .attr("id", "avr")
                .attr("class", "st2")
                .attr("x", width)
                .attr("y", 20)
                .attr('width', 15)
                .attr('height', 15)
                .style('fill', 'orange');

            // appends text
            d3.select('svg').append('text')
                .attr('id', 'avrtemp')
                .attr('x', width - 135)
                .attr('y', 32)
                .text('average temperature');

            // appends a rect for min value
            d3.select("svg").append("rect")
                .attr("id", "min")
                .attr("class", "st3")
                .attr("x", width)
                .attr("y", 40)
                .attr('width', 15)
                .attr('height', 15)
                .style('fill', 'blue');

            // appends text
            d3.select('svg').append('text')
                .attr('id', 'mintemp')
                .attr('x', width - 147)
                .attr('y', 52)
                .text('minimum temperature');

            // mouseover focus
            var focus = svg.append("g")
                .style("display", "none");

            // append the circle at the intersection
            focus.append("circle")
                .attr("class", "y")
                .style("fill", "none")
                .style("stroke", "blue")
                .attr("r", 4);

            // append the rectangle to capture mouse
            svg.append("rect")
                .attr("width", width)
                .attr("height", height)
                .style("fill", "none")
                .style("pointer-events", "all")
                .on("mouseover", function() { focus.style("display", null); })
                .on("mouseout", function() { focus.style("display", "none"); })
                .on("mousemove", mousemove);

            // function to display data on move
            function mousemove() {
                var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;

                focus.select("circle.y")
                    .attr("transform",
                    "translate(" + x(formatDate.parse(d.date)) + "," +
                                   y(d.average) + ")");
            }
        }
    });
}

function Load2014Data(){
    // removes the svg so a fresh one is created
    d3.select("svg").remove();

    var margin = {top: 20, right: 30, bottom: 40, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // creating and appending an SVG to the <body> of the index page
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // x, y axis
    var x = d3.time.scale().range([0, width]),
        y = d3.scale.linear().range([height, 0]);

    // scales x axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    // scales y axis
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // time parsing
    var formatDate = d3.time.format("%Y%m%d");

    // line variable for the minimum temperature
    var linemin = d3.svg.line()
        .x(function(d) {
            return x(formatDate.parse(d.date));
        })
            .y(function(d) {
        return y(d.minimum / 10);
    });

    // line variable for the average temperature
    var lineaverage = d3.svg.line()
        .x(function(d) {
            return x(formatDate.parse(d.date));
        })
        .y(function(d) {
            return y(d.average / 10);
    });

    // line variable for the maximum temperature
    var linemax = d3.svg.line()
        .x(function(d) {
            return x(formatDate.parse(d.date));
        })
        .y(function(d) {
            return y(d.maximum/ 10);
    });

    var bisectDate = d3.bisector(function(d) { return formatDate.parse(d.date); }).left;

    // data parsing and loading
    d3.json("./Data/KNMI2014.json", function(error, data) {
        if (error) {
            console.error("Oh my, something went wrong: " + error);
        }
        else {
            // sets x and y domains
            x.domain(d3.extent(data, function(d) { return formatDate.parse(d.date); }));
            y.domain(d3.extent([
            d3.min(data, function(d) {return Math.min(d.minimum / 10 )} ),
            d3.max(data, function(d) {return Math.min(d.maximum / 10 )} )
            ]));

            // appends the x axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                    .attr("y", 37)
                    .attr("x", width)
                    .style("text-anchor", "end")
                    .text("Months of the year");

            // appends the y axis
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -35)
                    .attr("x", -(height / 4) - 30)
                    .style("text-anchor", "end")
                    .text("Temperature in celcius");

            // appends the minimum temperature line
            svg.append("g")
                .attr("class", "minimum")
                    .append("g")
                    .attr("class", "year")
                    .append("path")
                        .attr("class", "line")
                        .attr("d", linemin(data))
                        .attr("stroke", "blue")
                        .attr("stroke-width", 2)
                        .attr("fill", "none")

            // appends the average temperature line
            svg.append("g")
                .attr("class", "average")
                .append("g")
                    .attr("class", "year")
                    .append("path")
                        .attr("class", "line")
                        .attr("d", lineaverage(data))
                        .attr("stroke", "orange")
                        .attr("stroke-width", 2)
                        .attr("fill", "none")

            // appends the maximum temperature line
            svg.append("g")
                .attr("class", "maximum")
                .append("g")
                    .attr("class", "eeat")
                    .append("path")
                        .attr("class", "line")
                        .attr("d", linemax(data))
                        .attr("stroke", "red")
                        .attr("stroke-width", 2)
                        .attr("fill", "none")

            // appends a rect for max value
            d3.select("svg").append("rect")
                .attr("id", "max")
                .attr("class", "st1")
                .attr("x", width)
                .attr("y", 0)
                .attr('width', 15)
                .attr('height', 15)
                .style('fill', 'red');

            // appends text
            d3.select('svg').append('text')
                .attr('id', 'maxtemp')
                .attr('x', width - 150)
                .attr('y', 12)
                .text('maximum temperature');

            // appends a rect for average value
            d3.select("svg").append("rect")
                .attr("id", "avr")
                .attr("class", "st2")
                .attr("x", width)
                .attr("y", 20)
                .attr('width', 15)
                .attr('height', 15)
                .style('fill', 'orange');

            // appends text
            d3.select('svg').append('text')
                .attr('id', 'avrtemp')
                .attr('x', width - 135)
                .attr('y', 32)
                .text('average temperature');

            // appends a rect for min value
            d3.select("svg").append("rect")
                .attr("id", "min")
                .attr("class", "st3")
                .attr("x", width)
                .attr("y", 40)
                .attr('width', 15)
                .attr('height', 15)
                .style('fill', 'blue');

            // appends text
            d3.select('svg').append('text')
                .attr('id', 'mintemp')
                .attr('x', width - 147)
                .attr('y', 52)
                .text('minimum temperature');

            // something for the mouseover to focus on
            var focus = svg.append("g")
                .style("display", "none");

            // append the circle at the intersection
            focus.append("circle")
                .attr("class", "y")
                .style("fill", "none")
                .style("stroke", "blue")
                .attr("r", 4);

            // append the rectangle to capture mouse
            svg.append("rect")
                .attr("width", width)
                .attr("height", height)
                .style("fill", "none")
                .style("pointer-events", "all")
                .on("mouseover", function() { focus.style("display", null); })
                .on("mouseout", function() { focus.style("display", "none"); })
                .on("mousemove", mousemove);

            // function to display data on move
            function mousemove() {
                var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;

                focus.select("circle.y")
                .attr("transform",
                "translate(" + x(formatDate.parse(d.date)) + "," +
                         y(d.average) + ")");
            }
        }
    });
}

function Load2015Data(){
    // removes the svg so a fresh one is created
    d3.select("svg").remove();

    var margin = {top: 20, right: 30, bottom: 40, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // creating and appending an SVG to the <body> of the index page
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // x, y axis
    var x = d3.time.scale().range([0, width]),
        y = d3.scale.linear().range([height, 0]);

    // scales x axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    // scales y axis
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // time parsing
    var formatDate = d3.time.format("%Y%m%d");

    // line variable for the minimum temperature
    var linemin = d3.svg.line()
        .x(function(d) {
            return x(formatDate.parse(d.date));
        })
        .y(function(d) {
            return y(d.minimum / 10);
        });

    // line variable for the average temperature
    var lineaverage = d3.svg.line()
        .x(function(d) {
            return x(formatDate.parse(d.date));
        })
        .y(function(d) {
            return y(d.average / 10);
        });

    // line variable for the maximum temperature
    var linemax = d3.svg.line()
        .x(function(d) {
            return x(formatDate.parse(d.date));
        })
        .y(function(d) {
            return y(d.maximum/ 10);
    });

    var bisectDate = d3.bisector(function(d) { return formatDate.parse(d.date); }).left;

    // data parsing and loading
    d3.json("./Data/KNMI2015.json", function(error, data) {
        if (error) {
            console.error("Oh my, something went wrong: " + error);
        }
        else {
            // sets x and y domains
            x.domain(d3.extent(data, function(d) { return formatDate.parse(d.date); }));
            y.domain(d3.extent([
            d3.min(data, function(d) {return Math.min(d.minimum / 10 )} ),
            d3.max(data, function(d) {return Math.min(d.maximum / 10 )} )
            ]));

            // appends the x axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                    .attr("y", 37)
                    .attr("x", width)
                    .style("text-anchor", "end")
                    .text("Months of the year");

            // appends the y axis
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -35)
                    .attr("x", -(height / 4) - 30)
                    .style("text-anchor", "end")
                    .text("Temperature in celcius");

            // appends the minimum temperature line
            svg.append("g")
                .attr("class", "minimum")
                .append("g")
                .attr("class", "year")
                .append("path")
                      .attr("class", "line")
                      .attr("d", linemin(data))
                      .attr("stroke", "blue")
                      .attr("stroke-width", 2)
                      .attr("fill", "none")

            // appends the average temperature line
            svg.append("g")
                .attr("class", "average")
                .append("g")
                    .attr("class", "year")
                    .append("path")
                        .attr("class", "line")
                        .attr("d", lineaverage(data))
                        .attr("stroke", "orange")
                        .attr("stroke-width", 2)
                        .attr("fill", "none")

            // appends the maximum temperature line
            svg.append("g")
            .attr("class", "maximum")
            .append("g")
                .attr("class", "eeat")
                .append("path")
                    .attr("class", "line")
                    .attr("d", linemax(data))
                    .attr("stroke", "red")
                    .attr("stroke-width", 2)
                    .attr("fill", "none")

            // appends a rect for max value
            d3.select("svg").append("rect")
                .attr("id", "max")
                .attr("class", "st1")
                .attr("x", width)
                .attr("y", 0)
                .attr('width', 15)
                .attr('height', 15)
                .style('fill', 'red');

            // appends text
            d3.select('svg').append('text')
                .attr('id', 'maxtemp')
                .attr('x', width - 150)
                .attr('y', 12)
                .text('maximum temperature');

            // appends a rect for average value
            d3.select("svg").append("rect")
                .attr("id", "avr")
                .attr("class", "st2")
                .attr("x", width)
                .attr("y", 20)
                .attr('width', 15)
                .attr('height', 15)
                .style('fill', 'orange');

            // appends text
            d3.select('svg').append('text')
                .attr('id', 'avrtemp')
                .attr('x', width - 135)
                .attr('y', 32)
                .text('average temperature');

            // appends a rect for min value
            d3.select("svg").append("rect")
                .attr("id", "min")
                .attr("class", "st3")
                .attr("x", width)
                .attr("y", 40)
                .attr('width', 15)
                .attr('height', 15)
                .style('fill', 'blue');

            // appends text
            d3.select('svg').append('text')
                .attr('id', 'mintemp')
                .attr('x', width - 147)
                .attr('y', 52)
                .text('minimum temperature');

            // mouseover focus
            var focus = svg.append("g")
                .style("display", "none");

            // append the circle at the intersection
            focus.append("circle")
                .attr("class", "y")
                .style("fill", "none")
                .style("stroke", "blue")
                .attr("r", 4);

            // append the rectangle to capture mouse
            svg.append("rect")
                .attr("width", width)
                .attr("height", height)
                .style("fill", "none")
                .style("pointer-events", "all")
                .on("mouseover", function() { focus.style("display", null); })
                .on("mouseout", function() { focus.style("display", "none"); })
                .on("mousemove", mousemove);

            // function to display data on move
            function mousemove() {
                var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;

                focus.select("circle.y")
                    .attr("transform",
                    "translate(" + x(formatDate.parse(d.date)) + "," +
                                   y(d.average) + ")");
            }
        }
    });
}


function Load2016Data(){
    // removes the svg so a fresh one is created
    d3.select("svg").remove();

    var margin = {top: 20, right: 30, bottom: 40, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // creating and appending an SVG to the <body> of the index page
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // x, y axis
    var x = d3.time.scale().range([0, width]),
        y = d3.scale.linear().range([height, 0]);

    // scales x axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    // scales y axis
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // time parsing
    var formatDate = d3.time.format("%Y%m%d");

    // line variable for the minimum temperature
    var linemin = d3.svg.line()
        .x(function(d) {
            return x(formatDate.parse(d.date));
        })
        .y(function(d) {
            return y(d.minimum / 10);
        });

    // line variable for the average temperature
    var lineaverage = d3.svg.line()
        .x(function(d) {
            return x(formatDate.parse(d.date));
        })
        .y(function(d) {
            return y(d.average / 10);
        });

    // line variable for the maximum temperature
    var linemax = d3.svg.line()
        .x(function(d) {
            return x(formatDate.parse(d.date));
        })
        .y(function(d) {
            return y(d.maximum/ 10);
    });

    var bisectDate = d3.bisector(function(d) { return formatDate.parse(d.date); }).left;

    // data parsing and loading
    d3.json("./Data/KNMI2016.json", function(error, data) {
        if (error) {
            console.error("Oh my, something went wrong: " + error);
        }
        else {
            // sets x and y domains
            x.domain(d3.extent(data, function(d) { return formatDate.parse(d.date); }));
            y.domain(d3.extent([
            d3.min(data, function(d) {return Math.min(d.minimum / 10 )} ),
            d3.max(data, function(d) {return Math.min(d.maximum / 10 )} )
            ]));

            // appends the x axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                    .attr("y", 37)
                    .attr("x", width)
                    .style("text-anchor", "end")
                    .text("Months of the year");

            // appends the y axis
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -35)
                    .attr("x", -(height / 4) - 30)
                    .style("text-anchor", "end")
                    .text("Temperature in celcius");

            // appends the minimum temperature line
            svg.append("g")
                .attr("class", "minimum")
                .append("g")
                .attr("class", "year")
                .append("path")
                      .attr("class", "line")
                      .attr("d", linemin(data))
                      .attr("stroke", "blue")
                      .attr("stroke-width", 2)
                      .attr("fill", "none")

            // appends the average temperature line
            svg.append("g")
                .attr("class", "average")
                .append("g")
                    .attr("class", "year")
                    .append("path")
                        .attr("class", "line")
                        .attr("d", lineaverage(data))
                        .attr("stroke", "orange")
                        .attr("stroke-width", 2)
                        .attr("fill", "none")

            // appends the maximum temperature line
            svg.append("g")
            .attr("class", "maximum")
            .append("g")
                .attr("class", "eeat")
                .append("path")
                    .attr("class", "line")
                    .attr("d", linemax(data))
                    .attr("stroke", "red")
                    .attr("stroke-width", 2)
                    .attr("fill", "none")

            // appends a rect for max value
            d3.select("svg").append("rect")
                .attr("id", "max")
                .attr("class", "st1")
                .attr("x", width)
                .attr("y", 0)
                .attr('width', 15)
                .attr('height', 15)
                .style('fill', 'red');

            // appends text
            d3.select('svg').append('text')
                .attr('id', 'maxtemp')
                .attr('x', width - 150)
                .attr('y', 12)
                .text('maximum temperature');

            // appends a rect for average value
            d3.select("svg").append("rect")
                .attr("id", "avr")
                .attr("class", "st2")
                .attr("x", width)
                .attr("y", 20)
                .attr('width', 15)
                .attr('height', 15)
                .style('fill', 'orange');

            // appends text
            d3.select('svg').append('text')
                .attr('id', 'avrtemp')
                .attr('x', width - 135)
                .attr('y', 32)
                .text('average temperature');

            // appends a rect for min value
            d3.select("svg").append("rect")
                .attr("id", "min")
                .attr("class", "st3")
                .attr("x", width)
                .attr("y", 40)
                .attr('width', 15)
                .attr('height', 15)
                .style('fill', 'blue');

            // appends text
            d3.select('svg').append('text')
                .attr('id', 'mintemp')
                .attr('x', width - 147)
                .attr('y', 52)
                .text('minimum temperature');

            // mouseover focus
            var focus = svg.append("g")
                .style("display", "none");

            // append the circle at the intersection
            focus.append("circle")
                .attr("class", "y")
                .style("fill", "none")
                .style("stroke", "blue")
                .attr("r", 4);

            // append the rectangle to capture mouse
            svg.append("rect")
                .attr("width", width)
                .attr("height", height)
                .style("fill", "none")
                .style("pointer-events", "all")
                .on("mouseover", function() { focus.style("display", null); })
                .on("mouseout", function() { focus.style("display", "none"); })
                .on("mousemove", mousemove);

            // function to display data on move
            function mousemove() {
                var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;

                focus.select("circle.y")
                    .attr("transform",
                    "translate(" + x(formatDate.parse(d.date)) + "," +
                                   y(d.average) + ")");
            }
        }
    });
}
