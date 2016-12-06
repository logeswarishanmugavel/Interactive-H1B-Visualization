
var SCALE = 2;
var state_ids = [ 0 ];
var id_state_map = {
    1: ""
};
var id_topo_map = {
    0: ""
};
var statename = {
    0: ""
}
var totalapplications_by_state = {
    0: ""
}
var total_certified_by_state = {
    0: ""
};
var total_certifiedwithdrawn_by_state = {
    0: ""
};
var total_withdrawn_by_state = {
    0: ""
};
var total_denied_by_state = {
    0: ""
};
var max_certified_job_title_by_state = {
    0: ""
};
var total_certified_job_title_by_state = {
	0: ""	
};
var max_certified_employer_name_by_state = {
	0: ""	
};
var total_certified_employer_name_by_state = {
	0: ""	
};
var job_title_with_max_salary_by_state = {
	0: ""	
};
var job_title_with_min_salary_by_state = {
	0: ""	
};
var max_salary_by_state = {
	0: ""	
};
var min_salary_by_state = {
	0: ""	
};
var id_name_map = {
};
var short_name_id_map = {
};
var full_name_id_map = {
};
var state_link = {
    0: ""
};

drawmap();
drawgroupedbarchart();
drawlinechart();
drawwordcloud1();
drawwordcloud2();
drawwordcloud3();

function drawwordcloud1(){

  $('#wordcloud1title').html("US States & their total certified applications");
  var frequency_list = [];

  var color = d3.scale.linear()
            .domain([0,1,2,3,4,5,6,10,15,20])
            .range(["#544F4F", "#604F4F", "#664F4F", "#724F4F", "#784F4F", "#844F4F", "#904F4F", "#964F4F", "#A24F4F", "#B24F4F"]);

    d3.json("/h1b/alldata", function(error, data) {
        d3.tsv("./static/data/us-state-names.tsv", function(error, names) {
            if (error) throw error;

        data.forEach(function(d) {
            total = d.certified + d.certifiedwithdrawn + d.withdrawn + d.denied;
            var state_id = short_name_id_map[d.employer_state];
            //console.log(d);
            //console.log(id_name_map);
            //console.log(names[id].name);
            frequency_list.push({"text":id_name_map[state_id].name, "size":parseInt((((d.certified/total)*100).toFixed(0))-80)*2 });
        });

    d3.layout.cloud().size([1500, 300])
            .words(frequency_list)
            .rotate(0)
            .fontSize(function(d) { return d.size; })
            .on("end", drawCloud)
            .start();



    function drawCloud(words) {
        //console.log(words);
        d3.select("#wordcloud1").append("svg")
                .attr("width", 1500)
                .attr("height", 300)
                .attr("class", "wordcloud")
                .append("g")
                .attr("transform", "translate(320,200)")
                .selectAll("text")
                .data(frequency_list)
                .enter().append("text")
                .style("font-size", function(d) { 
                    if(d){
                    return d.size + "px"; }})
                .style("fill", function(d, i) { return color(i); })
                .attr("transform", function(d) {
                    if(d){return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"};
                })
                .text(function(d) { if(d){return d.text; }});
    }
  });
    });
}

function drawwordcloud2(){

  $('#wordcloud2title').html("Job titles & their total certified applications");
  var frequency_list = [];

  var color = d3.scale.linear()
            .domain([0,1,2,3,4,5,6,10,15,20])
            .range(["#4F544F", "#4F604F", "#4F664F", "#4F724F", "#4F784F", "#4F844F", "#4F904F", "#4F964F", "#4FA24F", "#4FB24F"]);

    d3.json("/h1b/alldata", function(error, data) {
            if (error) throw error;
        

        data.forEach(function(d) {
            frequency_list.push({"text":d.maxcertifiedjobtitle, "size":d.jtmaxno/200});
        });

    d3.layout.cloud().size([1200, 300])
            .words(frequency_list)
            .rotate(0)
            .fontSize(function(d) { return d.size; })
            .on("end", drawCloud)
            .start();

    

    function drawCloud(words) {
        //console.log(words);
        d3.select("#wordcloud2").append("svg")
                .attr("width", 1200)
                .attr("height", 300)
                .attr("class", "wordcloud")
                .append("g")
                .attr("transform", "translate(320,200)")
                .selectAll("text")
                .data(frequency_list)
                .enter().append("text")
                .style("font-size", function(d) { 
                    return d.size + "px"; })
                .style("fill", function(d, i) { return color(i); })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });
    }
  });
}

