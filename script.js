// slide 1

async function slide_1_init() {
    mouse1 = false
    slide_1_data()
}

async function slide_1_data() {

    var epsdata = await d3.csv("data/epsdata.csv");

    var svg = d3.select("svg.svg-content-responsive")

    var width = parseInt(svg.style('width'), 10)
    var height = parseInt(svg.style('height'), 10)
    var width_margin = 0.05 * width
    var height_margin = 0.05 * height

    var lineOpacity = "0.85";
    var lineStroke = "1.5px";

    var xs = d3.scaleLinear().domain([1, 12]).range([0,width - 3 * width_margin])
    var ys = d3.scaleLinear().domain([90,0]).range([height - 4 * height_margin,0])

    var sumstat = d3.nest()
    .key(function(d) { return d.name;})
    .entries(epsdata);

    // from https://d3-graph-gallery.com/graph/interactivity_tooltip.html#position
    var datapoint_tooltip = d3.select("#tooltip")
        .style("position", "absolute")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "5px")

    svg.append("g").attr("transform", "translate("+2 * width_margin+","+2*height_margin+")")
        .selectAll("line")
        .data(sumstat)
        .enter()
        .append("path")
        .attr("d", function (d) {
            return d3.line()
                .x(d => xs(+d.episode))
                .y(d => ys(+d.ranking)).curve(d3.curveLinear)
                (d.values)
        })
        .attr("fill", "none")
        .attr("stroke", function(d) {
            return d.values[0].color; })
        .attr("class", function(d) {
            return 'line line_'+d.values[0].color; })
        .attr("stroke-width", lineStroke).style('opacity', lineOpacity)
        .on("mouseover", function(d) {
            if (mouse1) {
                mouseOver(d.values[0].color)
            }
        })
        .on("mouseout", function(d){
            if (mouse1) {
                mouseOut()
            }
        });
    
    svg.append('g').attr("transform", "translate("+2 * width_margin+","+2*height_margin+")")
        .selectAll("circle")
        .data(epsdata)
        .enter()
        .append("circle").attr("class", function(d) {
            return 'circle circle_'+d.color
        })
        .attr("cx", function (d) { return xs(+d.episode); } )
        .attr("cy", function (d) { return ys(+d.ranking); } )
        .attr("r", 3)
        .attr("fill", function(d) { return d.color; })
        .on("mouseover", function(d) {
            if (mouse1) {
                datapoint_tooltip
                .style("opacity", 1)
                .html("<p>Member: " + d.name + "</p><p>Epidsode: " + d.episode + ", Rank: " + d.ranking + "</p>")
                .style("right", (width - 2 * width_margin - d3.mouse(this)[0]) + "px")
                .style("top", (d3.mouse(this)[1]) + 3 * height_margin + "px")
                mouseOver(d.color)
            }
        })
        .on("mouseout", function(d) {
            if (mouse1) {
                datapoint_tooltip.style("opacity", 0)
                mouseOut()
            }
        })
    
    svg.append("g").attr("transform", "translate("+2 * width_margin+","+ 2*height_margin+")")
        .call(d3.axisLeft(ys).ticks(10))
    svg.append("g").attr("transform", "translate("+2 * width_margin+","+(height-2*height_margin)+")")
        .call(d3.axisBottom(xs).ticks(12))

    svg.selectAll(".tick").style("font-size", "0.5vw")

    svg.append("text").attr("x", width/2 + width_margin).attr("y", height_margin).style("font-size", "large")
        .attr("text-anchor", "middle").classed("chart-title", true).text("Jo1 Member Rankings During Produce 101");
    
    svg.append("text").attr("text-anchor", "end").style("font-size", "0.8vw")
        .attr("x", - height / 2 + height_margin).attr("y", width_margin)
        .attr("transform", "rotate(-90)")
        .classed("chart-axes", true).text("Ranking");

    svg.append("text").attr("text-anchor", "middle").style("font-size", "0.8vw")
        .attr("x", width / 2 + width_margin).attr("y", height - height_margin)
        .classed("chart-axes", true).text("Episodes");

    svg.append('g').classed("legend", true)
        .selectAll("text")
        .data(sumstat)
        .enter()
        .append("text")
        .attr("x", width * 9 / 16)
        .attr("y", function(d, i) {
            return (i * 20) + (height - height_margin) / 2;
        })
        .style("fill", function(d) {
            return d.values[0].color;
        })
        .style("font-size", "small")
        .attr("class", function (d) {
            return "text_" + d.values[0].color;
        })
        .text(function(d) {
            return d.values[0].name + ", final rank " + d.values[8].ranking;
        })
        .on("mouseover", function(d) {
            if (mouse1) {
                mouseOver(d.values[0].color)
            }
            
        })
        .on("mouseout", function(d) {
            if (mouse1) {
                mouseOut()
            }
        });

    svg.attr("width", width).attr("height", height).call(responsivefy)
}

