const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

req = new XMLHttpRequest();
req.open('GET', url, true);
req.send();
req.onload = () => {
    req = JSON.parse(req.responseText);

    const dataset = req;

    const width = 800;
    const height = 500;
    const margin = 40;

    const xScale = d3.scaleLinear()
        .domain([d3.min(dataset, (d) => d.Year - 1), d3.max(dataset, (d) => d.Year + 1)])
        .range([margin, width - margin]);


    dataset.forEach((d) => {
        const parsedTime = d.Time.split(':');
        d.Time = new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));
    })


    const yScale = d3.scaleTime()
        .domain(d3.extent(dataset, (d) => d.Time))
        .range([8, height - margin]);

    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('d'));

    const timeFormat = d3.timeFormat('%M:%S')
    const yAxis = d3.axisLeft(yScale)
        .tickFormat(timeFormat);

    const tooltip = d3.select('#container')
        .append('div')
        .attr('id', 'tooltip')

    const svg = d3.select('body')
        .append('svg')
        .attr('id', 'chart')
        .attr('width', width)
        .attr('height', height);

    svg.selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
        .attr('cx', (d) => xScale(d.Year))
        .attr('cy', (d) => yScale(d.Time))
        .attr('r', 5)
        //    .append('rect')
        //    .attr('x', (d) => xScale(d.Year))
        //    .attr('y', (d) => yScale(d.Time))
        //    .attr('width', 10)
        //    .attr('height', 10)
        .attr('class', 'dot')
        .style('fill', (d) => { if (d.Doping.length > 1) { return '#d0095c' } else { return '#2bbf74' } })
        .attr('data-xvalue', (d) => d.Year)
        .attr('data-yvalue', (d) => d.Time)
        .on('mouseover', (d) => {
            tooltip.style('left', d3.event.pageX + 10 + 'px')
                .style('top', d3.event.pageY + 'px')
                .style('visibility', 'visible')
                .style('border-radius', '8px')
                .attr('data-year', d.Year)
                .html('<i>' + d.Name + '</i>, ' + d.Nationality + ', ' + d.Year + '<br/> <u>' + 'Place:</u> ' + d.Place + '<br/><u>Time:</u> ' + timeFormat(d.Time) + '<br />' + d.Doping)
        })
        .on('mouseout', (d) => {
            tooltip.style("visibility", "hidden")
            .style('transition', 'visibility .1s')
        });

    svg.append('g')
        .attr('transform', 'translate(0, ' + (height - margin) + ')')
        .attr('id', 'x-axis')
        .call(xAxis);

    svg.append('g')
        .attr('transform', 'translate(40, 0)')
        .attr('id', 'y-axis')
        .attr('x', 0)
        .call(yAxis);
}