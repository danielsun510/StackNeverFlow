var pre_data = [];

//read row data
var dataRead = function(callback,crime,time){
d3.csv("data/cm.csv", function(d) {
      return {
        year: d.Year,
        county: d.County,
        sum_violent: Number(d.Violent_sum),
          sum_homicide: Number(d.Homicide_sum),
          sum_forRape: Number(d.ForRape_sum),
          sum_robbery: Number(d.Robbery_sum),
          sum_aggAssault: Number(d.AggAssault_sum),
        sum_property: Number(d.Property_sum),
          sum_burglary: Number(d.Burglary_sum),
          sum_vehicleTheft: Number(d.VehicleTheft_sum),
          sum_lTtotal: Number(d.LTtotal_sum),
        sum_arsen: Number(d.GrandTotal_sum),
          sum_totalMobile: Number(d.TotalMobile_sum),
          sum_totalOther: Number(d.TotalOther_sum),
          sum_totalStructural: Number(d.TotalStructural_sum)
      };
    }, function(error, row) {  

       setTimeout(function () {
　　　　　　preProcessData(row);
　　　　　　callback(crime,time);
　　　　}, 1);
   });
}

//pre process data
var preProcessData = function(rowData){

    var current = rowData[0];
    
    for(var i =0 ; i<rowData.length-1;i++){
      if(rowData[i].county == rowData[i+1].county){
         current.sum_violent += rowData[i+1].sum_violent;  
         current.sum_homicide += rowData[i+1].sum_homicide;  
         current.sum_forRape += rowData[i+1].sum_forRape;  
         current.sum_robbery += rowData[i+1].sum_robbery;  
         current.sum_aggAssault += rowData[i+1].sum_aggAssault;  
         current.sum_property += rowData[i+1].sum_property;  
         current.sum_burglary += rowData[i+1].sum_burglary;  
         current.sum_vehicleTheft += rowData[i+1].sum_vehicleTheft;  
         current.sum_lTtotal += rowData[i+1].sum_lTtotal;  
         current.sum_arsen += rowData[i+1].sum_arsen;  
         current.sum_totalMobile += rowData[i+1].sum_totalMobile; 
         current.sum_totalOther += rowData[i+1].sum_totalOther;  
         current.sum_totalStructural += rowData[i+1].sum_totalStructural;   
      }
      else{
        pre_data.push(current);
        current = rowData[i+1];
      }
   }
};


//rank based on specified crime and time, the result would be 0-1. 
var rank = function(category,year){
     
     // console.log(pre_data);
     var rank_result = [];
     var max = 0;
     
     if(year == 0){ //refers to all years      
        rank_result = caseAllYears(category);
        // console.log(rank_result);
        for(var i = 0; i<rank_result.length;i++){
           max = (rank_result[i].score>max)?rank_result[i].score:max;
        } 
     }
     else{
          for(var i = 0; i<pre_data.length; i++){    
             if(pre_data[i].year == year){
                var county_data = {county:pre_data[i].county.split(' County')[0],score:pre_data[i][category]};   
                    rank_result.push(county_data);
                    max = (pre_data[i][category]>max)?pre_data[i][category]:max;
             }
          } 
     }
     
     for(var element in rank_result){
       rank_result[element].score = Math.pow(rank_result[element].score/max,0.2)
     }

     return rank_result;
}


//rank based on all year
var caseAllYears = function(category){
    
    var county_data = new Array(58);

    for(var i = 0; i<county_data.length; i++){

         county_data[i]={county:pre_data[i].county.split(' County')[0],score:pre_data[i][category]};   

    }
    
    for(var j = county_data.length; j<pre_data.length; j++){
        
         county_data[j % 58].score += pre_data[j][category];
    
    }

    return county_data;
}

//filter for summary [{date: 2015, sum_violent: 223, sum_property: 1223, sum_arsen: 333}]
var summaryProcess = function(county){
    var data_summary = [];
    for(var i = 0; i<pre_data.length; i++){
      if(pre_data[i].county.startsWith(county)){
          data_summary.push({date:pre_data[i].year,sum_violent:pre_data[i].sum_violent,sum_property:pre_data[i].sum_property,sum_arsen:pre_data[i].sum_arsen});
      }
    }  

    return data_summary;
}


