import {
  Component,
  Input,
  ElementRef,
  OnDestroy,
  OnChanges,
  ViewEncapsulation
} from '@angular/core';
import { VennDiagram, sortAreas } from 'venn.js';
import { select, event, Selection } from 'd3';

export interface VennSet {
  sets: Array<string>;
  size: number;
  fraction: number;
  fillColorClass?: string;
  strokeColorClass?: string;
}

@Component({
  selector: 'supre-venn-diagram',
  template: '',
  encapsulation: ViewEncapsulation.None,
  styles: [require('../../suprematism-popover/src/popover.scss')]
})
export class VennDiagramComponent implements OnDestroy, OnChanges {
  @Input() vennSets: Array<VennSet> = [];
  @Input() svgSquareDimension: string;
  @Input() rendering: 'primary' | 'hollow' = 'primary';
  @Input() showTextLabel = false;
  @Input() faded = false;
  tooltip: Selection<HTMLElement, Array<VennSet>, HTMLElement, any>;
  d3Div: Selection<HTMLElement, Array<VennSet>, HTMLElement, any>;
  elementRef: ElementRef;

  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
  }

  ngOnChanges() {
    this.elementRef.nativeElement.style.width = `${this.svgSquareDimension}px`;
    this.elementRef.nativeElement.style.height = `${this.svgSquareDimension}px`;
    this.elementRef.nativeElement.style.display = 'block';
    this.vennSets = this.vennSets.filter(vennSet => vennSet.size);
    if (this.vennSets.length > 0) {
      if (this.d3Div) {
        this.tooltip.remove();
      }
      this.createVenn();
    } else {
      this.tearDownVenn();
    }
  }

  ngOnDestroy() {
    this.tearDownVenn();
  }

  /*
   * Remove d3 venn diagram (and its bindings) from dom
   */
  private tearDownVenn() {
    if (this.d3Div) {
      this.tooltip.remove();
      this.d3Div.remove();
    }
  }

  /*
   * Create a d3 venn diagram via venn.js
   */
  private createVenn() {
    const div = document.createElement('div');
    this.d3Div = <Selection<
      HTMLDivElement,
      Array<VennSet>,
      HTMLElement,
      any
    >>select(div);
    const parent = this.elementRef.nativeElement;
    parent.innerHTML = '';
    parent.appendChild(div);
    const chart = VennDiagram()
      .width(this.svgSquareDimension)
      .height(this.svgSquareDimension);
    this.d3Div.datum(this.vennSets).call(chart);
    this.styleVenn();
  }

  /*
   * Add venn styling
   */
  private styleVenn() {
    const isHollow = this.rendering === 'hollow';

    const OFFSCREEN_LEFT_POSITION = '-99999px';
    const TRANSITION_DURATION = 400;
    const TOOLTIP_OPACITY = 0;
    const ACTIVE_TOOLTIP_OPACITY = 1;
    let CIRCLE_OPACITY = 0.75;
    let CIRCLE_BORDER_WIDTH = 0;
    const CIRCLE_BORDER_COLOR = 'stroke-white';
    let CIRCLE_BORDER_OPACITY = 0;
    let ACTIVE_CIRCLE_OPACITY = 0.9;
    let ACTIVE_CIRCLE_BORDER_WIDTH = 3;
    const ACTIVE_CIRCLE_BORDER_COLOR = 'stroke-white';
    let ACTIVE_CIRCLE_BORDER_OPACITY = 1;
    const INTERSECTION_OPACITY = 0;
    const ACTIVE_INTERSECTION_OPACITY = 0.2;

    if (isHollow) {
      CIRCLE_OPACITY = 0;
      CIRCLE_BORDER_WIDTH = 3;
      CIRCLE_BORDER_OPACITY = 0.75;
      ACTIVE_CIRCLE_OPACITY = 0;
      ACTIVE_CIRCLE_BORDER_WIDTH = 3;
      ACTIVE_CIRCLE_BORDER_OPACITY = 0.9;
      if (this.faded) {
        CIRCLE_BORDER_OPACITY = 0.3;
      }
    } else if (this.faded) {
      CIRCLE_OPACITY = 0.2;
    }

    const circleStroke = (vennSet: VennSet, i) =>
      isHollow ? vennSet.strokeColorClass : CIRCLE_BORDER_COLOR;
    const getClassFromVennSet = (vennSet: VennSet, i) =>
      `${circleStroke(vennSet, i)} ${vennSet.fillColorClass}`;

    this.tooltip = <Selection<
      HTMLElement,
      Array<VennSet>,
      HTMLElement,
      any
    >>select('body')
      .append('div')
      .style('display', 'none')
      .attr('class', 'popover top popover--venn');

    const d3Div = this.d3Div;
    const tooltip = this.tooltip;

    const tooltipTitle = tooltip.append('div').attr('class', 'popover-title');

    const tooltipArrow = tooltip.append('div').attr('class', 'arrow');

    d3Div
      .selectAll('path')
      .style('stroke-opacity', CIRCLE_BORDER_OPACITY)
      .attr('class', getClassFromVennSet)
      .style('stroke-width', CIRCLE_BORDER_WIDTH);

    // add listeners to all the groups to display tooltip on mouseover
    d3Div
      .selectAll('g')
      .on('mouseover', function(vennSet: VennSet, i) {
        // sort all the areas relative to the current item
        sortAreas(d3Div, vennSet);

        // Display a tooltip with the current size
        tooltip
          .style('display', 'block')
          .transition()
          .duration(TRANSITION_DURATION)
          .style('opacity', ACTIVE_TOOLTIP_OPACITY);
        const reach = vennSet.size.toLocaleString('en');
        const percentage = vennSet.fraction.toLocaleString('en', {
          style: 'percent',
          minimumFractionDigits: 2
        });
        tooltipTitle.text(`${reach} | ${percentage}`);

        // highlight the current path
        const selection = select(this)
          .transition('tooltip')
          .duration(TRANSITION_DURATION);
        selection
          .select('path')
          .style('stroke-width', ACTIVE_CIRCLE_BORDER_WIDTH)
          .attr('class', getClassFromVennSet)
          .style(
            'fill-opacity',
            vennSet.sets.length === 1
              ? ACTIVE_CIRCLE_OPACITY
              : ACTIVE_INTERSECTION_OPACITY
          )
          .style('stroke-opacity', ACTIVE_CIRCLE_BORDER_OPACITY);
      })
      .on('mousemove', function() {
        const widthOffset =
          parseInt(getComputedStyle(tooltip.node()).width, 10) / 2;
        const heightOffset =
          parseInt(getComputedStyle(tooltip.node()).height, 10) + 10;
        tooltip
          .style('left', event.pageX - widthOffset + 'px')
          .style('top', event.pageY - heightOffset + 'px');
      })
      .on('mouseout', function(vennSet: VennSet, i) {
        tooltip
          .transition()
          .duration(TRANSITION_DURATION)
          .style('opacity', TOOLTIP_OPACITY)
          .on('end', () => tooltip.style('left', OFFSCREEN_LEFT_POSITION));
        const selection = select(this)
          .transition('tooltip')
          .duration(TRANSITION_DURATION);
        selection
          .select('path')
          .style('stroke-width', CIRCLE_BORDER_WIDTH)
          .style(
            'fill-opacity',
            vennSet.sets.length === 1 ? CIRCLE_OPACITY : INTERSECTION_OPACITY
          )
          .attr('class', getClassFromVennSet)
          .style('stroke-opacity', CIRCLE_BORDER_OPACITY);
      });

    d3Div
      .selectAll('.venn-circle path')
      .style('fill-opacity', CIRCLE_OPACITY)
      .attr('class', getClassFromVennSet);

    if (!this.showTextLabel) {
      d3Div.selectAll('.venn-area.venn-circle .label').style('display', 'none');
    }
  }
}
