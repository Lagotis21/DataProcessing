// Troy C. Breijaert
// studentnummer: 11587407
// code source: http://bl.ocks.org/weiglemc/6185069
// code source: http://bl.ocks.org/peterssonjonas/4a0e7cb8d23231243e0e

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function lambda(){
    // canvas margins
    var margin = {top: 20, right: 20, bottom: 40, left: 40},
        outerWidth = 960,
        outerHeight = 500,
        width = outerWidth - margin.left - margin.right,
        height = outerHeight - margin.top - margin.bottom;

    // makes x scalable
    var x = d3.scale.linear()
        .range([0, width]).nice();

    // makes y scalable
    var y = d3.scale.linear()
        .range([height, 0]).nice();

    // creating a tooltip display for dots
    var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(function(d){
            return "<span> Country: " + String(d.CountryName) +
            "<br>" + "Population: " + d.Population +
            "<br>" + "Life expectancy: " + round(d.LifeExpectancy, 1) +
            "<br>" + "GDP per capita: " + round(d.GDPpercapita, 1) + " USD" + "</span>";
        })

    // colorvalue
    var cValue = function(d) { return String(d.Continent);},
        color = d3.scale.category10();

    // load data
    d3.csv("./static/data.csv", function(error, data) {
        if (error) throw error;

        data.forEach(function(d) {
          d.LifeExpectancy = +d.LifeExpectancy;
          d.GDPpercapita = +d.GDPpercapita;
        });

        // determining x max/min and ymax/min
        var xMax = d3.max(data, function(d) { return d.GDPpercapita}),
            xMin = d3.min(data, function(d) { return d.GDPpercapita}),
            xMin= xMin > 0 ? 0 : xMin,
            yMax = d3.max(data, function(d) { return d.LifeExpectancy}),
            yMin = d3.min(data, function(d) { return d.LifeExpectancy}),
            yMin = yMin > 0 ? 0 : yMin;

        // x and y domain sizes
        x.domain([xMin, xMax]);
        y.domain([yMin, yMax])

        // x-axis setup
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickSize(-height);

        // y-axis setup
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickSize(-width);

        // colors for the dots
        var color = d3.scale.category10();

        // radius scaling for the dots
        var rscale = d3.scale.sqrt()
            .domain([0, 1e6])
            .range([0, 30]);

        // zoom behavour
        var zoomBeh = d3.behavior.zoom()
            .x(x)
            .y(y)
            .scaleExtent([0, 960])
            .on("zoom", zoom);

        // appends an svg to <div scatter
        var svg = d3.select("#scatter")
            .append("svg")
              .attr("width", outerWidth)
              .attr("height", outerHeight)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
              .call(zoomBeh);

        svg.call(tip);
        // appends a rectangle
        svg.append("rect")
            .attr("width", width)
            .attr("height", height);

        // appends y axis
        svg.append("g")
            .classed("y axis", true)
            .call(yAxis)
          .append("text")
            .classed("label", true)
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left)
            .attr("dy", ".71em")
            .attr("x", -((height / 4) + 20))
            .style("text-anchor", "end")
            .text("Life expectancy")

        // appends x axis
        svg.append("g")
            .classed("x axis", true)
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
         .append("text")
            .classed("label", true)
            .attr("x", (width / 2) + 20)
            .attr("y", margin.bottom - 10)
            .style("text-anchor", "end")
            .text("GDP per capita");

        // makes objects variables
        var objects = svg.append("svg")
            .classed("objects", true)
            .attr("width", width)
            .attr("height", height);

        // hocuspocus i found online at http://bl.ocks.org/peterssonjonas/4a0e7cb8d23231243e0e
        objects.append("svg:line")
            .classed("axisLine hAxisLine", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", width)
            .attr("y2", 0)
            .attr("transform", "translate(0," + height + ")");

        // more hocuspocus from http://bl.ocks.org/peterssonjonas/4a0e7cb8d23231243e0e, it works though
        objects.append("svg:line")
            .classed("axisLine vAxisLine", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", height);

        // adding dots and scales them
        objects.selectAll(".dot")
            .data(data)
          .enter().append("circle")
            .classed("dot", true)
            .attr("r", function(d) { return rscale(d.GDP / 2500000)})
            .attr("transform", transform)
            .style("fill", function(d) { return color(cValue(d));})
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide);

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

    // zoom function again from http://bl.ocks.org/peterssonjonas/4a0e7cb8d23231243e0e
    function zoom() {
      svg.select(".x.axis").call(xAxis);
      svg.select(".y.axis").call(yAxis);

      svg.selectAll(".dot")
          .attr("transform", transform);
    }
    // also from http://bl.ocks.org/peterssonjonas/4a0e7cb8d23231243e0e
    function transform(d) {
      return "translate(" + x(d.GDPpercapita) + "," + y(d.LifeExpectancy) + ")";
    }
    });
}
