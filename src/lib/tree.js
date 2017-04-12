var d3 = require('d3');
var RE = require('./regexp');

require('./tree.css');

module.exports.drawAST = function drawAST(ast) {
    var data = d3.hierarchy(ast);
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");
    svg.selectAll('*').remove();
    var g = svg.append("g").attr("transform", "translate(0,40)");
    

    var tree = d3.tree()
        .size([width, height - 100]);

    var root = d3.hierarchy(data);
    // .sort(function (a, b) { return (a.height - b.height) || a.id.localeCompare(b.id); });

    var link = g.selectAll(".link")
        .data(tree(root).descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", function (d) {
            return "M" + d.x + "," + d.y
                // + "C" + (d.x + d.parent.x) / 2 + "," + d.y
                // + " " + (d.x + d.parent.x) / 2 + "," + d.parent.y
                + " " + d.parent.x + "," + d.parent.y;
        });
    let i = 0;
    var node = g.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", function (d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })

    node.append("circle")
        .attr("r", 2.5);

    node.append("text")
        .attr("dy", 3)
        .attr("x", function (d) { return d.children ? -8 : 8; })
        .style("text-anchor", function (d) { return d.children ? "end" : "start"; })
        .text(function (d) { console.log(d); return d.data.data.name; });
};