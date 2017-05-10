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