function drawwordcloud3(){

  $('#wordcloud3title').html("Employer names & their total certified applications");
  var frequency_list = [];

  var color = d3.scale.linear()
            .domain([0,1,2,3,4,5,6,10,15,20])
            .range(["#4F4F54", "#4F4F60", "#4F4F66", "#4F4F72", "#4F4F78", "#4F4F84", "#4F4F90", "#4F4F96", "#4F4FA2", "#4F4FB2"]);

    d3.json("/h1b/alldata", function(error, data) {
            if (error) throw error;
        

        data.forEach(function(d) {
            //console.log(d);
            frequency_list.push({"text":d.maxcertifiedemployername, "size":d.enmaxno/200});
        });

    d3.layout.cloud().size([1200, 300])
            .words(frequency_list)
            .rotate(0)
            .fontSize(function(d) { return d.size; })
            .on("end", drawCloud)
            .start();

    

    function drawCloud(words) {
        //console.log(words);
        d3.select("#wordcloud3").append("svg")
                .attr("width", 1200)
                .attr("height", 300)
                .attr("class", "wordcloud")
                .append("g")
                .attr("transform", "translate(320,200)")
                .selectAll("text")
                .data(frequency_list)
                .enter().append("text")
                .style("font-size", function(d) { 
                    return d.size + "px"; })
                .style("fill", function(d, i) { return color(i); })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });
    }
  });
}



function drawlinechart(){

  var margin = {top: 200, right: 150, bottom: 200, left: 50},
    width = 2000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

  var linedata = [];

  var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
    .range([height, 0]);

  var color = d3.scale.category20();

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var area = d3.svg.area()
    .x(function(d) { return x(d.State); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); });


  var divTooltip = d3.select("body").append("div").attr("class", "toolTip");
  
  var stack = d3.layout.stack().values(function(d) { return d.values; });


  var svg_line = d3.select("#line-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg_line.append("text")
      .attr("x", width/4)
      .attr("y", -160)
      .style("fill","#AA8939")
      .style("font-size","25px")
      .style("text-anchor", "start")
      .text("Application Status Analysis per State");

  d3.json("/h1b/alldata", function(error, data) {
        
      d3.tsv("./static/data/us-state-names.tsv", function(error, names) {
            if (error) throw error;

console.log()
        data.forEach(function(d) {
          if(d){
            total = d.certified + d.certifiedwithdrawn + d.withdrawn + d.denied;
            var state_id = short_name_id_map[d.employer_state];
            linedata.push({"State":id_name_map[state_id].name,"CERTIFIED":((d.certified/total)*100).toFixed(2), "WITHDRAWN": ((d.withdrawn/total)*100).toFixed(2), "CERTIFIEDWITHDRAWN": ((d.certifiedwithdrawn/total)*100).toFixed(2), "DENIED":((d.denied/total)*100).toFixed(2)});
          }
        });
        linedata.push({"State":"","CERTIFIED":"", "WITHDRAWN": "", "CERTIFIEDWITHDRAWN": "", "DENIED":""});

        console.log(linedata);

        color.domain(d3.keys(linedata[0]).filter(function(key) { return key !== "State"; }));

  
        var layers = stack(color.domain().map(function(name) {
          return {
            name: name,
            values: linedata.map(function(d) {
              return {State: d.State, y: d[name] * 1};
            })
          };
        }));


        x.domain(linedata.map(function(d) { 
        return d.State; }));
        y.domain([0, 100]);

        
        var layer = svg_line.selectAll("svg")
          .data(layers)
          .enter().append("g")
          .attr("class", "layer");


        layer.append("path")
          .attr("class", "area")
          .attr("d", function(d) { return area(d.values); })
          .style("fill", function(d) { return color(d.name); });

        
        layer.append("text")
          .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 2]}; })
          .attr("transform", function(d) {
            return "translate(" + x(d.value.State) + "," + y(d.value.y0 + d.value.y / 2) + ")"; })
          .attr("x", -5)
          .attr("dy", ".35em")
          .text(function(d) { return d.name; });
          
           svg_line.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
                });

        svg_line.append("g")
          .attr("class", "y axis")
          .call(yAxis).append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -45)
      .attr("x",-height/2)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Percentage");

         
        var mouseG = svg_line.append("g")
  .attr("class", "mouse-over-effects");

