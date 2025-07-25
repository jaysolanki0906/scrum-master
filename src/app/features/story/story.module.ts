import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryTableComponent } from './story-table/story-table.component';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from '../projects/projects/projects.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { LoggingEffortsFormComponent } from '../logging-efforts/logging-efforts-form/logging-efforts-form.component';
import { LoggingEffortsListComponent } from '../logging-efforts/logging-efforts-list/logging-efforts-list.component';

const routes: Routes = [
  { path: '', component: StoryTableComponent
   },
   {path:'logging',component:LoggingEffortsListComponent}
];

@NgModule({
  declarations: [StoryTableComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    RouterModule.forChild(routes),
  ],exports:[RouterModule]
})
export class StoryModule { }
