$('document').ready(function () {
    var dataFile = "data1.tsv";
    // ***********************************************************************************************************
    // Adding panel buttons on the left
    var icons = ["home", "tachometer"];

    var hoveredStyle = { "background-color": "lightgray" };
      // var clickedStyle = { "background-color": "#7777BB" };

      // This style will be applied per icon
    var defaultStyle = {
          padding: "0px 5px 0px 5px",
          margin: "5px",
//          "margin-top":"25px",
          "border-radius": "16px",
          "background-color": "white",
          "stroke": "none",
          "cursor": "pointer"
      };

    var panelbtns = d3.select(".leftpane").selectAll("i").data(icons)
          .enter().append("i")
          .attr("class", function(d){
            return "icon fa fa-3x fa-" + d; // This is where the magic happens !!!! see 'd' there?
          })
          .style(defaultStyle)
          // .on("click",function(d) {
          //    d3.select(this).style(clickedStyle);
          // })
          .on("mouseover", function(){
            d3.select(this).style(hoveredStyle);
          });

    // ***********************************************************************************************************


    $('.nav-stacked .checkbox').click(function (e) {
        $('.nav-stacked .checkbox').each(function (x, i) {
            $(i).removeClass('selected-li');
        });
        $('.nav-stacked .checked').each(function (x, i) {
            $(i).removeClass('selected');
        });
        $(this).addClass('selected-li');
        $(this).children().addClass('selected');
        $('.dashboard .zd-infopopup').addClass('hide');

        dataFile = this.parentElement.textContent.trim()+'.tsv';
    });


    $('i.fa-tachometer').click(function () {
        $('.dashboard .zd-infopopup').toggleClass('hide');
    });

      (function () {
//    setInterval(function () {
        d3.select(".line-chart").html('');
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], 0.1);
          
        var x2 = d3.scale.ordinal()
            .rangeRoundBands([0, width], 0.1);
  
        var y = d3.scale.linear()
            .range([height, 0]);

        var color = d3.scale.category10();

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

        d3.tsv("data1.tsv", function(error, data) {
          if (error) throw error;

          data.forEach(function(d) {
            d.errCnt = +d.errCnt;  
            d.item = +d.item;
            d.count = +d.count;
          });

          x.domain(data.map(function(d) { return d.item; }));
          x2.domain(data.map(function(d) { return d.item; }));
          y.domain(d3.extent(data, function(d) { return d.errCnt; })).nice();

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
            .append("text")
              .attr("class", "label")
              .attr("x", width)
              .attr("y", -6)
              .style("text-anchor", "end")
              .text("Item Number");

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("class", "label")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Count")

          svg.selectAll(".dot")
              .data(data)
              .enter().append("circle")
              .attr("class", "dot")
              .attr("r", 7.5)
//              .attr("r", function(d) { return Number(d.errCnt)/10; })
              .attr("cx", function(d) { return x(d.item); })
              .attr("cy", function(d) { return y(d.errCnt); })
              .style("fill", function(d) { return color(d.errCnt); });
//              .on("mouseover", animateFirstStep);
         /*
          svg.selectAll(".bar")
              .data(data)
              .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x2(d.item); })
              .attr("width", x2.rangeBand())
//               .attr("y", function(d) { return y(d.count); })
//               .attr("height", function(d) { return height - y(d.count); })
              .attr("y", height)
              .attr("height", 0)
              .transition()
              .delay(function (d, i) { return i*100; })
              .attr("y", function (d, i) { return y(d.count); })
              .attr("height", function (d) { return height - y(d.count); });    
          */
            
            function animateFirstStep(){
                  d3.select(this)
                    .transition()            
                    .delay(0)            
                    .duration(1000)
                    .attr("r", function(d) { return Number(d.errCnt)/10; })
                    .each("end", animateSecondStep);
            };

            function animateSecondStep(){
                d3.select(this)
                  .transition()
                  .duration(1000)
                  .attr("r", function(d) { return Number(d.count)/10; });
            };    
            
          var legend = svg.selectAll(".legend")
              .data(color.domain())
              .enter().append("g")
              .attr("class", "legend")
              .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

          legend.append("rect")
              .attr("x", width - 18)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", color);

          legend.append("text")
              .attr("x", width - 24)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(function(d) { return d; });

        });

//     }, 3000);
        })();
});
