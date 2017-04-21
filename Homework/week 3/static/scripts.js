// Troy C. Breijaert
// studentnummer: 11587407
// code source: https://bost.ocks.org/mike/bar/3/

function lambda(){
    // determins margins of the field
    var margin = {top: 20, right: 50, bottom: 30, left: 40},
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // smakes x-axis scaleable (remove .1 and you get one blob)
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    // makes y axis scaleable
    var y = d3.scale.linear()
        .range([height, 0]);

    // scales x axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    // scales y axis
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // attributes for a toolsip and what to display
    var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(function(d){
            return "<strong>Rain(mm):</strong> <span style='color:red'>" + d.value + "</span>";
        })

    // gives chart its attributes
    var chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    chart.call(tip);

    // gemerate amd display barchart data
    d3.json("KNMI.json", function(error, data) {
      x.domain(data.map(function(d) { return d.name; }));
      y.domain([0, d3.max(data, function(d) { return d.value; })]);

      chart.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      chart.append("g")
          .attr("class", "y axis")
          .call(yAxis);

    // appends a y-axis title
      chart.append("text")
           .attr("transform", "rotate(-90)")
           .attr("x", -height / 2)
           .attr("y", -28)
           .style("text-anchor", "middle")
           .text("Rainfall in mm");

    // adds a variety of attributes to the bars
    // x,y give positions, height width give height and width
    // mouseovers and mouseout add interactivity in the form of
    // mouseover data
      chart.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.name); })
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height - y(d.value); })
          .attr("width", x.rangeBand())
          .on('mouseover', function(d){
              tip.show(d);
              d3.select(this).attr("r", 10).style("fill", "orange");
          })
          .on("mouseout", function(d){
              tip.hide(d);
              d3.select(this).attr("r", 10).style("fill", "DeepSkyBlue");
          })

    });
    function type(d) {
      d.value = +d.value; // coerce to number
      return d;}
  }