var compare = function(county,year,category){  
  
   if(!isNaN(parseInt(county.charAt(county.length-1)))){
      var county = county.slice(0,county.length - 2);
   }
   if(year == 0){year = 2005;}

   data_compare = rank(category,year);
   console.log("--->" )
   console.log(data_compare)

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 400 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var formatPercent = d3.format(".0%");

    var x = d3.scale.ordinal()
              .rangeRoundBands([0, width], .1, 1);

    var y = d3.scale.linear()
              .range([height, 0]);

    var xAxis = d3.svg.axis()
                  .scale(x)
                  .orient("bottom");

    var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient("left")
                  .tickFormat(formatPercent);

    var svg = d3.select("#compare").append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    data_compare.forEach(function(d) {
       d.score = +d.score;
     });

    x.domain(data_compare.map(function(d) { return d.county; }));
    y.domain([0, d3.max(data_compare, function(d) { return d.score; })]);

    svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis)
       .selectAll("text")
       .attr("y", -2)
       .attr("x", -10)
       .style("text-anchor", "end")
       .style("font-size", "0.3em")
       .attr("transform", "rotate(-90)");

    svg.append("g")
       .attr("class", "y axis")
       .call(yAxis)
       .append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 6)
       .attr("dy", ".71em")
       .style("text-anchor", "end")
       .text("Frequency");

    svg.selectAll(".bar")
       .data(data_compare)
       .enter().append("rect")
       .attr("class", "bar")
       .attr("x", function(d) { return x(d.county); })
       .attr("width", x.rangeBand()-1)
       .attr("dx", "-3em")
       .attr("y", function(d) { return y(d.score); })
       .attr("height", function(d) { return height - y(d.score); })
       .style("fill", function(d){
          if(d.county == county){return "ff0000"}
          else{return "steelblue"}
       });

    d3.select("#compare-label input").on("change", change);

    var sortTimeout = setTimeout(function() {
        d3.select("#compare-label input").property("checked", true).each(change);
    }, 2000);

    function change() {
       
      clearTimeout(sortTimeout);

      var x0 = x.domain(data_compare.sort(this.checked
           ? function(a, b) { return b.score - a.score; }
           : function(a, b) { return d3.ascending(a.county, b.county); })
           .map(function(d) { return d.county; }))
           .copy();

       svg.selectAll(".bar")
          .sort(function(a, b) { return x0(a.county) - x0(b.county); });
       
       var transition = svg.transition().duration(750),
         delay = function(d, i) { return i * 50; };

       transition.selectAll(".bar")
                 .delay(delay)
                 .attr("x", function(d) { return x0(d.county); });
      
       transition.select(".x.axis")
                 .call(xAxis)
                 .selectAll("text")
                 .attr("y", -2)
                 .attr("x", -10)
                 .style("text-anchor", "end")
                 .style("font-size", "0.3em")
                 .attr("transform", "rotate(-90)")
                 .delay(delay);

     }
};

var trend = function(id,county,year){

//     var box_height = document.getElementById(id).offsetHeight;
//     var box_width = document.getElementById(id).offsetWidth;
//     var margin = {top: 10, right: 40, bottom: 40, left: 60},
//         width = box_width - margin.left - margin.right,
//         height = box_height - margin.top - margin.bottom - 27;

// var parseDate = d3.time.format("%Y").parse;

// var x = d3.time.scale()
//     .range([0, width]);

// var y = d3.scale.linear()
//     .range([height, 0]);

// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient("bottom");

// var yAxis = d3.svg.axis()
//     .scale(y)
//     .orient("left");

// var line = d3.svg.line()
//     .x(function(d) { return x(d.date); })
//     .y(function(d) { return y(d.close); });

// var svg = d3.select("#trend").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//   var data = [];
//   for(var i=0;i<pre_data.length;i++){
     
//      if(pre_data[i].county.split(' County')[0])
//       data.push({date:x_value[i],close:y_value[i]})
//   };

//   data.forEach(function(d) {
//     d.date = parseDate(d.date);
//     d.close = +d.close;
//   });

//   x.domain(d3.extent(data, function(d) { return d.date; }));
//   y.domain(d3.extent(data, function(d) { return d.close; }));

//   svg.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(xAxis);

//   svg.append("g")
//       .attr("class", "y axis")
//       .call(yAxis)
//     .append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 6)
//       .attr("dy", ".71em")
//       .style("text-anchor", "end")
//       .text("Price ($)");

//   svg.append("path")
//       .datum(data)
//       .attr("class", "line")
//       .attr("d", line);
}

var summary = function(county,color){
    
   if(!isNaN(parseInt(county.charAt(county.length-1)))){
      var county = county.slice(0,county.length - 2);
   }

    var head = document.getElementById("infowindow-content-summary-head");
    head.childNodes[0].innerHTML = county;
    var crime_square = document.getElementById("crime-level").getElementsByTagName('span');
    // console.log(color);
    // console.log(crime_square.length);
    crime_square[0].style.background = color;
    var level = colorToNumer(color);
    crime_square[1].innerHTML = level;

    var data = summaryProcess(county); //{{date: 2015, sum_violent: 223, sum_property: 1223, sum_arsen: 333}}
    
    data.forEach(function (d) {
        d.date = +d.date;
        d.sum_violent = +d.sum_violent;
        d.sum_property = +d.sum_property;
        d.sum_arsen = +d.sum_arsen;
    });

    var chart = makeLineChart(data, 'date', {
        'Violent': {column: 'sum_violent'},
        'Property': {column: 'sum_property'},
        'Arsen': {column: 'sum_arsen'},
    }, {xAxis: 'Years', yAxis: 'Amount'});
    chart.bind("#infowindow-content-summary-content");
    chart.render();

}

var colorToNumer = function(hex){
    var r = hex.slice(1,3);
    var r_num = parseInt(r,16);
    var level;

    switch(true) {
      case (r_num<88):
         level =  "Low";
         break;
      case (r_num<176):
         level = "Average";
         break;
      case (r_num<256):
         level = "Severe";
         break;
    }
    return level;
}


console.log(pre_data);