mouseG.append("path")
  .attr("class", "mouse-line")
  .style("stroke", "black")
  .style("stroke-width", "1px")
  .style("opacity", "0");

var lines = document.getElementsByClassName('line');

var mousePerLine = mouseG.selectAll('.mouse-per-line')
  .data(linedata)
  .enter()
  .append("g")
  .attr("class", "mouse-per-line");

mousePerLine.append("circle")
  .attr("r", 7)
  .style("stroke", function(d) {
    return color(d.name);
  })
  .style("fill", "none")
  .style("stroke-width", "1px")
  .style("opacity", "0");

mousePerLine.append("text")
  .attr("transform", "translate(10,3)");

mouseG.append('svg:rect')
  .attr('width', width)
  .attr('height', height)
  .attr('fill', 'none')
  .attr('pointer-events', 'all')
  .on('mouseout', function() { 
    d3.select(".mouse-line")
      .style("opacity", "0");
    d3.selectAll(".mouse-per-line circle")
      .style("opacity", "0");
    d3.selectAll(".mouse-per-line text")
      .style("opacity", "0");
  })
  .on('mouseover', function() { 
    d3.select(".mouse-line")
      .style("opacity", "1");
    d3.selectAll(".mouse-per-line circle")
      .style("opacity", "1");
    d3.selectAll(".mouse-per-line text")
      .style("opacity", "1");
  })
  .on('mousemove', function() { 
    var mouse = d3.mouse(this);

    d3.select(".mouse-line")
      .attr("d", function() {
        var d = "M" + mouse[0] + "," + height;
        d += " " + mouse[0] + "," + 0;
        return d;
      });

});
      
  });

  });
}


  /*
    //console.log("Drawing Line Chart")
    var margin = {top: 200, right: 0, bottom: 30, left: 150},
    width = 2000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var linedata = [];

    var color = d3.scale.ordinal()
        .range(["#0a0", "yellow", "blue", "red"]);

    var x = d3.scale.ordinal()
            .rangePoints([0, 1500]);

        var y = d3.scale.linear()
            .range([height, 0]);


        var xAxis = d3.svg.axis().scale(x).orient("bottom");
        var yAxis = d3.svg.axis().scale(y).orient("left");
   
   var divTooltip = d3.select("body").append("div").attr("class", "toolTip");

    var svg = d3.select("#line-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
      .attr("x", width/4)
      .attr("y", -160)
      .style("fill","#AA8939")
      .style("font-size","25px")
      .style("text-anchor", "start")
      .text("Application Status Analysis per State");

    svg.append("text")
      .attr("x", width/4)
      .attr("y", -140)
      .style("fill","#a0e")
      .style("font-size","15px")
      .style("text-anchor", "start")
      .text("Hover the dot for values");
    d3.json("/h1b/alldata", function(error, data) {
        if (error) throw error;

        data.forEach(function(d) {
            linedata[d.id] = ({"State":d.employer_state,"CERTIFIED":d.certified, "WITHDRAWN": d.withdrawn, "CERTIFIEDWITHDRAWN": d.certifiedwithdrawn, "DENIED":d.denied});
        });
     //   console.log(linedata);
        var seriesNames = d3.keys(linedata[1])
            .filter(function(d) { return d !== "State"; })
            .sort();
  
        var series = seriesNames.map(function(series) {
            return linedata.map(function(d) {
                if(d){
            return {State: d.State, values: +d[series]};}
        });
   });
        
       x.domain(linedata.map(function(d) { 
        return d.State; }));
       y.domain([0,10000]);

       svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

        svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(0,0)")
      .call(yAxis);

      svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
        .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("No. of applications");


      svg.selectAll(".series")
      .data(series)
    .enter().append("g")
      .attr("class", "series")
      .style("fill", function(d, i) { return color(i); })
    .selectAll(".point")
      .data(function(d) { return d; })
    .enter().append("circle")
      .attr("class", "point")
      .attr("r", 4.5)
      .attr("cx", function(d) { 
        if(d){
        return x(d.State);
        }})
      .attr("cy", function(d) { 
        if(d){
        return y(d.values); }})
       .on("mousemove", function(d){
            if(d){
            divTooltip.style("left", d3.event.pageX+10+"px");
            divTooltip.style("top", d3.event.pageY-25+"px");
            divTooltip.style("display", "inline-block");
            var id = short_name_id_map[d.State];
            divTooltip.html(statename[id]+" : "+d.values);
        }
        })
        .on("mouseout", function(d){
            divTooltip.style("display", "none");
        });

    var legend = svg.selectAll(".linelegend")
      .data(seriesNames.slice().reverse())
      .enter().append("g")
      .attr("class", "linelegend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", 930)
      .attr("y", -120)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", 930)
      .attr("y", -120)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
});


}
*/