function next1() {
    if (!mouse1) {
        mouse1 = true
        document.getElementById('1').innerHTML = "The chart on the right shows the ranks of the final top 11 members throughout the show. <u> Hover over a name or line to focus on the member's ranks during the show. Hover over a point for details</u>."
        document.getElementById('2').innerHTML = "There were three rounds of online voting and the total number of votes each constestant accumulated during each voting period was only disclosed during the elimination episodes, which were episodes 5, 8, and 11."
        document.getElementById('3').innerHTML = "Episodes 4, 7, and 10 only included rankings of constestants based on the number of votes they received during live performaces as opposed to online voting, thus the data was excluded."
        document.getElementById('link').style.display = 'none'
        document.getElementById('previous').style.visibility = 'visible'
    } else {
        window.location.replace("slide2.html");
    }
    
}

function prev1() {
    mouse1 = false
    document.getElementById('1').innerHTML = "\"Produce 101 Japan is a 2019 Japanese reality competition show and a spin-off of the South Korean television series Produce 101. The show followed 101 trainees with the intention of producing an 11-member boy band. The members, group name, and concepts were selected by viewers, referred to as \"national producers\"."
    document.getElementById('2').innerHTML = "\"The series was first announced in April 2019, premiered on September 25, 2019, and ran for 12 episodes with the last episode airing on December 11, 2019.\""
    document.getElementById('3').innerHTML = "\"The final top 11 members debuted as the permanent group, JO1.\""
    document.getElementById('link').style.display = 'inline-block'
    document.getElementById('previous').style.visibility = 'hidden'
}

// slide 2

slide2 = false

async function slide_2_init() {
    slide2 = true
    slide3 = false
    trendlines = false
    annotations = true
    document.getElementById('dropdown').style.display = 'none'
    // document.getElementById("myDropdown").style.visibility = "hidden";
    slide_2_data(trendlines, annotations)
}

