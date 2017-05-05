d3.xml("test.svg", "image/svg+xml", function(error, xml) {
   if (error) throw error; document.body.appendChild(xml.documentElement);
   d3.select('#kleur1').style('fill', '#ccece6');
   d3.select('#kleur2').style('fill', '#99d8c9');
   d3.select('#kleur3').style('fill', '#66c2a4');
   d3.select('svg').append('rect')
        .attr('id', 'kleur4')
        .attr('class', 'st1')
        .attr('x', 13)
        .attr('y', 138.7)
        .attr('width', 21)
        .attr('height', 29)
        .style('fill', '#41ae76');

   d3.select('svg').append('rect')
       .attr('id', 'kleur5')
       .attr('class', 'st1')
       .attr('x', 13)
       .attr('y', 180.6)
       .attr('width', 21)
       .attr('height', 29)
       .style('fill', '#238b45');

   d3.select('svg').append('rect')
       .attr('id', 'kleur6')
       .attr('class', 'st1')
       .attr('x', 13)
       .attr('y', 222)
       .attr('width', 21)
       .attr('height', 29)
       .style('fill', '#005824');

   d3.select('svg').append('rect')
      .attr('id', 'tekst4')
      .attr('class', 'st2')
      .attr('x', 46.5)
      .attr('y', 138.7)
      .attr('width', 119.1)
      .attr('height', 29)
      .style('fill', '#FFFFFF');

  d3.select('svg').append('text')
     .attr('id', 'tekst 4')
     .attr('x', 70)
     .attr('y', 158)
     .text('100000');

  d3.select('svg').append('rect')
     .attr('id', 'tekst5')
     .attr('class', 'st2')
     .attr('x', 46.5)
     .attr('y', 180.6)
     .attr('width', 119.1)
     .attr('height', 29)
     .style('fill', '#FFFFFF');

  d3.select('svg').append('text')
      .attr('id', 'tekst 5')
      .attr('x', 70)
      .attr('y', 200)
      .text('1000000');

  d3.select('svg').append('rect')
     .attr('id', 'tekst6')
     .attr('class', 'st1')
     .attr('x', 46.5)
     .attr('y', 222)
     .attr('width', 119.1)
     .attr('height', 29)
     .style('fill', '#FFFFFF');

 d3.select('svg').append('text')
     .attr('id', 'tekst 6')
     .attr('x', 70)
     .attr('y', 242)
     .text('10000000');

 d3.select('svg').append('text')
     .attr('id', 'tekst 5')
     .attr('x', 70)
     .attr('y', 117)
     .text('1000');

d3.select('svg').append('text')
     .attr('id', 'tekst 5')
     .attr('x', 70)
     .attr('y', 77)
     .text('100');

d3.select('svg').append('text')
     .attr('id', 'tekst 5')
     .attr('x', 70)
     .attr('y', 35)
     .text('10');



 });