function drawgroupedbarchart(){

    var margin = {top: 50, right: 20, bottom: 200, left: 70},
    width = 1500,
    height = 500;

    var bardata = [];

    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.ordinal()
        .range(["#077", "blue"]);

    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");


    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

   var divTooltip = d3.select("body").append("div").attr("class", "toolTip");
  

    var svg_bar = d3.select("#bar-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    svg_bar.append("text")
      .attr("x", width/4)
      .attr("y", -30)
      .style("fill","#AA8939")
      .style("font-size","25px")
      .style("text-anchor", "start")
      .text("Maximum and Minimum Salary per State");

    svg_bar.append("text")
      .attr("x", width/4)
      .attr("y", -10)
      .style("fill","#a0e")
      .style("font-size","15px")
      .style("text-anchor", "start")
      .text("Click on a bar to know more");


    d3.json("/h1b/alldata", function(error, data) {
       d3.tsv("./static/data/us-state-names.tsv", function(error, names) {
        if (error) throw error;

        data.forEach(function(d) {
          if(d){
          var state_id = short_name_id_map[d.employer_state];
            bardata[d.id]=({"State":id_name_map[state_id].name,"Maximum Salary":d.max_salary, "Minimum Salary": d.min_salary});}
        });

        console.log(bardata);

        var Names = d3.keys(bardata[0]).filter(function(key) { return key !== "State"; });
        
        bardata.forEach(function(d){
             d.ages = Names.map(function(name) { return {name: name, value: +d[name]}; });
        });
        

    x0.domain(bardata.map(function(d) { 
        return d.State; }));
    x1.domain(Names).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(bardata.map(function(d) { 
        return d3.max(d.ages, function(d) { return d.value; }); })) ]);

    svg_bar.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
                });

    svg_bar.append("g")
      .attr("class", "y axis")
      .call(yAxis)
        .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("x",-height/2)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("No. of applications");

    svg_bar.append("g")
      .attr("class", "state");

    var state = svg_bar.selectAll("svg")
      .data(bardata)
    .enter().append("g")
      .attr("transform", function(d) { if(d){return "translate(" + x0(d.State) + ",0)"; }})

    state.append("rect")
        .attr("class","bar1")
        .style("fill", color(0))
        .attr("width", x1.rangeBand()+20)
      .attr("x", function(d) { if(d){return x1(d.State); }})
      .attr("y", function(d) { if(d){return y(d.ages[0].value); }})
      .attr("height", function(d) { if(d){return height - y(d.ages[0].value); }});

      state.append("rect")
        .attr("class","bar2")
        .style("fill", color(1))
        .attr("width", x1.rangeBand()+20)
      .attr("x", function(d) { if(d){return x1(d.State); }})
      .attr("y", function(d) { if(d){return y(3*(d.ages[1].value)); }})
      .attr("height", function(d) { if(d){return height - y(3*(d.ages[1].value)); }});
      
  
    state.selectAll("rect")
      .data(function(d) { return d.ages; })
    .enter().append("g");
      state
        .on("mousemove", function(d){
            divTooltip.style("left", d3.event.pageX+10+"px");
            divTooltip.style("top", d3.event.pageY-25+"px");
            divTooltip.style("display", "inline-block");
            var x = d3.event.pageX, y = d3.event.pageY
            var elements = document.querySelectorAll(':hover');
            l = elements.length
            l = l-1
            elementData = elements[l].__data__
            divTooltip.html(elementData.name+" : $"+elementData.value);
        })
        .on("mouseout", function(d){
            divTooltip.style("display", "none");
        })
        .on("click",updateTable);

  var legend = svg_bar.selectAll(".legend")
      .data(Names.slice())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", 230)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", 224)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
 
}); 

    function updateTable(d){

        var id = full_name_id_map[d.State];

        $('#jobtitlewithmaxsalary-value').html(job_title_with_max_salary_by_state[id]);
        $('#max_salary-value').html(max_salary_by_state[id]);
        $('#jobtitlewithminsalary-value').html(job_title_with_min_salary_by_state[id]);
        $('#min_salary-value').html(min_salary_by_state[id]);
    }
    });
}

