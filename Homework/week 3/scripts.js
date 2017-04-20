//var x = d3.scale.linear()
    //.domain([0, d3.max(data)])
  //  .range([0, 12])

//d3.select(".chart")
//  .selectAll("div")
//    .data(data)
//  .enter().append("div")
//    .style("width", function(d) { return d * 10 + "px"; })
//    .text(function(d) { return d; });

function lambda(){

var width = 420,
    barHeight = 20;

var x = d3.scale.linear()
    .range([0, width]);

d3.json("KNMI.JSON", function(error, data){
  //use data here[]
  x.domain([0, d3.max(data, function(d) {return d.value})]);
  chart.attr("height", barHeight * data.length);

  var chart = d3.select(".chart")
      .attr("width", width)
      .attr("height", barHeight * data.length);

  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

  bar.append("rect")
      .attr("width", x)
      .attr("height", barHeight - 1);

  bar.append("text")
      .attr("x", function(d) { return x(d) - 3; })
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) { return d; });

});
// tell people to fuck off here.
function type(d) {
  d.value = +d.value;
  return d;
};
}
