import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprintTableComponent } from './sprint-table/sprint-table.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgSelectModule } from '@ng-select/ng-select';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonTableComponent } from '../../shared/common-table/common-table.component';

const routes: Routes = [
  { path: '', component: SprintTableComponent },
];

@NgModule({
  declarations: [SprintTableComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    CommonTableComponent,
    NgMultiSelectDropDownModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class SprintModule { }