async function slide_2_data(trendlines, annotations) {

    var twtdata = await d3.csv("data/tweetData.csv");

    data = twtdata.filter(function(d) {
        return (new Date(d.UTC).getTime() <= new Date('March 3, 2020 15:00:00').getTime())
    })

    const min_date = new Date('Dec 10, 2019 15:00:00')
    const max_date = new Date('March 5, 2020 15:00:00')

    var svg = d3.select("svg.svg-content-responsive")

    var width = parseInt(svg.style('width'), 10)
    var height = parseInt(svg.style('height'), 10)
    var width_margin = 0.05 * width
    var height_margin = 0.05 * height

    var datapoint_tooltip = d3.select("#tooltip")
        .style("position", "absolute")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "5px")

    var xs = d3.scaleTime().domain([min_date, max_date]).range([0,width - 3 * width_margin])
    var ys = d3.scaleLinear().domain([5000,78000]).range([height - 4 * height_margin,0])
    
    if (annotations) {
        var debut = data[data.length-1]

        const annotations = [
            {
            note: {
                label: "Official announcement of the group's debut single, titled \"Protostar\", and their debut date, March 4, 2020",
                title: "January 29, 2020",
                wrap: 200,  // try something smaller to see text split in several lines
                padding: 10   // More = text lower
                
            },
            color: ["#f4b83c"],
            x: xs(new Date("2020-01-28T15:00:00.000Z")) + 2 * width_margin,
            y: ys(71023) + 2 * height_margin,
            dy: 50,
            dx: 50,
            type: d3.annotationCalloutCircle
            },
            {
                note: {
                    label: "First tweet by the official Twitter account",
                    title: "December 11, 2019",
                    wrap: 200,  // try something smaller to see text split in several lines
                    padding: 10   // More = text lower
                    
                },
                color: ["#f4b83c"],
                x: xs(new Date(debut.UTC))+ 2 * width_margin,
                y: ys(debut.Favorites)+2 * height_margin,
                dy: -20,
                dx: 50,
                type: d3.annotationCalloutCircle
            },
            {
                note: {
                    label: "First individual member posts on the account",
                    title: "December 25, 2019",
                    wrap: 200,  // try something smaller to see text split in several lines
                    padding: 10   // More = text lower
                    
                },
                subject: {
                    height: ys(17000) - ys(27000),
                    width: xs(new Date("12/26/2019")) - xs(new Date("12/24/2019"))
                },
                color: ["#f4b83c"],
                x: xs(new Date("12/24/2019")) + 2 * width_margin,
                y: ys(27000) + 2 * height_margin,
                dy: 25,
                dx: 20,
                type: d3.annotationCalloutRect
            }
        ]
    
        const makeAnnotations = d3.annotation().annotations(annotations)
        svg.append("g").classed("annotations", true).call(makeAnnotations)

        svg.selectAll(".annotation-note-title").style("font-size", "small")
        svg.selectAll(".annotation-note-label").style("font-size", "0.7vw")
    }

    svg.append("g").attr("transform", "translate("+2 * width_margin+","+ 2*height_margin+")").call(d3.axisLeft(ys))
    svg.append("g").attr("transform", "translate("+2 * width_margin+","+(height-2*height_margin)+")")
        .call(d3.axisBottom(xs).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat("%b%y")))

    svg.selectAll(".tick").style("font-size", "0.5vw")

    svg.append("text").attr("x", width/2 + width_margin).attr("y", height_margin).style("font-size", "large")
        .attr("text-anchor", "middle").classed("chart-title", true).text("Tweet Engagement Pre Debut");
    
    svg.append("text").attr("text-anchor", "end").style("font-size", "0.8vw")
        .attr("x", - height / 2 + height_margin).attr("y", width_margin)
        .attr("transform", "rotate(-90)")
        .classed("chart-axes", true).text("Likes");
    svg.append("text").attr("text-anchor", "middle").style("font-size", "0.8vw")
        .attr("x", width / 2 + width_margin).attr("y", height - height_margin)
        .classed("chart-axes", true).text("Month Year");

    svg.append("g").attr("transform", "translate("+2 * width_margin+","+2*height_margin+")")
        .selectAll("circle").data(data).enter().append("circle")
        .attr("class", function (d) {
            return "datacircle circle_" + d.color
        })
        .attr("cx", function(d) {return xs(new Date(d.UTC));})
        .attr("cy", function(d) {return ys(+d.Favorites);})
        .attr("r", 2).attr("fill", function(d){ return d.color})
        .on("mouseover", function(d) {
        
            datapoint_tooltip
                .style("opacity", 1)
                .html("<p>Posted by: " + d.member + "</p><p>Likes: " + d.Favorites + ", Retweets: " + d.Retweets + "</p><p>Date: " + new Date(d.UTC).toLocaleString('en-US',{timeZone: 'JST'}) + " JST</p>")
                .style("right", (width - 2 * width_margin - d3.mouse(this)[0]) + "px")
                .style("top", (d3.mouse(this)[1]) + 3 * height_margin + "px")
            d3.select(this).style("cursor", "pointer");
            
            if (!trendlines) {    

                var circleOpacity = '0.85';
                var circleOpacityOnLineHover = "0.25"

                d3.selectAll('.datacircle')
                    .style('opacity', circleOpacityOnLineHover);
                d3.selectAll('.circle_' + d.color)
                    .style("opacity", circleOpacity)
                    .attr("r", 3)
            }
        })
        .on("mouseleave", function(d) {
            datapoint_tooltip.style("opacity", 0)

            if (!trendlines) {

                d3.select(this).style("stroke", "none").style("opacity", 0.8)

                var circleOpacity = '0.85';

                d3.selectAll('.datacircle')
                    .style('opacity', circleOpacity)
                    .attr("r", 2)
            }
        })

    if (trendlines) {
        var sumstat = d3.nest()
        .key(function(d) { return d.member;})
        .entries(data);

        svg.append("g").attr("transform", "translate("+2 * width_margin+","+2*height_margin+")")
            .selectAll("line")
            .data(sumstat)
            .enter()
            // from http://bl.ocks.org/benvandyke/8459843
            // and http://bl.ocks.org/milroc/4254604 
            .each(function(d, i) {
                var xLabels = d.values.map(function (d) { return new Date(d.UTC)});
                var xSeries = d3.range(1, xLabels.length + 1);
                var ySeries = d.values.map(function(d) { return +d.Favorites; });
                
                var leastSquaresCoeff = leastSquares(xSeries, ySeries);
                
                // apply the reults of the least squares regression
                var x1 = xLabels[0];
                var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
                var x2 = xLabels[xLabels.length - 1];
                var y2 = leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1];
                var trendData = [[x1,y1,x2,y2]];

                var decimalFormat = d3.format("0.2f");
                    
                d3.select(this).data(trendData)
                    .append("line")
                    .attr("class", function() {
                        return "trendline line_" + d.values[0].color
                    })
                    .attr("x1", function(d) { return xs(d[0]); })
                    .attr("y1", function(d) { return ys(d[1]); })
                    .attr("x2", function(d) { return xs(d[2]); })
                    .attr("y2", function(d) { return ys(d[3]); })
                    .attr("stroke", d.values[0].color)
                    .attr("stroke-width", 2)
                svg.append("text").text(d.key)
                    .attr("class", function() {return "lsqtext text_" + d.values[0].color})
                    .attr("x", function(d) {return width / 2 + 3 * width_margin})
                    .attr("y", function(d) {return height / 2 + 5 * height_margin;})
                    .attr("fill", d.values[0].color)
                    .style("font-size", "0.7vw")
                    .style("opacity", 0);
                svg.append("text")
                    .text("Least Squares Equation: " + decimalFormat(leastSquaresCoeff[0] * -1) + "x + " + decimalFormat(leastSquaresCoeff[1]))
                    .attr("class", function() {return "lsqtext text_" + d.values[0].color})
                    .attr("x", function(d) {return width / 2 + 3 * width_margin})
                    .attr("y", function(d) {return height / 2 + 5.5 * height_margin;})
                    .attr("fill", d.values[0].color)
                    .style("font-size", "0.7vw")
                    .style("opacity", 0);
            })
    }

    svg.attr("width", width).attr("height", height).call(responsivefy)
}

