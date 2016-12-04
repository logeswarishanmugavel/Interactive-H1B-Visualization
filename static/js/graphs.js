
var width = 980, height = 650, centered;
var projection = d3.geo.albersUsa().scale(500).translate([ width / 4, height / 3 ]);
var path = d3.geo.path().projection(projection);
var svg = d3.select("#canvas-svg")
            .append("svg")
              .attr("width", width)
              .attr("height", height);


var g = svg.append("g");

var SCALE = 1.7;
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

d3.json("/h1b/alldata", function(error, data) {
	d3.tsv("./static/data/us-state-names.tsv", function(error, names) {
      //  console.log(names);
    for (var i = 0; i < names.length; i++) {
        id_name_map[names[i].id] = names[i];
        short_name_id_map[names[i].code] = names[i].id;
    }
 	//console.log(data);
    data.forEach(function(d) {
 
        var state_id = short_name_id_map[d.employer_state];
        
        statename[state_id] = d.employer_state;
        total_certified_by_state[state_id] = d.certified;
        total_certifiedwithdrawn_by_state[state_id] = d.certifiedwithdrawn;
        total_withdrawn_by_state[state_id] = d.withdrawn;
        total_denied_by_state[state_id] = d.denied;

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
        }).on("click", map_clicked);
        
        g.append("path")
          .datum(topojson.mesh(us, us.objects.states, function(a, b) {return a !== b;}))
          .attr("id", "state-borders")
          .attr("transform", "scale(" + SCALE + ")")
          .attr("d", path);
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
        
        d3.select("#canvas-svg")
        	.append("div")
          	.attr("id", "max_salary");
        $("#max_salary").html("<table><tr><td><h4>Job Title with the Maximum Salary</h4>" + "<h3 id='jobtitlewithmaxsalary-value'><span class='no-data'>No Data</span></h3></td><td><h4>Maximum Salary </h4>" + "<h3 id='max_salary-value'><span class='no-data'>No Data</span></h3></td></tr></table>");
        
        d3.select("#canvas-svg")
        	.append("div")
          	.attr("id", "min_salary");
        $("#min_salary").html("<h4>Minimum Salary </h4>" + "<h3 id='min_salary-value'><span class='no-data'>No Data</span></h3>");
        
        d3.select("#canvas-svg")
          	.append("div")
            .attr("id", "jobtitlewithminsalary");
        $("#jobtitlewithminsalary").html("<h4>Job Title with the Minimum Salary</h4>" + "<h3 id='jobtitlewithminsalary-value'><span class='no-data'>No Data</span></h3>");
        
        d3.select("#canvas-svg")
        	.append("div")
          	.attr("id", "maxcertifiedjobtitle");
        $("#maxcertifiedjobtitle").html("<h4>Job Title with Maximum certifications </h4>" + "<h3 id='maxcertifiedjobtitle-value'><span class='no-data'>No Data</span></h3>" + "<h5>Total certified: <span id='jtmaxno-value'></span></h5>");
        
        d3.select("#canvas-svg")
        	.append("div")
          	.attr("id", "maxcertifiedemployername");
        $("#maxcertifiedemployername").html("<h4>Employer with Maximum certifications </h4>" + "<h3 id='maxcertifiedemployername-value'><span class='no-data'>No Data</span></h3>" + "<h5>Total certified: <span id='enmaxno-value'></span></h5>");
        

        $("#state-select").val(0);
        var topo = id_topo_map[0];
        map_clicked(topo);
    });
});
});
    
