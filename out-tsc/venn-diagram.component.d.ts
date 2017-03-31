import { AfterViewInit, ElementRef, OnDestroy, OnChanges } from '@angular/core';
export interface VennSet {
    sets: Array<string>;
    size: number;
}
export declare class VennDiagramComponent implements AfterViewInit, OnDestroy, OnChanges {
    vennSets: Array<VennSet>;
    tooltip: any;
    div: any;
    elementRef: ElementRef;
    constructor(elementRef: ElementRef);
    ngOnChanges(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
}
