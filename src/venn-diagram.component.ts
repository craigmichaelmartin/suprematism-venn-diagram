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
  template: ''
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
    if (this.vennSets.length > 0) {
      this.createVenn();
    } else {
      this.tearDownVenn();
    }
  }

  ngAfterViewInit() {
    if (this.vennSets.length > 0) {
      this.styleVenn();
    }
  }

  ngOnDestroy() {
    this.tearDownVenn();
  }

  /*
   * Remove d3 venn diagram (and its bindings) from dom
   */
  private tearDownVenn() {
    if (this.div) {
      this.tooltip.remove();
      this.div.remove();
    }
  }

  /*
   * Create a d3 venn diagram via venn.js
   */
  private createVenn() {
    if (!this.div) {
      this.div = select(this.elementRef.nativeElement);
    }
    const chart = VennDiagram()
      .width(this.svgSquareDimension)
      .height(this.svgSquareDimension);
    this.div.datum(this.vennSets).call(chart);
  }

  /*
   * Add venn styling
   */
  private styleVenn() {

    const TRANSITION_DURATION = 400;

    const CIRCLE_OPACITY = .75;
    const CIRCLE_BORDER_WIDTH = 0;
    const CIRCLE_BORDER_COLOR = '#fff';
    const CIRCLE_BORDER_OPACITY = 0;
    const ACTIVE_CIRCLE_OPACITY = .9;
    const ACTIVE_CIRCLE_BORDER_WIDTH = 3;
    const ACTIVE_CIRCLE_BORDER_COLOR = '#fff';
    const ACTIVE_CIRCLE_BORDER_OPACITY = 1;

    const INTERSECTION_OPACITY = 0;
    const ACTIVE_INTERSECTION_OPACITY = .2;

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
      .style('stroke-opacity', CIRCLE_BORDER_OPACITY)
      .style('stroke', CIRCLE_BORDER_COLOR)
      .style('stroke-width', CIRCLE_BORDER_WIDTH);

    // add listeners to all the groups to display tooltip on mouseover
    div.selectAll('g')
      .on('mouseover', function(d, i) {
          // sort all the areas relative to the current item
          sortAreas(div, d);

          // Display a tooltip with the current size
          tooltip.style('display', 'block').transition().duration(TRANSITION_DURATION).style('opacity', 1);
          tooltipTitle.text(d.size + ' users');

          // highlight the current path
          const selection = select(this).transition('tooltip').duration(TRANSITION_DURATION);
          selection.select('path')
            .style('stroke-width', ACTIVE_CIRCLE_BORDER_WIDTH)
            .style('stroke', ACTIVE_CIRCLE_BORDER_COLOR)
            .style('fill-opacity', d.sets.length === 1 ? ACTIVE_CIRCLE_OPACITY : ACTIVE_INTERSECTION_OPACITY)
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
          tooltip.transition().duration(TRANSITION_DURATION).style('opacity', 0);
          const selection = select(this).transition('tooltip').duration(TRANSITION_DURATION);
          selection.select('path')
            .style('stroke-width', CIRCLE_BORDER_WIDTH)
            .style('fill-opacity', d.sets.length === 1 ? CIRCLE_OPACITY : INTERSECTION_OPACITY)
            .style('stroke-opacity', CIRCLE_BORDER_OPACITY);
      });

    div.selectAll('.venn-circle path')
      .style('fill-opacity', CIRCLE_OPACITY)
      .style('fill', function(d, i) { return d.color; });

    div.selectAll('.venn-area.venn-circle .label')
      .style('display', 'none');
  }

}