function map_clicked(d) {
    if (d) {
        $('#statenamevalue').html(short_name_id_map[d.id]);
        console.log(d);
        drawpiechart(d);
        $("#state-select").val(d.id);
        if (max_salary_by_state[d.id]) {
            $("#max_salary-value").html(max_salary_by_state[d.id]);
            $("#jobtitlewithmaxsalary-value").html(job_title_with_max_salary_by_state[d.id]);
            $("#min_salary-value").html(min_salary_by_state[d.id]);
            $("#jobtitlewithminsalary-value").html(job_title_with_min_salary_by_state[d.id]);
            $("#maxcertifiedjobtitle-value").html(max_certified_job_title_by_state[d.id]);
            $("#maxcertifiedemployername-value").html(max_certified_employer_name_by_state[d.id]);
            $("#jtmaxno-value").html(total_certified_job_title_by_state[d.id]);
            $("#enmaxno-value").html(total_certified_employer_name_by_state[d.id]);
            } 
            else {
            $("#max_salary-value").html("<span class='no-data'>No Data</span>");
            $("#jobtitlewithmaxsalary-value").html("<span class='no-data'>No Data</span>");
            $("#min_salary-value").html("<span class='no-data'>No Data</span>");
            $("#jobtitlewithminsalary-value").html("<span class='no-data'>No Data</span>");
            $("#maxcertifiedjobtitle-value").html("<span class='no-data'>No Data</span>");
            $("#maxcertifiedemployername-value").html("<span class='no-data'>No Data</span>");
            $("#jtmaxno-value").html("");
            $("#enmaxno-value").html("");
        	}
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
        g.selectAll("path").classed("active", centered && function(d) {
            return d === centered;
        });
    }
}

function drawpiechart(d){
    if (total_certified_by_state[d.id]) {
    //console.log("drawing pie chart");
    //console.log(d);
    
    $('#pie-chart').html("");
    var data = [{"name":"CERTIFIED","value":total_certified_by_state[d.id]},{"name":"WITHDRAWN","value":total_withdrawn_by_state[d.id]},{"name":"CERTIFIEDWITHDRAWN","value":total_certifiedwithdrawn_by_state[d.id]},{"name":"DENIED","value":total_denied_by_state[d.id]}];
    //console.log(data);

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

    var svg = d3.select("#pie-chart").append("svg")
        .attr('class','pie-chartclass')
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.name); })
        .on("mouseover",setCenterText)
        .on("mouseout",resetCenterText);

/*
    g.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.data.value; });
    */
    g.append('text')
        .attr('class', 'statenamevalue')
        .attr('text-anchor', 'middle')
        .style('font-size','30px')
        .style('font-family','Helvetica')
        .style('fill','brown');

     g.select(".statenamevalue")
            .text(id_name_map[d.id].name);

    g.append('text')
        .attr('class', 'center-txtname')
        .attr('y', '25px')
        .attr('text-anchor', 'middle')
        .style('font-size','15px')
        .style('font-family','Helvetica')
        .style('fill','blue');

    g.append('text')
        .attr('class', 'center-txtvalue')
        .attr('y', '50px')
        .attr('text-anchor', 'middle')
        .style('font-size','20px')
        .style('font-family','Helvetica')
        .style('fill','red');
        ;
    /*
    d3.select("#pie-chart")
            .append("div")
            .attr("id", "center-txtvalue");

    */

    var piechartnames = ['CERTIFIED','WITHDRAWN','CERTIFIEDWITHDRAWN','DENIED'];
    
    var legends = g.select('.legend')
                    .selectAll('g')
                                .data(piechartnames)
                            .enter().append('g')
                                .attr('transform', function(d, i) {
                                    return 'translate(' + (i * 150 + 50) + ', 10)';
                                });
    
            legends.append('circle')
                .attr('class', 'legend-icon')
                .attr('r', 6)
                .style('fill', function(d, i) {
                    return color(i);
                });
    
            legends.append('text')
                .attr('dx', '1em')
                .attr('dy', '.3em')
                .text(function(d) {
                    return d;
                });

    function setCenterText(d){
        g.select(".center-txtname")
            .text(d.data.name);
        g.select(".center-txtvalue")
            .text(d.data.value);
    }
    function resetCenterText(d){
        g.select(".center-txtname")
            .text("Hover to see values");
         g.select(".center-txtvalue")
            .text("");
    }
    }
    else
    {
        $('#pie-chart').html("No Data");

    }
}