function prev2() {
    if (annotations && !trendlines) {
        window.location.replace("index.html");
    } else {
        var svg = d3.select("svg.svg-content-responsive")
        svg.selectAll('.trendline').remove()

        annotations = true
        trendlines = false
        slide_2_data(trendlines, annotations, filter=null)

        document.getElementById('1').innerHTML = "After Produce 101 Japan concluded on December 11, 2019, the official twitter account for the final group was revealed to be <a class=\"info\" href=\"https://twitter.com/official_jo1\">@official_jo1</a>."
        document.getElementById('2').innerHTML = "Following the end of the show, members of the newly-formed group JO1 traveled to South Korea to prepare for their official debut. As a result, the official twitter account had brief periods of inactivity during this time."
        document.getElementById('3').style.display = 'block'
        document.getElementById('dropdown').style.display = 'none'
    }
}

function next2() {
    if (annotations && !trendlines) {
        var svg = d3.select("svg.svg-content-responsive")
        svg.selectAll('.annotations').remove()

        annotations = false
        trendlines = true
        slide_2_data(trendlines, annotations, filter=null)

        document.getElementById('1').innerHTML = "Here are trendlines that show tweet engagement of the account based on number of likes as a function of time during this period. The trendlines are calculated using the least squares method."
        document.getElementById('2').innerHTML = "<u>Click on a button below to focus on the corresponding member's tweets. Click anywhere else to unfocus.</u> Tweets that contain 2 or more members are assigned to the member with the higher debut rank. Tweets that contain all or no members fall into the \"group\" category."
        document.getElementById('3').style.display = 'none'
        document.getElementById('dropdown').style.display = 'flex'
    } else {
        slide2 = false
        window.location.replace("slide3.html");
    } 
}

// slide 3

slide3 = false

