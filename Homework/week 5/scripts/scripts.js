// canvas margins
var margin = {top: 20, right: 20, bottom: 30, left: 40},
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

// time parsing
// var formatDate = (d3.time.format("%Y%m%d")).parse(d.date);

// line variables
//var line = d3.svg.line()
  //  .x(function(d) { return x(d.date); })
    //.y(function(d) { return y(d.temperature); });
    // gemerate amd display barchart data
d3.json("./Data/KNMI2014.json", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.minimum = +d.minimum;
    d.average = +d.average;
    d.maximum = +d.maximum;
  })
  console.log(data)
});
