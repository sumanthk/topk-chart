
var dataFile = "data1.tsv";

setInterval(function () {
// (function () {
// d3.select("body").html('');
d3.select(".line-chart").html('');
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select(".line-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// ***********************************************************************************************************
// Adding panel buttons on the left
  var icons = ["home", "github-square"];
  
  var hoveredStyle = { "background-color": "lightgray" };
  var clickedStyle = { "background-color": "#7777BB" };

  // This style will be applied per icon
  var defaultStyle = {
      padding: "0px 5px 0px 5px",
      margin: "5px",
      "border-radius": "16px",
      "background-color": "white",
      "stroke": "none",
      "cursor": "pointer",
  };

  var panelbtns = d3.select(".leftpane").selectAll("i").data(icons)
      .enter().append("i")
      .attr("class", function(d){ 
        return "icon fa fa-3x fa-" + d; // This is where the magic happens !!!! see 'd' there?
      }) 
      .style(defaultStyle)
      .on("click",function(d) {
         d3.select(this).style(clickedStyle);
      })
      .on("mouseover", function(){
        d3.select(this).style(hoveredStyle);
      });

// ***********************************************************************************************************


    dataFile = (dataFile === "data.tsv") ? "data1.tsv" : "data.tsv";
    d3.tsv(dataFile, type, function(error, data) {
      if (error) throw error;

      x.domain(data.map(function(d) { return d.item; }));
      y.domain([0, d3.max(data, function(d) { return d.count; })]);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .append("text")
          .attr("x", 750)
          .attr("y", 30)
          .attr("dx", ".71em")
          .style("text-anchor", "end")
          .text("Item Number");

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Count");

      svg.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.item); })
          .attr("width", x.rangeBand())
          // .attr("y", function(d) { return y(d.count); })
          // .attr("height", function(d) { return height - y(d.count); })
          .attr("y", height)
          .attr("height", 0)
          .transition()
          .delay(function (d, i) { return i*100; })
          .attr("y", function (d, i) { return y(d.count); })
          .attr("height", function (d) { return height - y(d.count); });  
    });

    function type(d) {
      d.count = +d.count;
      return d;
    }
 }, 3000);
// })();