async function slide_3_init() {
    slide2 = false
    slide3 = true
    trendlines = false
    document.getElementById('dropdown').style.display = 'none'
    slide_3_data(trendlines)
}

async function slide_3_data(trendlines) {

    var twtdata = await d3.csv("data/tweetData.csv");

    data = twtdata.filter(function(d) {
        return (new Date(d.UTC).getTime() >= new Date('March 3, 2020 15:00:00').getTime())
    })

    const min_date = new Date('March 1, 2020 15:00:00')
    const max_date = new Date(data[0].UTC)


    var svg = d3.select("svg.svg-content-responsive")

    var width = parseInt(svg.style('width'), 10)
    var height = parseInt(svg.style('height'), 10)
    var width_margin = 0.05 * width
    var height_margin = 0.05 * height

    var datapoint_tooltip = d3.select("#tooltip")
        .style("position", "absolute")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "5px")

    var xs = d3.scaleTime().domain([min_date, max_date]).range([0,width - 3 * width_margin])
    var ys = d3.scaleLinear().domain([5000,78000]).range([height - 4 * height_margin,0])

    const annotations = [
        {
        note: {
            label: "Jan 29, 2020 - Jun 21, 2020",
            title: "Protostar",
            wrap: 100,  // try something smaller to see text split in several lines
            padding: 10   // More = text lower
            
        },
            subject: {
                height: height - 4 * height_margin,
                width: xs(new Date("6/21/2020")) - xs(new Date(min_date))
            },
            color: ["#716989"],
            x: xs(new Date(min_date)) + 2 * width_margin,
            y: 2 * height_margin,
            dx: 5,
            dy: 40,
            type: d3.annotationCalloutRect
        },
        {
            note: {
                label: "Jun 21, 2020 - Oct 4, 2020",
                title: "Stargazer",
                wrap: 100,  // try something smaller to see text split in several lines
                padding: 10   // More = text lower
                
            },
            subject: {
                height: height - 4 * height_margin,
                width: xs(new Date("10/4/2020")) - xs(new Date("6/21/2020"))
            },
            color: ["#50808f"],
            x: xs(new Date("6/21/2020")) + 2 * width_margin,
            y: 2 * height_margin,
            dx: 5,
            dy: 40,
            type: d3.annotationCalloutRect
        },
        {
            note: {
                label: "Oct 4, 2020 - Feb 20, 2021",
                title: "The Star",
                wrap: 100,  // try something smaller to see text split in several lines
                padding: 10   // More = text lower
                
            },
            subject: {
                height: height - 4 * height_margin,
                width: xs(new Date("2/20/2021")) - xs(new Date("10/4/2020")),
            },
            color: ["#d6c0f8"],
            x: xs(new Date("10/4/2020")) + 2 * width_margin,
            y: 2 * height_margin,
            dx: 5,
            dy: 40,
            type: d3.annotationCalloutRect
        },
        {
            note: {
                label: "Feb 20, 2021 - Jun 8, 2021",
                title: "Challenger",
                wrap: 100,  // try something smaller to see text split in several lines
                padding: 10   // More = text lower
                
            },
            subject: {
                height: height - 4 * height_margin,
                width: xs(new Date("6/8/2021")) - xs(new Date("2/20/2021"))
            },
            color: ["#1c4651"],
            x: xs(new Date("2/20/2021")) + 2 * width_margin,
            y: 2 * height_margin,
            dx: 5,
            dy: 40,
            type: d3.annotationCalloutRect
        },
        {
            note: {
                label: "Jun 8, 2021 - Oct 10, 2021",
                title: "Stranger",
                wrap: 100,  // try something smaller to see text split in several lines
                padding: 10   // More = text lower
                
            },
            subject: {
                height: height - 4 * height_margin,
                width: xs(new Date("10/10/2021")) - xs(new Date("6/8/2021"))
            },
            color: ["#2b536c"],
            x: xs(new Date("6/8/2021")) + 2 * width_margin,
            y: 2 * height_margin,
            dx: 5,
            dy: 40,
            type: d3.annotationCalloutRect
        },
        {
            note: {
                label: "Oct 10, 2021 - Mar 22, 2022",
                title: "Wandering",
                wrap: 100,  // try something smaller to see text split in several lines
                padding: 10   // More = text lower
                
            },
            subject: {
                height: height - 4 * height_margin,
                width: xs(new Date("3/22/2022")) - xs(new Date("10/10/2021"))
            },
            color: ["#888184"],
            x: xs(new Date("10/10/2021")) + 2 * width_margin,
            y: 2 * height_margin,
            dx: 5,
            dy: 40,
            type: d3.annotationCalloutRect
        },
        {
            note: {
                label: "Mar 22, 2022 - Present",
                title: "Kizuna",
                wrap: 100,  // try something smaller to see text split in several lines
                padding: 10   // More = text lower
                
            },
            subject: {
                height: height - 4 * height_margin,
                width: xs(new Date(max_date)) - xs(new Date("3/22/2022")),
            },
            color: ["#9abcdd"],
            x: xs(new Date("3/22/2022")) + 2 * width_margin,
            y: 2 * height_margin,
            dx: 5,
            dy: 40,
            type: d3.annotationCalloutRect
        }
    ]

    const makeAnnotations = d3.annotation().annotations(annotations)
    svg.append("g").classed("annotations", true).call(makeAnnotations)

    svg.selectAll(".subject").attr("fill-opacity", 0)
    svg.selectAll(".annotation-note-label").style("font-size", "0.7vw")
    svg.selectAll(".annotation-note-title").style("font-size", "small")

    svg.append("g").attr("transform", "translate("+2 * width_margin+","+ 2*height_margin+")").call(d3.axisLeft(ys))
    svg.append("g").attr("transform", "translate("+2 * width_margin+","+(height-2*height_margin)+")")
        .call(d3.axisBottom(xs).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat("%b%y")))

    svg.selectAll(".tick").style("font-size", "0.5vw")

    svg.append("text").attr("x", width/2 + width_margin).attr("y", height_margin).style("font-size", "large")
        .attr("text-anchor", "middle").classed("chart-title", true).text("Tweet Engagement Post Debut");
    
    svg.append("text").attr("text-anchor", "end").style("font-size", "0.8vw")
        .attr("x", - height / 2 + height_margin).attr("y", width_margin)
        .attr("transform", "rotate(-90)")
        .classed("chart-axes", true).text("Likes");

    svg.append("text").attr("text-anchor", "middle").style("font-size", "0.8vw")
        .attr("x", width / 2 + width_margin).attr("y", height - height_margin)
        .classed("chart-axes", true).text("Month Year");

    svg.append("g").attr("transform", "translate("+2 * width_margin+","+2*height_margin+")")
        .selectAll("circle").data(data).enter().append("circle")
        .attr("class", function (d) {
            return "datacircle circle_" + d.color
        })
        .attr("cx", function(d) {return xs(new Date(d.UTC));})
        .attr("cy", function(d) {return ys(+d.Favorites);})
        .attr("r", 1.5).attr("fill", function(d){ return d.color})
        .on("mouseover", function(d) {
            datapoint_tooltip
                .style("opacity", 1)
                .html("<p>Posted by: " + d.member + "</p><p>Likes: " + d.Favorites + ", Retweets: " + d.Retweets + "</p><p>Date: " + new Date(d.UTC).toLocaleString('en-US',{timeZone: 'JST'}) + " JST</p>")
                .style("right", (width - 2 * width_margin - d3.mouse(this)[0]) + "px")
                .style("top", (d3.mouse(this)[1]) + 3 * height_margin + "px")
            d3.select(this).style("cursor", "pointer");

            if (!trendlines) {    

                var circleOpacity = '0.85';
                var circleOpacityOnLineHover = "0.25"

                d3.selectAll('.datacircle')
                    .style('opacity', circleOpacityOnLineHover);
                d3.selectAll('.circle_' + d.color)
                    .style("opacity", circleOpacity)
                    .attr("r", 2)
            }
            
        })
        .on("mouseleave", function(d) {
            datapoint_tooltip.style("opacity", 0)
            if (!trendlines) {
                d3.select(this)
                    .style("stroke", "none")
                    .style("opacity", 0.8)
                
                var circleOpacity = '0.85';

                d3.selectAll('.datacircle')
                    .style('opacity', circleOpacity)
                    .attr("r", 1.5)
            }
        })

    if (trendlines) {
        var sumstat = d3.nest()
        .key(function(d) { return d.member;})
        .entries(data);

        svg.append("g").attr("transform", "translate("+2 * width_margin+","+2*height_margin+")")
            .selectAll("line")
            .data(sumstat)
            .enter()
            .append("g")
            // from http://bl.ocks.org/benvandyke/8459843
            // and http://bl.ocks.org/milroc/4254604 
            .each(function(d, i) {
                var xLabels = d.values.map(function (d) { return new Date(d.UTC)})
                var xSeries = d3.range(1, xLabels.length + 1);
                var ySeries = d.values.map(function(d) { return +d.Favorites; });
                
                var leastSquaresCoeff = leastSquares(xSeries, ySeries);
                
                // apply the reults of the least squares regression
                var x1 = xLabels[0];
                var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
                var x2 = xLabels[xLabels.length - 1];
                var y2 = leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1];
                var trendData = [[x1,y1,x2,y2]];

                var decimalFormat = d3.format("0.2f");
                    
                d3.select(this).data(trendData)
                    .append("line")
                    .attr("class", function() {
                        return "trendline line_" + d.values[0].color
                    })
                    .attr("x1", function(d) { return xs(d[0]); })
                    .attr("y1", function(d) { return ys(d[1]); })
                    .attr("x2", function(d) { return xs(d[2]); })
                    .attr("y2", function(d) { return ys(d[3]); })
                    .attr("stroke", d.values[0].color)
                    .attr("stroke-width", 2);
                
                svg.append("text").text(d.key)
                    .attr("class", function() {return "lsqtext text_" + d.values[0].color})
                    .attr("x", function(d) {return 4.3 * width_margin})
                    .attr("y", function(d) {return height / 2 - 4.5 * height_margin;})
                    .attr("fill", d.values[0].color)
                    .style("font-size", "0.7vw")
                    .style("opacity", 0);

                svg.append("text")
                    .text("Least Squares Equation: " + decimalFormat(leastSquaresCoeff[0] * -1) + "x + " + decimalFormat(leastSquaresCoeff[1]))
                    .attr("class", function() {return "lsqtext text_" + d.values[0].color})
                    .attr("x", function(d) {return 4.3 * width_margin})
                    .attr("y", function(d) {return height / 2 - 4 * height_margin;})
                    .attr("fill", d.values[0].color)
                    .style("font-size", "0.7vw")
                    .style("opacity", 0);
            })
        }

    svg.attr("width", width).attr("height", height).call(responsivefy)
}

