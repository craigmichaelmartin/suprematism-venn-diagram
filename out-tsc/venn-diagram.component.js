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
        var numberOfSets = this.vennSets.filter(function (x) { return x.sets.length === 1; }).length;
        var chart = venn_js_1.VennDiagram()
            .width(250)
            .height(50 + (30 * numberOfSets));
        this.div = d3_1.select(this.elementRef.nativeElement);
        this.div.datum(this.vennSets).call(chart);
    };
    VennDiagramComponent.prototype.ngAfterViewInit = function () {
        // add a tooltip
        this.tooltip = d3_1.select('body')
            .append('div')
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
            .style('stroke-opacity', 0)
            .style('stroke', '#fff')
            .style('stroke-width', 3);
        // add listeners to all the groups to display tooltip on mouseover
        div.selectAll('g')
            .on('mouseover', function (d, i) {
            // sort all the areas relative to the current item
            venn_js_1.sortAreas(div, d);
            // Display a tooltip with the current size
            tooltip.transition().duration(400).style('opacity', 1);
            tooltipTitle.text(d.size + ' users');
            // highlight the current path
            var selection = d3_1.select(this).transition('tooltip').duration(400);
            selection.select('path')
                .style('stroke-width', 3)
                .style('fill-opacity', d.sets.length === 1 ? .9 : .2)
                .style('stroke-opacity', 1);
        })
            .on('mousemove', function () {
            var widthOffset = parseInt(getComputedStyle(tooltip.node()).width, 10) / 2;
            var heightOffset = parseInt(getComputedStyle(tooltip.node()).height, 10) + 10;
            tooltip
                .style('left', (d3_1.event.pageX - widthOffset) + 'px')
                .style('top', (d3_1.event.pageY - heightOffset) + 'px');
        })
            .on('mouseout', function (d, i) {
            tooltip.transition().duration(400).style('opacity', 0);
            var selection = d3_1.select(this).transition('tooltip').duration(400);
            selection.select('path')
                .style('stroke-width', 0)
                .style('fill-opacity', d.sets.length === 1 ? .75 : .0)
                .style('stroke-opacity', 0);
        });
        div.selectAll('.venn-circle path')
            .style('fill-opacity', .75)
            .style('fill', function (d, i) { return d.color; });
        div.selectAll('.venn-area.venn-circle .label')
            .style('display', 'none');
    };
    VennDiagramComponent.prototype.ngOnDestroy = function () {
        this.tooltip.remove();
        this.div.remove();
    };
    return VennDiagramComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], VennDiagramComponent.prototype, "vennSets", void 0);
VennDiagramComponent = __decorate([
    core_1.Component({
        selector: 'supre-venn-diagram',
        template: require('./venn-diagram.component.html'),
        encapsulation: core_1.ViewEncapsulation.None,
        styles: [require('./venn-diagram.component.scss')]
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], VennDiagramComponent);
exports.VennDiagramComponent = VennDiagramComponent;
//# sourceMappingURL=venn-diagram.component.js.map