function drawmap(){

var centered;
var margin = {top: 40, right: 20, bottom: 30, left: 40};
var width = 700;
var height = 750;
var projection = d3.geo.albersUsa().scale(500).translate([ width / 4, height / 3 ]);
var path = d3.geo.path().projection(projection);

var divTooltip = d3.select("body").append("div").attr("class", "toolTip");

var svg = d3.select("#canvas-svg")
            .append("svg")
              .attr("width", width)
              .attr("height", height);
var g = svg.append("g");

d3.json("/h1b/alldata", function(error, data) {
	d3.tsv("./static/data/us-state-names.tsv", function(error, names) {
      //  console.log(names);
    for (var i = 0; i < names.length; i++) {
        id_name_map[names[i].id] = names[i];
        short_name_id_map[names[i].code] = names[i].id;
        full_name_id_map[names[i].name] = names[i].id;
    }
    data.forEach(function(d) {
 
        var state_id = short_name_id_map[d.employer_state];
        
        statename[state_id] = d.employer_state;
        total_certified_by_state[state_id] = d.certified;
        total_certifiedwithdrawn_by_state[state_id] = d.certifiedwithdrawn;
        total_withdrawn_by_state[state_id] = d.withdrawn;
        total_denied_by_state[state_id] = d.denied;
        totalapplications_by_state[state_id] = d.certified + d.certifiedwithdrawn + d.denied + d.withdrawn;

        max_certified_job_title_by_state[state_id] = d.maxcertifiedjobtitle;
        total_certified_job_title_by_state[state_id] = d.jtmaxno;

        max_certified_employer_name_by_state[state_id]= d.maxcertifiedemployername;
        total_certified_employer_name_by_state[state_id] = d.enmaxno;

        job_title_with_max_salary_by_state[state_id] = d.jobtitlewithmaxsalary;
        job_title_with_min_salary_by_state[state_id] = d.jobtitlewithminsalary;

        max_salary_by_state[state_id] = d.max_salary;
        min_salary_by_state[state_id] = d.min_salary;
    });
	
    d3.json("./static/data/us.json", function(error, us) {
        g.append("g")
          .attr("id", "states")
          .attr("class","states")
          .attr("transform", "scale(" + SCALE + ")")
          .selectAll("path")
          .data(topojson.feature(us, us.objects.states).features)
          .enter()
          .append("path")
          .attr("d", path)
          .attr("id", function(d) {
            state_ids.push(+d.id);
            id_state_map[d.id] = id_name_map[d.id].name;
            id_topo_map[d.id] = d;
            return "map-" + d.id; 
        }).on("click", map_clicked)
          .on("mouseover", function(d){
            divTooltip.style("left", d3.event.pageX+10+"px");
            divTooltip.style("top", d3.event.pageY-25+"px");
            divTooltip.style("display", "inline-block");
            var x = d3.event.pageX, y = d3.event.pageY
            var elements = document.querySelectorAll(':hover');
            l = elements.length
            l = l-1
            elementData = elements[l].__data__
            divTooltip.html(id_name_map[d.id].name);})
        .on("mouseout", function(d){
            divTooltip.style("display", "none");
        });
        
        g.append("path")
          .datum(topojson.mesh(us, us.objects.states, function(a, b) {return a !== b;}))
          .attr("id", "state-borders")
          .attr("transform", "scale(" + SCALE + ")")
          .attr("d", path)
          .on('mouseover', function(d){ d3.select(this).style({fill: 'purple'}) })
          .on('mouseout', function(d){ d3.select(this).style({fill: 'brown'}) });;
          
        state_ids = state_ids.sort(function(a, b) {
            return a - b;
        });

        d3.select("#canvas-svg").append("select")
          .attr("id", "state-select")
          .on("change", function() {
            var topo = id_topo_map[$(this).val()];
            map_clicked(topo);
        }).selectAll("option")
        .data(state_ids)
        .enter().append("option")
          .attr("value", function(d) {
            return d;
        }).text(function(d) {
            return id_state_map[d];
        });

            g.append("text")
            .attr("x", width)
            .attr("y", 120)
            .style("fill","#AA8939")
            .style("font-size","30px")
            .style("text-anchor", "end")
            .text("Statewise Analysis");

            g.append("text")
            .attr("x", width)
            .attr("y", 150)
            .style("fill","#a0e")
            .style("font-size","15px")
            .style("text-anchor", "end")
            .text("Click on a state or select from drop down to know more");

        $("#state-select").val(0);
        var topo = id_topo_map[0];
        map_clicked(topo);
    });
});
});

function map_clicked(d) {
    if (d) {
        $('#statenamevalue').html(short_name_id_map[d.id]);
        drawpiechart(d);
        $("#state-select").val(d.id);
            $("#maxcertifiedjobtitle-value").html(max_certified_job_title_by_state[d.id]);
            $("#maxcertifiedemployername-value").html(max_certified_employer_name_by_state[d.id]);
            $("#jtmaxno-value").html(total_certified_job_title_by_state[d.id]);
            $("#enmaxno-value").html(total_certified_employer_name_by_state[d.id]);
        var x, y, k;
        if (d && centered !== d) {
            var centroid = path.centroid(d);
            x = centroid[0];
            y = centroid[1];
            k = 4;
            centered = d;
        } else {
            x = width / 2;
            y = height / 2;
            k = 1;
            centered = null;
        }
        g.selectAll("path").classed("active", function(d) {
            return d === centered;
        });
    }
}

function drawpiechart(d){
    if (total_certified_by_state[d.id]) {
    $('#pie-chart').html("");
    var data = [{"name":"CERTIFIED","value":total_certified_by_state[d.id],"percent":(total_certified_by_state[d.id]/totalapplications_by_state[d.id])*100},
                {"name":"WITHDRAWN","value":total_withdrawn_by_state[d.id],"percent":(total_withdrawn_by_state[d.id]/totalapplications_by_state[d.id])*100},
                {"name":"CERTIFIEDWITHDRAWN","value":total_certifiedwithdrawn_by_state[d.id],"percent":(total_certifiedwithdrawn_by_state[d.id]/totalapplications_by_state[d.id])*100},
                {"name":"DENIED","value":total_denied_by_state[d.id],"percent":(total_denied_by_state[d.id]/totalapplications_by_state[d.id])*100}];

    var r = d3.scale.category20();

    var width = 550,
    height = 350,
    radius = Math.min(width, height) / 2;

    var color = d3.scale.ordinal()
        .range(["#0a0", "yellow", "blue", "red"]);

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70);


    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.value; });

    var svg_pie = d3.select("#pie-chart").append("svg")
        .attr('class','pie-chartclass')
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var g_pie = svg_pie.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    g_pie.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.name); })
        .on("mouseover",setCenterText)
        .on("mouseout",resetCenterText);

    g_pie.append('text')
        .attr('class', 'statenamevalue')
        .attr('text-anchor', 'middle')
        .style('font-size','30px')
        .attr('y', '-25px')
        .style('font-family','Helvetica')
        .style('fill','brown');

     g_pie.select(".statenamevalue")
            .text(id_name_map[d.id].name);

    g_pie.append('text')
        .attr('class', 'center-txtname')
        .attr('y', '5px')
        .attr('text-anchor', 'middle')
        .style('font-size','15px')
        .style('font-family','Helvetica')
        .style('fill','blue');

    g_pie.select(".center-txtname")
            .text("Hover to see values");

    g_pie.append('text')
        .attr('class', 'center-txtvalue')
        .attr('y', '30px')
        .attr('text-anchor', 'middle')
        .style('font-size','20px')
        .style('font-family','Helvetica')
        .style('fill','#AA8939');
        ;

    g_pie.append('text')
        .attr('class', 'center-txtpercent')
        .attr('x','3px')
        .attr('y', '55px')
        .attr('text-anchor', 'middle')
        .style('font-size','20px')
        .style('font-family','Helvetica')
        .style('fill','magenta');
        
    
    function setCenterText(d){
        g_pie.select(".center-txtname")
            .text(d.data.name);
        g_pie.select(".center-txtvalue")
            .text(d.data.value);
        g_pie.select(".center-txtpercent")
            .text(d.data.percent.toFixed(2)+"%");
    }
    function resetCenterText(d){
        g_pie.select(".center-txtname")
            .text("Hover to see values");
         g_pie.select(".center-txtvalue")
            .text("");
        g_pie.select(".center-txtpercent")
            .text("");
    }
    }
    else
    {
        $('#pie-chart').html("No Data");

    }
}
}