function prev3() {
    if (!trendlines) {
        window.location.replace("slide2.html");
    } else {
        trendlines = false
        d3.select('svg').selectAll('.trendline').remove()
        document.getElementById("1").innerHTML = "The plot on the right presents all tweets by the official twitter account after the group's debut, March 4, 2020, up until when the account's twitter data was retrieved on July 10, 2022."
        document.getElementById("2").innerHTML = "The plot also illustrates different periods of the group's music releases marked by the different columns, which states the name of each album as well as the dates during which it was promoted."
        document.getElementById('3').style.display = 'block'
        document.getElementById('dropdown').style.display = 'none'
    }
}

function next3() {
    if (!trendlines) {
        trendlines = true
        slide_3_data(trendlines)
        document.getElementById("1").innerHTML = "Here are trendlines that show tweet engagement of the account based on number of likes as a function of time during this period. The trendlines are, once again, calculated using the least squares method."
        document.getElementById("2").innerHTML = "Same as before, <u>click on a button below to focus on the corresponding member's tweets and click anywhere else to unfocus.</u> Tweets that contain 2 or more members are assigned to the member with the higher debut rank. Tweets that contain all or no members fall into the \"group\" category."
        document.getElementById('3').style.display = 'none'
        document.getElementById('dropdown').style.display = 'flex'
    }
    else {
        window.location.replace("conclusion.html");
    }
}

