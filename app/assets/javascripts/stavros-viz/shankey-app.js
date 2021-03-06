
var myapp = angular.module('myapp', ["highcharts-ng"], function($interpolateProvider) {
        $interpolateProvider.startSymbol('<%');
        $interpolateProvider.endSymbol('%>');
    });

myapp.controller('myctrl', function ($scope) {
    $scope.chartTypes = [
        {"id": "line", "title": "Line"},
        {"id": "spline", "title": "Smooth line"},
        {"id": "area", "title": "Area"},
        {"id": "areaspline", "title": "Smooth area"},
        {"id": "column", "title": "Column"},
        {"id": "pie", "title": "Pie"}
    ];

    $scope.chartArray = [];

    $scope.redrawCharts = function(){
        setTimeout( function(){
            $scope.$broadcast('highchartsng.reflow');
        }, 50 );
    }

    $scope.resize = function(index){
        $scope.chartArray[index].columns = $scope.chartArray[index].columnsTemp;
        $scope.redrawCharts();

    }
    $scope.addChart = function(){
        chart = new Chart();
        $scope.chartArray.push(chart);
        $scope.redrawCharts();
    }

    $scope.removeChart = function(index){
        $scope.chartArray.splice(index,1);
    }

    $scope.createChart = function(index){
        $scope.chartArray[index].config.loading = true;

        $scope.chartArray[index].create($scope);
    }

});

myapp.controller('shankey', function ($scope){

    $scope.data = [];
    $scope.user = 'oana';
    $scope.entity;
    $scope.dataToShow;

    $scope.showData = function(id){

        var idArray = id.split('_');
        $scope.dataToShow = $scope.data.nodes[idArray[0]].data[idArray[1]].entities;

        $scope.$apply();
    }


    $scope.createShankey = function(){

        var units = "Nodes";

        var margin = {top: 10, right: 10, bottom: 10, left: 10};
        var width = 2500 - margin.left - margin.right;
        var height = 2000 - margin.top - margin.bottom;

        var formatNumber = d3.format(",.0f"),    // zero decimal places
            format = function(d) { return formatNumber(d) + " " + units; },
            color = d3.scale.category20();

        // append the svg canvas to the page
        var svg = d3.select("#shankey").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", 
                  "translate(" + margin.left + "," + margin.top + ")");

        // Set the sankey diagram properties
        var sankey = d3.sankey()
            .nodeWidth(10)
            .nodePadding(5)
            .size([width, height]);

        var path = sankey.link();

        var url = "/api/shankey";

        if ($scope.user){
            url = url + '?user=' + $scope.user;
        }

        $.getJSON(url , function(data) {
          
          $scope.data = data;
          console.log(data);

          var graph = {
            links : [],
            nodes : []

          }
          var entitygroup;
          var link;
          var source, target;

          for (i in data.nodes){
             for (j in data.nodes[i].data){
                entitygroup = data.nodes[i].data[j];
                var popup = ""

                for (var z=0; z<5 ;z++){

                  var id = entitygroup.entities[z];
                  if (id){
                    popup += id + "\n";
                  }else{
                    break;
                  }
                }
                popup+= "...";
                graph.nodes.push({
                    node: graph.nodes.length,
                    name:  data.nodes[i].id + '_' + entitygroup.id,
                    text: entitygroup.entities.length + " entities",
                    popup: popup
                    });

             }
          }

          for (id in data.relations){
            link = id.split('-');


            for (i in graph.nodes){
                if (link[0] == graph.nodes[i].name){
                    source = i;
                }else if(link[1] == graph.nodes[i].name){
                    target = i;
                }


            }
            graph.links.push({
                source: parseInt(source),
                target: parseInt(target),
                value: data.relations[id]
            });
          }



          sankey
              .nodes(graph.nodes)
              .links(graph.links)
              .layout(32);

        // add in the links
          var link = svg.append("g").selectAll(".link")
              .data(graph.links)
            .enter().append("path")
              .attr("class", "link")
              .attr("d", path)
              .style("stroke-width", function(d) { return Math.max(1, d.dy); })
              .sort(function(a, b) { return b.dy - a.dy; });

        // add the link titles
          link.append("title")
                .text(function(d) {
                    return d.source.name + " → " + 
                        d.target.name + "\n" + format(d.value); });

        // add in the nodes
          var node = svg.append("g").selectAll(".node")
              .data(graph.nodes)
            .enter().append("g")
              .attr("class", "node")
              .attr("transform", function(d) { 
                  return "translate(" + d.x + "," + d.y + ")"; })
            .call(d3.behavior.drag()
              .origin(function(d) { return d; })
              .on("dragstart", function() { 
                  this.parentNode.appendChild(this); })
              .on("drag", dragmove))
              .on("click", function(d){
                var id = this.childNodes[1].innerHTML;
                console.log(d);
              });

        // add the rectangles for the nodes
          node.append("rect")
              .attr("height", function(d) { return d.dy; })
              .attr("width", sankey.nodeWidth())
              .style("fill", function(d) { 
                  return d.color = color(d.name.replace(/ .*/, "")); })
              .style("stroke", function(d) { 
                  return d3.rgb(d.color).darker(2); })
            .append("title")
              .text(function(d) { 
                  return d.popup });

        // add in the title for the nodes
          node.append("text")
              .attr("x", -6)
              .attr("y", function(d) { return d.dy / 2; })
              .attr("dy", ".35em")
              .attr("text-anchor", "end")
              .attr("transform", null)
              .text(function(d) { return d.text; })
            .filter(function(d) { return d.x < width / 2; })
              .attr("x", 6 + sankey.nodeWidth())
              .attr("text-anchor", "start");

        // the function for moving the nodes
          function dragmove(d) {
            d3.select(this).attr("transform", 
                "translate(" + (
                    d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
                )
                + "," + (
                    d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
                ) + ")");
            sankey.relayout();
            link.attr("d", path);
          }
        });


    }


});