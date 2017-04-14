// student: Troy C. Breijaert
// nummer: 11587407
// javascript assignment week 2

var day = 86400000; // ms in a day
var years = (46 * 365) // days since gettime started
var leapyears = 11 // 11 leap years between 1970 and 2016
var domain = []; // global array for createTransform
var range = [0, 695]; // sets maximum ranges for canvas drawing
var xpath = []; // creates global array for x values
var ypath = []; // creates global array for y values
var y_max = 0; // global varbiable for x max value
var x_max = 0; // global variable for y max value
var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'oktober', 'november', 'december', '2017'] // global array for months


function convert(){
    // gets the raw data from the element
    var rawdata = (document.getElementById("rawdata")).innerHTML;
    // creates a temporary variable and splits based on newline
    var temp = rawdata.split(/(?:\r\n|\r|\n)/);
    // iterates over the temporary variable, splits them based on a comma
    for (var i = 1; i < temp.length - 1 ; i++){
        // split based on comma
        var temp2 = (temp[i].split(","));
        // parses the temperature as an in
        temperature = parseInt(temp2[1]);
        // trims the time string as there are quite a few white spaces
        datetrim = String(temp2[0]).trim();
        // formats the date from yyyymmdd to yyyy-mm-dd and get a jabathehuttscript date
        var formdate = datetrim.slice(0, 4) + "-" + datetrim.slice(4, 6) + "-" + datetrim.slice(6, 8);
        var date = new Date(formdate);
        // pushes the data in two seperate arrays, one for temperatures and one for dates
        ypath.push(temperature);
        xpath.push((date.getTime() / day) - (years + leapyears))
    };
    // pushes the minimum and maximum date span into domain array for createTransform
    domain = [Math.min.apply(Math, xpath), Math.max.apply(Math, xpath)];
    // sets x and y max
    x_max = Math.max.apply(Math, xpath)
    y_max = Math.max.apply(Math, ypath)
}


function drawcanvas(){
    // callfunction to convert from strings to x,y variables
    convert();
    // callfunction to draw axes
    drawaxes();
    var canvas = document.getElementById("mycanvas");
    if(canvas.getContext){
        var ctx = canvas.getContext("2d");
        ctx.font = '22px sans-serif';
        ctx.strokeText("Maximum temperature in De Bilt (NL)", 50, 40);
        ctx.beginPath();
        ctx.lineWidth = 2;
        // for loop iterating over dates and draws lines to each
        // new date/temperature value
        for(var i = 0; i < xpath.length-1; i++){
            if (i == 0){
               x =  (createTransform(domain, range)(xpath[i]) + 50)
               y = 670 - (createTransform(domain, range)(ypath[i]))
               ctx.moveTo(x, y);
            }
            else {
                x = createTransform(domain, range)(xpath[i]) + 50
                y = 670-(createTransform(domain, range)(ypath[i]))
                ctx.lineTo(x, y);
                ctx.stroke();
            };
        }
        // cloes the path
        ctx.closePath();
    }
}


function drawaxes(){
    var canvas = document.getElementById("mycanvas");
    var ctx = canvas.getContext("2d");
    ctx.lineWidth = 2;

    // draw y-axis
    ctx.beginPath();
    ctx.moveTo(40, 10)
    ctx.lineTo(40, 700)
    ctx.stroke();
    ctx.closePath();

    // draw x-axis
    ctx.beginPath();
    ctx.moveTo(50, 700)
    ctx.lineTo(750,700)
    ctx.stroke();
    ctx.closePath();

    // draw x-values
    x = 0;
    while (x <= x_max - 1) {
        j = x * ((createTransform(domain, range)(x_max))/12);
        ctx.beginPath();
        ctx.moveTo(j + 50, 700);
        ctx.lineTo(j + 50, 720);
        ctx.stroke();
        ctx.strokeText(months[x], j + 30, 730)
        ctx.closePath();
        x++;
    };

    // draw y-values
    y = 0;
    i = -1;
    while (y <= y_max - 1) {
        j = 700-(((690/340)*20)*y)
        ctx.beginPath();
        ctx.moveTo(20, j);
        ctx.lineTo(40, j);
        ctx.stroke();
        ctx.closePath();
        ctx.strokeText(i, 5, j+3)
        y++;
        i+=2
    };
}


function createTransform(domain, range){
	// domain is a two-element array of the data bounds [domain_min, domain_max]
	// range is a two-element array of the screen bounds [range_min, range_max]
	// this gives you two equations to solve:
	// range_min = alpha * domain_min + beta
	// range_max = alpha * domain_max + beta
 		// a solution would be:

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
  };
}
