// Troy C. Breijaert
// studentnummer: 11587407
// code source: http://bl.ocks.org/weiglemc/6185069

function lambda(){
    // canvas margins
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // scaling for x
    var x = d3.scale.linear()
        .range([0, width - 80]);

    // scaling for y
    var y = d3.scale.linear()
        .range([height - 20, 0]);

    // colors for the dots
    var color = d3.scale.category10();

    // x-axis setup
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    // y-axis setup
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // creating and appending an SVG to the <body> of the index page
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // creating a tooltip display for dots
    var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(function(d){
            return "<span> Country: " + String(d.CountryName) + "</span>";
        })

    // colorvalue
    var cValue = function(d) { return String(d.Continent);},
        color = d3.scale.category10();


    svg.call(tip);

    // load data
    d3.csv("../static/data.csv", function(error, data) {
        if (error) throw error;

        data.forEach(function(d) {
          d.LifeExpectancy = +d.LifeExpectancy;
          d.GDPpercapita = +d.GDPpercapita;
        });
        // x and y domain sizes
        x.domain(d3.extent(data, function(d) { return d.GDPpercapita; })).nice();
        y.domain(d3.extent(data, function(d) { return d.LifeExpectancy; })).nice();

        var rscale = d3.scale.sqrt()
            .domain([0, 1e6])
            .range([0, 30]);

        // appends an X-axis to the SVG with label
        svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + (height - 20)  + ")")
           .call(xAxis)
         .append("text")
           .attr("class", "label")
           .attr("x", width / 2)
           .attr("y",35)
           .style("text-anchor", "end")
           .text("GDP per capita");

        // appends an y-axis to the SVG with label
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", -30)
            .attr("x", -(height / 4))
            .style("text-anchor", "end")
            .text("Life Expectancy");

        // appends dots to the axes with colours based on continents
        svg.selectAll(".dot")
            .data(data)
        .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d.GDPpercapita); })
            .attr("cy", function(d) { return y(d.LifeExpectancy); })
            .style("fill", function(d) { return color(cValue(d));})
            .attr("r", function(d) { return rscale(d.Population / 2000)})
            .on("mouseover", function(d){
                tip.show(d);
            })
            .on("mouseout", function(d){
                tip.hide(d);
            });

        // draw legend
        var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i){ return "translate(0," + i * 20 + ")";});

        // draws the legends coloured rectangles
        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        // draws legend text
        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d;})
    });
  }
