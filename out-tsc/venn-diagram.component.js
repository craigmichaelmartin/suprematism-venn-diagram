"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var venn_js_1 = require("venn.js");
var d3_1 = require("d3");
var VennDiagramComponent = (function () {
    function VennDiagramComponent(elementRef) {
        this.elementRef = elementRef;
    }
    VennDiagramComponent.prototype.ngOnChanges = function () {
        if (this.vennSets.length > 0) {
            this.createVenn();
        }
        else {
            this.tearDownVenn();
        }
    };
    VennDiagramComponent.prototype.ngAfterViewInit = function () {
        if (this.vennSets.length > 0) {
            this.styleVenn();
        }
    };
    VennDiagramComponent.prototype.ngOnDestroy = function () {
        this.tearDownVenn();
    };
    /*
     * Remove d3 venn diagram (and its bindings) from dom
     */
    VennDiagramComponent.prototype.tearDownVenn = function () {
        if (this.div) {
            this.tooltip.remove();
            this.div.remove();
        }
    };
    /*
     * Create a d3 venn diagram via venn.js
     */
    VennDiagramComponent.prototype.createVenn = function () {
        if (!this.div) {
            this.div = d3_1.select(this.elementRef.nativeElement);
        }
        var chart = venn_js_1.VennDiagram()
            .width(this.svgSquareDimension)
            .height(this.svgSquareDimension);
        this.div.datum(this.vennSets).call(chart);
    };
    /*
     * Add venn styling
     */
    VennDiagramComponent.prototype.styleVenn = function () {
        var TRANSITION_DURATION = 400;
        var TOOLTIP_OPACITY = 0;
        var ACTIVE_TOOLTIP_OPACITY = 1;
        var CIRCLE_OPACITY = .75;
        var CIRCLE_BORDER_WIDTH = 0;
        var CIRCLE_BORDER_COLOR = '#fff';
        var CIRCLE_BORDER_OPACITY = 0;
        var ACTIVE_CIRCLE_OPACITY = .9;
        var ACTIVE_CIRCLE_BORDER_WIDTH = 3;
        var ACTIVE_CIRCLE_BORDER_COLOR = '#fff';
        var ACTIVE_CIRCLE_BORDER_OPACITY = 1;
        var INTERSECTION_OPACITY = 0;
        var ACTIVE_INTERSECTION_OPACITY = .2;
        this.tooltip = d3_1.select('body')
            .append('div')
            .style('display', 'none')
            .attr('class', 'popover top popover--venn');
        var div = this.div;
        var tooltip = this.tooltip;
        var tooltipTitle = tooltip
            .append('div')
            .attr('class', 'popover-title');
        var tooltipArrow = tooltip
            .append('div')
            .attr('class', 'arrow');
        div.selectAll('path')
            .style('stroke-opacity', CIRCLE_BORDER_OPACITY)
            .style('stroke', CIRCLE_BORDER_COLOR)
            .style('stroke-width', CIRCLE_BORDER_WIDTH);
        // add listeners to all the groups to display tooltip on mouseover
        div.selectAll('g')
            .on('mouseover', function (vennSet, i) {
            // sort all the areas relative to the current item
            venn_js_1.sortAreas(div, vennSet);
            // Display a tooltip with the current size
            tooltip
                .style('display', 'block')
                .transition()
                .duration(TRANSITION_DURATION)
                .style('opacity', ACTIVE_TOOLTIP_OPACITY);
            var reach = vennSet.size.toLocaleString('en');
            var percentage = vennSet.fraction.toLocaleString('en', {
                style: 'percent',
                minimumFractionDigits: 2
            });
            tooltipTitle.text(reach + " | " + percentage);
            // highlight the current path
            var selection = d3_1.select(this).transition('tooltip').duration(TRANSITION_DURATION);
            selection.select('path')
                .style('stroke-width', ACTIVE_CIRCLE_BORDER_WIDTH)
                .style('stroke', ACTIVE_CIRCLE_BORDER_COLOR)
                .style('fill-opacity', vennSet.sets.length === 1 ? ACTIVE_CIRCLE_OPACITY : ACTIVE_INTERSECTION_OPACITY)
                .style('stroke-opacity', ACTIVE_CIRCLE_BORDER_OPACITY);
        })
            .on('mousemove', function () {
            var widthOffset = parseInt(getComputedStyle(tooltip.node()).width, 10) / 2;
            var heightOffset = parseInt(getComputedStyle(tooltip.node()).height, 10) + 10;
            tooltip
                .style('left', (d3_1.event.pageX - widthOffset) + 'px')
                .style('top', (d3_1.event.pageY - heightOffset) + 'px');
        })
            .on('mouseout', function (vennSet, i) {
            tooltip.transition().duration(TRANSITION_DURATION).style('opacity', TOOLTIP_OPACITY);
            var selection = d3_1.select(this).transition('tooltip').duration(TRANSITION_DURATION);
            selection.select('path')
                .style('stroke-width', CIRCLE_BORDER_WIDTH)
                .style('fill-opacity', vennSet.sets.length === 1 ? CIRCLE_OPACITY : INTERSECTION_OPACITY)
                .style('stroke-opacity', CIRCLE_BORDER_OPACITY);
        });
        div.selectAll('.venn-circle path')
            .style('fill-opacity', CIRCLE_OPACITY)
            .style('fill', function (vennSet, i) { return vennSet.color; });
        div.selectAll('.venn-area.venn-circle .label')
            .style('display', 'none');
    };
    return VennDiagramComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], VennDiagramComponent.prototype, "vennSets", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], VennDiagramComponent.prototype, "svgSquareDimension", void 0);
VennDiagramComponent = __decorate([
    core_1.Component({
        selector: 'supre-venn-diagram',
        template: ''
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], VennDiagramComponent);
exports.VennDiagramComponent = VennDiagramComponent;
//# sourceMappingURL=venn-diagram.component.js.map