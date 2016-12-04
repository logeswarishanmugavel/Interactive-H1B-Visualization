
var SCALE = 2;
var state_ids = [ 0 ];
var id_state_map = {
    1: ""
};
var id_topo_map = {
    1: null
};
var statename = {
    1: ""
}
var totalapplications_by_state = {
    1: ""
}
var total_certified_by_state = {
    1: ""
};
var total_certifiedwithdrawn_by_state = {
    1: ""
};
var total_withdrawn_by_state = {
    1: ""
};
var total_denied_by_state = {
    1: ""
};
var max_certified_job_title_by_state = {
    1: ""
};
var total_certified_job_title_by_state = {
	1: ""	
};
var max_certified_employer_name_by_state = {
	1: ""	
};
var total_certified_employer_name_by_state = {
	1: ""	
};
var job_title_with_max_salary_by_state = {
	1: ""	
};
var job_title_with_min_salary_by_state = {
	1: ""	
};
var max_salary_by_state = {
	1: ""	
};
var min_salary_by_state = {
	1: ""	
};
var id_name_map = {
    0: null
};
var short_name_id_map = {
    0: null
};
var state_link = {
    0: null
};

drawmap();
drawgroupedbarchart();
drawlinechart();

function drawlinechart(){
    console.log("Drawing Line Chart")
    var svg = d3.select("svg"),
    margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y%m%d");

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.temperature); });

d3.json("/h1b/alldata", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
            linedata[d.id] = ({"State":d.employer_state,"Maximum Salary":d.max_salary, "Minimum Salary": d.min_salary});
        });

  var cities = linedata.columns.slice(1).map(function(id) {
    return {
      id: id,
      values: data.map(function(d) {
        return {date: d.date, temperature: d[id]};
      })
    };
  });

  console.log(cities);
/*
  x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([
    d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.temperature; }); }),
    d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.temperature; }); })
  ]);

  z.domain(cities.map(function(c) { return c.id; }));

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Temperature, ºF");

  var city = g.selectAll(".city")
    .data(cities)
    .enter().append("g")
      .attr("class", "city");

  city.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return z(d.id); });

  city.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.id; });
      */
});

function type(d, _, columns) {
  d.date = parseTime(d.date);
  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
  return d;
}

}


function drawgroupedbarchart(){

    var margin = {top: 50, right: 20, bottom: 30, left: 40},
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
      .style("fill","red")
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
        if (error) throw error;


        data.forEach(function(d) {
            bardata[d.id] = ({"State":d.employer_state,"Maximum Salary":d.max_salary, "Minimum Salary": d.min_salary});
        });

        var Names = d3.keys(bardata[1]).filter(function(key) { return key !== "State"; });
        
        bardata.forEach(function(d){
             d.ages = Names.map(function(name) { return {name: name, value: +d[name]}; });
        });
        

    x0.domain(bardata.map(function(d) { 
        return d.State; }));
    x1.domain(Names).rangeRoundBands([1, x0.rangeBand()]);
    y.domain([0, d3.max(bardata.map(function(d) { 
        return d3.max(d.ages, function(d) { return d.value; }); })) ]);

    svg_bar.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg_bar.append("g")
      .attr("class", "y axis")
      .call(yAxis)
        .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("No. of applications");

    svg_bar.append("g")
      .attr("class", "state");

    var state = svg_bar.selectAll(".state")
      .data(bardata)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + x0(d.State) + ",0)"; })

    state.selectAll("rect")
      .data(function(d) { return d.ages; })
    .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return color(d.name); });
  
      state
        .on("mousemove", function(d){
            divTooltip.style("left", d3.event.pageX+10+"px");
            divTooltip.style("top", d3.event.pageY-25+"px");
            divTooltip.style("display", "inline-block");
            var x = d3.event.pageX, y = d3.event.pageY
            var elements = document.querySelectorAll(':hover');
            l = elements.length
            l = l-1
            var id = short_name_id_map[d.State];
            elementData = elements[l].__data__
            divTooltip.html((id_name_map[id].name)+"<br>"+elementData.name+" : $"+elementData.value);
        });
        state
        .on("mouseout", function(d){
            divTooltip.style("display", "none");
        })
        .on("click",updateTable);


  var legend = svg_bar.selectAll(".legend")
      .data(Names.slice().reverse())
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
        var id = short_name_id_map[d.State];
        $('#jobtitlewithmaxsalary-value').html(job_title_with_max_salary_by_state[id]);
        $('#max_salary-value').html(max_salary_by_state[id]);
        $('#jobtitlewithminsalary-value').html(job_title_with_min_salary_by_state[id]);
        $('#min_salary-value').html(min_salary_by_state[id]);
    }
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
            .attr("y", 70)
            .style("fill","red")
            .style("font-size","30px")
            .style("text-anchor", "end")
            .text("Statewise Analysis");

            g.append("text")
            .attr("x", width)
            .attr("y", 90)
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
        .style('fill','red');
        ;

    g_pie.append('text')
        .attr('class', 'center-txtpercent')
        .attr('x','3px')
        .attr('y', '55px')
        .attr('text-anchor', 'middle')
        .style('font-size','20px')
        .style('font-family','Helvetica')
        .style('fill','magenta');
        ;

    g_pie.append('legends')
        .attr('class', 'legend');

    
   /* var piechartnames = ['CERTIFIED','WITHDRAWN','CERTIFIEDWITHDRAWN','DENIED'];
    
    var legends = g.select('#pie-chart')
                    .select('g_pie')
                    .data(piechartnames)
                    .enter().append('g')
                    .attr('class','legend')
                                
            var ls_w = 20, ls_h = 20;

            legends.append("rect")
                    .attr("x", 20)
                    .attr("y", function(d, i){ return height - (i*ls_h) - 2*ls_h;})
                    .attr("width", ls_w)
                    .attr("height", ls_h)
                    .style("fill", function(d, i) { return color(i); })
                    .style("opacity", 0.8);
            
            legends.append("text")
                    .attr("x", 50)
                    .attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4;})
                    .text(function(d, i){ return piechartnames[i]; });

    console.log(legends);
    */
    
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