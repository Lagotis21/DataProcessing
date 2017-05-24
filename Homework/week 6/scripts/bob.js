// Troy C. Breijaert
// studentnummer: 11587407
// Some country names differ slightly atm causing it to bug out sometimes

Globalname = "World"

function drawcharts() {
  Worldmap()
  DrawBarchart()

  function DrawBarchart() {
    // determins margins of the field
    var margin = {top: 40, right: 50, bottom: 100, left: 40},
        width = (document.getElementById('container').offsetWidth / 2) - margin.left - margin.right,
        height = (width / 1.3) - margin.top - margin.bottom;

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

    // gives chart its attributes
    var chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // attributes for a toolsip and what to display
    var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(function(d){
            return "<span>" + Globalname + ": " + round(d["" + Globalname.trim("") + ""]) +"</span>";
        })

    chart.call(tip)

    // gemerate amd display barchart data
    d3.csv("data/worlddata.csv", function(error, data) {
      if (error) throw error;
      // parses from string to float
      data.forEach(function(d) {
        d["" + Globalname.trim("") + ""] = +d["" + Globalname.trim("") + ""]
      });

      // x/y domains
      x.domain(data.map(function(d) { return d["Attribute"]; }));
      y.domain([0, d3.max(data, function(d) { return d["" + Globalname.trim("") + ""]; })]);

      // appends x-axis
      chart.append("g")
          .attr("class", "xaxis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .selectAll("text")
          .call(wrap, x.rangeBand())


       // appends y axis
      chart.append("g")
          .attr("class", "yaxis")
          .call(yAxis);

       // appends a y-axis title
      chart.append("text")
           .attr("transform", "rotate(-90)")
           .attr("x", -height / 2)
           .attr("y", -28)
           .style("text-anchor", "middle")
           .text("Percentage of the population");

       // creates the bars
      chart.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d["Attribute"]); })
          .attr("y", function(d) { return y(d["" + Globalname.trim("") + ""]); })
          .attr("height", function(d) { return height - y(d["" + Globalname.trim("") + ""]); })
          .attr("width", x.rangeBand())
          .style("fill", "DeepSkyBlue")
          .on('mouseover', function(d){
              tip.show(d);
              d3.select(this).attr("r", 10).style("fill", "orange");
          })
          .on("mouseout", function(d){
              tip.hide(d);
              d3.select(this).attr("r", 10).style("fill", "DeepSkyBlue");
          });
        UpdateBarchart();
   });
   function UpdateBarchart(){
     // gemerate amd display barchart data
     d3.csv("data/worlddata.csv", function(error, data) {
       if (error) throw error;
       // parses as from string to float
       data.forEach(function(d) {
         d["" + Globalname.trim("") + ""] = +d["" + Globalname.trim("") + ""]
       });

       // x and y domains
       x.domain(data.map(function(d) { return d["Attribute"]; }));
       y.domain([0, d3.max(data, function(d) { return d[Globalname]; })]);

       // selects the chart
       var svg = d3.select(".chart").transition();

       // rescales x-axis
       svg.select(".x.axis")
           .duration(750)
           .attr("transform", "translate(0," + height + ")")
           .call(xAxis)
           .selectAll("text")
           .attr("y", 0)
           .attr("x", 9)
           .attr("dy", ".35em")
           .attr("transform", "rotate(90)")
           .style("text-anchor", "start");

       // rescales y
       svg.select(".y.axis")
           .duration(750)
           .call(yAxis);

       // overwrites and creates a new bar
       svg.selectAll(".bar")
         .attr("class", "bar")
         .attr("x", function(d) { return x(d["Attribute"]); })
         .attr("y", function(d) { return y(d["" + Globalname.trim("") + ""]); })
         .attr("height", function(d) { return height - y(d["" + Globalname.trim("") + ""]); })
         .attr("width", x.rangeBand());
       })
   }
   console.log("hello! i work just fine, javascript is being an ass")
 }

 function Worldmap() {
      d3.select(window).on("resize", throttle);

      var zoom = d3.behavior.zoom()
         .scaleExtent([1, 9])
         .on("zoom", move);

     function move() {
        var t = d3.event.translate;
        var s = d3.event.scale;
        zscale = s;
        var h = height/4;

        t[0] = Math.min(
           (width/height)  * (s - 1),
           Math.max( width * (1 - s), t[0] )
        );

        t[1] = Math.min(
           h * (s - 1) + h * s,
           Math.max(height  * (1 - s) - h * s, t[1])
        );

        zoom.translate(t);
        g.attr("transform", "translate(" + t + ")scale(" + s + ")");

        //adjust the country hover stroke width based on zoom level
        d3.selectAll(".country").style("stroke-width", 1.5 / s);

     }

      var width = (document.getElementById('container').offsetWidth) / 2;
      var height = width / 2;

      var topo,projection,path,svg,g;

      var graticule = d3.geo.graticule();

      var tooltip = d3.select("#container").append("div").attr("class", "tooltip hidden");

      setup(width,height);

      function setup(width,height){
        projection = d3.geo.mercator()
        .translate([(width/2), (height/2)])
        .scale( width / 2 / Math.PI);

        path = d3.geo.path().projection(projection);

        svg = d3.select(".worldmap")//#container").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom)

        g = svg.append("g");
      }

      d3.json("data/world-topo-min.json", function(error, world) {

        var countries = topojson.feature(world, world.objects.countries).features;

        topo = countries;
        draw(topo);

        });

      function draw(topo) {

        svg.append("path")
          .datum(graticule)
          .attr("class", "graticule")
          .attr("d", path);


        g.append("path")
          .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
          .attr("class", "equator")
          .attr("d", path);


        var country = g.selectAll(".country").data(topo);

        country.enter().insert("path")
          .attr("class", "country")
          .attr("d", path)
          .attr("id", function(d,i) { return d.id; })
          .attr("title", function(d,i) { return d.properties.name; })
          .style("fill", function(d, i) { return d.properties.color; });

        //offsets for tooltips
        var offsetL = document.getElementById('container').offsetLeft+20;
        var offsetT = document.getElementById('container').offsetTop+10;

        //tooltips
        country
          .on("mousemove", function(d,i) {

          var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
          tooltip.classed("hidden", false)
            .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
            .html(d.properties.name);
        })
        .on("click", function(d){
          Globalname = d.properties.name;
          drawbarchart(UpdateBarchart())
        })
        .on("mouseout",  function(d,i) {
          tooltip.classed("hidden", true);
        });

      }


      function redraw() {
         width = document.getElementById('container').offsetWidth;
         height = width / 2;
         d3.select('svg').remove();
         setup(width,height);
         draw(topo);
      }

      var throttleTimer;
      function throttle() {
        window.clearTimeout(throttleTimer);
        throttleTimer = window.setTimeout(function() {
        redraw();
        }, 20);
      }
  }
}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}
