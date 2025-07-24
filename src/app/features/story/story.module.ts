import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryTableComponent } from './story-table/story-table.component';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from '../projects/projects/projects.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  { path: '', component: StoryTableComponent
   },
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
