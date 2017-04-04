import { Component, Input, AfterViewInit, ElementRef, ViewEncapsulation, OnDestroy, OnChanges } from '@angular/core';
import { VennDiagram, sortAreas } from 'venn.js';
import { select, event, Selection } from 'd3';

export interface VennSet {
  sets: Array<string>;
  size: number;
  color?: string;
}

@Component({
  selector: 'supre-venn-diagram',
  template: require('./venn-diagram.component.html'),
  encapsulation: ViewEncapsulation.None,
  styles: [require('./venn-diagram.component.scss')]
})
export class VennDiagramComponent implements AfterViewInit, OnDestroy, OnChanges {

  @Input() vennSets: Array<VennSet>;
  @Input() svgSquareDimension: string;
  tooltip: Selection<HTMLElement, Array<VennSet>, HTMLElement, any>;
  div: Selection<HTMLElement, Array<VennSet>, HTMLElement, any>;

  elementRef: ElementRef;

  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
  }

  ngOnChanges() {
    if (this.div) {
      this.createVenn();
    }
  }

  ngAfterViewInit() {
    if (this.vennSets.length > 0) {
      this.createVenn();
      this.styleVenn();
    }
  }

  ngOnDestroy() {
    this.tooltip.remove();
    this.div.remove();
  }

  private createVenn() {
    const chart = VennDiagram()
      .width(this.svgSquareDimension)
      .height(this.svgSquareDimension);
    this.div = select(this.elementRef.nativeElement);
    this.div.datum(this.vennSets).call(chart);
  }

  private styleVenn() {

    this.tooltip = select('body')
      .append('div')
        .style('display', 'none')
        .attr('class', 'popover top popover--venn');

    const div = this.div;
    const tooltip = this.tooltip;

    const tooltipTitle = tooltip
      .append('div')
        .attr('class', 'popover-title');

    const tooltipArrow = tooltip
      .append('div')
        .attr('class', 'arrow');


    div.selectAll('path')
      .style('stroke-opacity', 0)
      .style('stroke', '#fff')
      .style('stroke-width', 3);

    // add listeners to all the groups to display tooltip on mouseover
    div.selectAll('g')
      .on('mouseover', function(d, i) {
          // sort all the areas relative to the current item
          sortAreas(div, d);

	  // Display a tooltip with the current size
          tooltip.style('display', 'block').transition().duration(400).style('opacity', 1);
          tooltipTitle.text(d.size + ' users');

	  // highlight the current path
          const selection = select(this).transition('tooltip').duration(400);
          selection.select('path')
            .style('stroke-width', 3)
            .style('fill-opacity', d.sets.length === 1 ? .9 : .2)
            .style('stroke-opacity', 1);
      })
      .on('mousemove', function() {
        const widthOffset = parseInt(getComputedStyle(tooltip.node()).width, 10) / 2;
        const heightOffset = parseInt(getComputedStyle(tooltip.node()).height, 10) + 10;
        tooltip
          .style('left', (event.pageX - widthOffset) + 'px')
          .style('top', (event.pageY - heightOffset) + 'px');
      })
      .on('mouseout', function(d, i) {
          tooltip.transition().duration(400).style('opacity', 0);
          const selection = select(this).transition('tooltip').duration(400);
          selection.select('path')
            .style('stroke-width', 0)
            .style('fill-opacity', d.sets.length === 1 ? .75 : .0)
            .style('stroke-opacity', 0);
      });

    div.selectAll('.venn-circle path')
      .style('fill-opacity', .75)
      .style('fill', function(d, i) { return d.color; });

    div.selectAll('.venn-area.venn-circle .label')
      .style('display', 'none');

  }

}
