import { CommonModule } from '@angular/common';
import { VennDiagramComponent } from './venn-diagram.component';
import { NgModule } from '@angular/core';

export * from './venn-diagram.component';

@NgModule({
  imports: [CommonModule],
  declarations: [VennDiagramComponent],
  exports: [VennDiagramComponent],
  entryComponents: [VennDiagramComponent]
})
export class VennDiagramModule {}
