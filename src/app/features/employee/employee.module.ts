import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeTableComponent } from './employee-table/employee-table.component';
import { RouterModule, Routes } from '@angular/router';
import { MaskTextPipe } from '../../pipes/mask-text.pipe';
import { CommonTableComponent } from '../../shared/common-table/common-table.component';

const routes: Routes = [
  { path: '', component: EmployeeTableComponent },
];

@NgModule({
  declarations: [EmployeeTableComponent],
  imports: [
    CommonModule,
    MaskTextPipe,
    CommonTableComponent,
    RouterModule.forChild(routes),
  ],
  exports:[RouterModule]
})
export class EmployeeModule { }
