$('document').ready(function () {
        var dataFile = "Products.tsv";
    // ***********************************************************************************************************
    // Adding panel buttons on the left
      var icons = ["home", "tachometer","github-square"];

      var hoveredStyle = { "background-color": "lightgray" };
    // var clickedStyle = { "background-color": "#7777BB" };

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
     //     .on("click",function(d) {
     //        d3.select(this).style(clickedStyle);
     //     })
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

    $('i.fa-github-square').click(function () {
//        $('.dashboard .zd-infopopup').toggleClass('hide');
          window.open("https://gecgithub01.walmart.com/njangir/team-voltron");
    });

    (function () {
//    setInterval(function () {
        d3.select(".line-chart").html('');
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 1160 - margin.left - margin.right,
            height = 650 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var x2 = d3.scale.ordinal()
            .rangeBands([0, width], 0.7);

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
            .attr("height", height + margin.top + margin.bottom + 40)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var line = d3.svg.line()
           .x(function(d, i) {
             return x2(d.item) + i; })
           .y(function(d, i) {
               return height - Number(d.errCnt); });

        var div = d3.select("body").append("div")   // declare the properties for the div used for the tooltips
            .attr("class", "tooltip")               // apply the 'tooltip' class
            .style("opacity", 0);


        // dataFile = (dataFile === "data.tsv") ? "data1.tsv" : "data.tsv";
        d3.tsv(dataFile, type, function(error, data) {
          if (error) throw error;

          x.domain(data.map(function(d) { return d.item; }));
          x2.domain(data.map(function(d) { return d.item; }));
          y.domain([0, d3.max(data, function(d) { return d.count; })]);

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
              .selectAll("text")
              .attr("y", 0)
              .attr("x", 5)
              .attr("dy", ".35em")
              .attr("transform", "rotate(90)")
              .style("text-anchor", "start")
              .append("text")
              .attr("x", 850)
              .attr("y", 30)
              .attr("dx", ".71em")
              .style("text-anchor", "end")
              .text("Item Number");

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
              .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", -15)
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
              .on("mouseover", function(d) {  // the mouseover event
                  div.transition()
                      .style("opacity", .85);
                  // var string = "<img src=http://i5.wal.co/dfw/dce07b8c-9986/k2-_ec60c751-0da8-4fb5-8bde-d3e534ef4bcb.v1.jpg-9ab899275f884f3532203bff5e031c928f2d6f6b-webp-450x450.webp>";
                  var string = '';
                  $.ajax({
                      async: false,
                      url: 'http://www.walmart.com/ip/'+d.item
                      })
                      .done(function (data) {
                          var beginningIndex = data.indexOf('img itemprop=image src="');
                          strippedData = data.slice(beginningIndex);
                          var enddingIndex = strippedData.indexOf('class');
                          string = "<img src=\""+strippedData.slice(24, enddingIndex-2)+"\"/>";
                      });
                  div .html(string) //this will add the image on mouseover
                      .style("left", (d3.event.pageX + 10) + "px")
                      .style("top", (d3.event.pageY + 50) + "px")
                      .style("font-color", "white");

                  })
                .on('mouseout', function(d) {
                    div.style("opacity", 0);
                })
              .transition()
              .delay(function (d, i) { return i*10; })
              .attr("y", function (d, i) { return y(d.count); })
              .attr("height", function (d) { return height - y(d.count); });

          svg.selectAll(".error-bar")
              .data(data)
              .enter().append("rect")
              .attr("class", "error-bar")
              .attr("x", function(d) { return x(d.item); })
              .attr("width", x.rangeBand())
              .attr("y", height)
              .attr("height", 0)
              .transition()
              .delay(function (d, i) { return i*10; })
              .attr("y", function (d, i) { return y(d.count); })
              .attr("height", function (d) { return height - y(d.errCnt); });

//            svg.append("path")
//               .datum(data)
//               .attr("class", "line")
//               .attr("d", line);
           });



            function type(d) {
              d.count = +d.count;
              return d;
            }
//     }, 5000);
    })();
});