// slide 4

function prev4() {
    window.location.replace("slide3.html");
}

function next4() {
    window.location.replace("index.html");
}

// utils

function filterMember(membercolor) {
    var lineOpacityHover = "1";
    var otherLinesOpacityHover = "0.1";
    var lineStrokeHover = "2.5px";

    var circleOpacity = '0.85';
    var circleOpacityOnLineHover = "0.1"

    d3.selectAll('.trendline')
        .style('opacity', otherLinesOpacityHover);
    d3.selectAll('.datacircle')
        .style('opacity', circleOpacityOnLineHover);
    d3.selectAll('.circle_' + membercolor)
        .style("opacity", circleOpacity)
        .attr("r", 3)
    d3.select('.line_' + membercolor)
        .style('opacity', lineOpacityHover)
        .style("stroke-width", lineStrokeHover)
    d3.selectAll('.lsqtext')
        .style('opacity', 0)
    d3.selectAll('.text_' + membercolor)
        .style('opacity', 1)
}

// based on https://codepen.io/zakariachowdhury/pen/JEmjwq

function mouseOver(color) {
    
    var lineOpacityHover = "1";
    var otherLinesOpacityHover = "0.1";
    var lineStrokeHover = "2.5px";

    var circleOpacity = '0.85';
    var circleOpacityOnLineHover = "0.25"

    d3.selectAll('.line')
        .style('opacity', otherLinesOpacityHover);
    d3.selectAll('.circle')
        .style('opacity', circleOpacityOnLineHover);
    d3.selectAll('.circle_'+color)
        .style("opacity", circleOpacity)
        .attr("r", 5)
    d3.selectAll('.line_' + color)
        .style('opacity', lineOpacityHover)
        .style("stroke-width", lineStrokeHover)
    d3.select('.text_' + color).style("font-weight", "bold")
}

