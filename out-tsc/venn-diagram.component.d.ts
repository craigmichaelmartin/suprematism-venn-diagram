import { AfterViewInit, ElementRef, OnDestroy, OnChanges } from '@angular/core';
import { Selection } from 'd3';
export interface VennSet {
    sets: Array<string>;
    size: number;
    fraction: number;
    color?: string;
}
export declare class VennDiagramComponent implements AfterViewInit, OnDestroy, OnChanges {
    vennSets: Array<VennSet>;
    svgSquareDimension: string;
    tooltip: Selection<HTMLElement, Array<VennSet>, HTMLElement, any>;
    div: Selection<HTMLElement, Array<VennSet>, HTMLElement, any>;
    elementRef: ElementRef;
    constructor(elementRef: ElementRef);
    ngOnChanges(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    private tearDownVenn();
    private createVenn();
    private styleVenn();
}
