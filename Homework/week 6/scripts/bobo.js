function lambda() {
    Country = Default
     queue()
        .defer(function worldmap() {
             d3.select(window).on("resize", throttle);

             var zoom = d3.behavior.zoom()
               .scaleExtent([1, 9])
               .on("zoom", move);


             var width = document.getElementById('container').offsetWidth;
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

               svg = d3.select("#container").append("svg")
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


             var throttleTimer;
             function throttle() {
               window.clearTimeout(throttleTimer);
               throttleTimer = window.setTimeout(function() {
               redraw();
               }, 20);
             }
         })

         .defer(function drawbarchart() {

            var svg = d3.select("svg"),
                margin = {top: 20, right: 20, bottom: 30, left: 40},
                width = +svg.attr("width") - margin.left - margin.right,
                height = +svg.attr("height") - margin.top - margin.bottom,
                g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var x0 = d3.scaleBand()
                .rangeRound([0, width])
                .paddingInner(0.1);

            var x1 = d3.scaleBand()
                .padding(0.05);

            var y = d3.scaleLinear()
                .rangeRound([height, 0]);

            var z = d3.scaleOrdinal()
                .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

            d3.csv("worlddate.csv", function(d, i, columns) {
              for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
              return d;
            }, function(error, data) {
              if (error) throw error;
              data.forEach(function(d) {
                  d["Population total"] = +d["Population total"];
                  d["Access to electricity (% of population)"] = +d["Access to electricity (% of population)"];
                  d["Access to electricity, rural (% of rural population)"] = +d["Access to electricity, rural (% of rural population)"];
                  d["Access to electricity, urban (% of urban population)"] = +d["Access to electricity, urban (% of urban population)"];
                  d["GDP (current US$)"] = +d["GDP (current US$)"];;
                  d["GDP per capita (current US$)"] = +d["GDP per capita (current US$)"];
                  d["Improved sanitation facilities (% of population with access)"] = +d["Improved sanitation facilities (% of population with access)"];
                  d["Improved water source (% of population with access)"] = +d["Improved water source (% of population with access)"];
                  d["Improved water source, rural (% of rural population with access)"] = +d["Improved water source, rural (% of rural population with access)"];
                  d["Improved water source, urban (% of urban population with access)"] = +d["Improved water source, urban (% of urban population with access)"];
                  d["maximum percentage"] = +d["maximum percentage"]
              })

              var keys = data.columns.slice(1);

              x0.domain(data.map(function(d) { return d.State; }));
              x1.domain(keys).rangeRound([0, x0.bandwidth()]);
              y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

              g.append("g")
                .selectAll("g")
                .data(data)
                .enter().append("g")
                  .attr("transform", function(d) { return "translate(" + x0(d.State) + ",0)"; })
                .selectAll("rect")
                .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
                .enter().append("rect")
                  .attr("x", function(d) { return x1(d.key); })
                  .attr("y", function(d) { return y(d.value); })
                  .attr("width", x1.bandwidth())
                  .attr("height", function(d) { return height - y(d.value); })
                  .attr("fill", function(d) { return z(d.key); });

              g.append("g")
                  .attr("class", "axis")
                  .attr("transform", "translate(0," + height + ")")
                  .call(d3.axisBottom(x0));

              g.append("g")
                  .attr("class", "axis")
                  .call(d3.axisLeft(y).ticks(null, "s"))
                .append("text")
                  .attr("x", 2)
                  .attr("y", y(y.ticks().pop()) + 0.5)
                  .attr("dy", "0.32em")
                  .attr("fill", "#000")
                  .attr("font-weight", "bold")
                  .attr("text-anchor", "start")
                  .text("Population");

              var legend = g.append("g")
                  .attr("font-family", "sans-serif")
                  .attr("font-size", 10)
                  .attr("text-anchor", "end")
                .selectAll("g")
                .data(keys.slice().reverse())
                .enter().append("g")
                  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

              legend.append("rect")
                  .attr("x", width - 19)
                  .attr("width", 19)
                  .attr("height", 19)
                  .attr("fill", z);

              legend.append("text")
                  .attr("x", width - 24)
                  .attr("y", 9.5)
                  .attr("dy", "0.32em")
                  .text(function(d) { return d; });
            });
        })

         .await(ready)

    function ready(error){
        console.log("Jello")
    }
}