function mouseOut() {
    var lineOpacity = "0.85";
    var lineStroke = "1.5px";
    var circleOpacity = '0.85';

    d3.selectAll(".line")
        .style('opacity', lineOpacity)
        .style("stroke-width", lineStroke);
    d3.selectAll('.circle')
        .style('opacity', circleOpacity)
        .attr("r", 3)
    d3.select('.legend').selectAll('text').style("font-weight", "normal")
}

// from http://bl.ocks.org/benvandyke/8459843

function leastSquares(xSeries, ySeries) {
		var reduceSumFunc = function(prev, cur) { return prev + cur; };
		
		var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
		var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

		var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
			.reduce(reduceSumFunc);
		
		var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
			.reduce(reduceSumFunc);
			
		var ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
			.reduce(reduceSumFunc);
			
		var slope = ssXY / ssXX;
		var intercept = yBar - (xBar * slope);
		var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);
		
		return [slope, intercept, rSquare];
	}

// from https://benclinkinbeard.com/d3tips/make-any-chart-responsive-with-one-function/
function responsivefy(svg) {
    // container will be the DOM element
    // that the svg is appended to
    // we then measure the container
    // and find its aspect ratio
    const container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style('width'), 10),
        height = parseInt(svg.style('height'), 10),
        aspect = width / height;
   
    // set viewBox attribute to the initial size
    // control scaling with preserveAspectRatio
    // resize svg on inital page load
    svg.attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMinYMid')
        .call(resize);
   
    // add a listener so the chart will be resized
    // when the window resizes
    // multiple listeners for the same event type
    // requires a namespace, i.e., 'click.foo'
    // api docs: https://goo.gl/F3ZCFr
    d3.select(window).on(
        'resize.' + container.attr('id'), 
        resize
    );
   
    // this is the code that resizes the chart
    // it will be called on load
    // and in response to window resizes
    // gets the width of the container
    // and resizes the svg to fill it
    // while maintaining a consistent aspect ratio
    function resize() {
        const w = parseInt(container.style('width'));
        svg.attr('width', w);
        svg.attr('height', Math.round(w / aspect));
    }
  }

  window.onclick = function(event) {
    if ((slide2 || slide3) && !event.target.matches('.dropbtn')) {
        var lineOpacity = "0.85";
        var lineStroke = "1.5px";
        var circleOpacity = '0.85';

        d3.selectAll('.trendline')
            .style('opacity', lineOpacity)
            .style("stroke-width", lineStroke)

        if (slide2) {
            d3.selectAll('.datacircle')
            .style('opacity', circleOpacity)
            .attr("r", 2)
        } else {
            d3.selectAll('.datacircle')
            .style('opacity', circleOpacity)
            .attr("r", 1.5)
        }
        
        d3.selectAll('.lsqtext')
            .style('opacity', 0)
    }
  }