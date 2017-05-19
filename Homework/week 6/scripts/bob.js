function lambda() {
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
             d3.csv("data/worlddata.csv", function (error, data) {
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
                });
                console.log(data[0])
                var svg = d3.select("#stacked"),
                    margin = {top: 20, right: 180, bottom: 30, left: 40},
                    width = +svg.attr("width") - margin.left - margin.right,
                    height = +svg.attr("height") - margin.top - margin.bottom,
                    g = svg.append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var x = d3.scale.ordinal()
                    .rangeRoundBands([0, width])

                var y = d3.scale.linear()
                    .rangeRound([height, 0]);

                var z = d3.scale.category10();

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")

            });
         })
         .await(ready)

    function ready(error){
        console.log("bob")//error ? "error: " + error.responseText)
    }
}
function render(country) {
    var svg = d3.select("#stacked"),
        margin = {top: 20, right: 180, bottom: 30, left: 40},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   svg.selectAll("rect")
           .data(country.values)
           .enter()
           .append("rect")
           .attr("x", function(d, i) {
               return i * (width / country.values.length);
           })
           .attr("y", function(d) {
               return parseInt(height - d);
           })
           .attr("width", (width / country.values.length))
           .attr("height", function(d) {
               return parseInt(d);
           })
           .attr("fill", function(d, i) {
               var rgbColor = "rgb(" + Math.round((Math.random()*255)) +
                       ", " + Math.round((Math.random()*255)) + ", "  +
                       Math.round((Math.random()*255)) + ")";
               return rgbColor;
           });
           svg.append("text").text(country.name).attr({"x": 0, "y": 30});
       }

       data.forEach(function(r) {
           countrydata.push({
               name: r["Country Name"],
               values:[r["Access to electricity (% of population)"],
                       r["Access to electricity, rural (% of rural population)"],
                       r["Access to electricity, urban (% of urban population)"],
                       r["Improved sanitation facilities (% of population with access)"],
                       r["Improved water source (% of population with access)"],
                       r["Improved water source, rural (% of rural population with access)"],
                       r["Improved water source, urban (% of urban population with access)"]]
           });
           countrydata.forEach(function(b){
               render(b);
           });
