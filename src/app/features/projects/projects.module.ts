import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects/projects.component';
import { RouterModule, Routes } from '@angular/router';
import { TruncateWordsPipe } from '../../pipes/truncate-words.pipe';

const routes: Routes = [
  { path: '', component: ProjectsComponent },
];

@NgModule({
  declarations: [ProjectsComponent],
  imports: [
    CommonModule,
    TruncateWordsPipe,
    RouterModule.forChild(routes),
  ],
  exports:[RouterModule]
})
export class ProjectsModule { }
