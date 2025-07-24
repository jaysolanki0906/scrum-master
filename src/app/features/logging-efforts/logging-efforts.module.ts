import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggingEffortsListComponent } from './logging-efforts-list/logging-efforts-list.component';
import { RouterModule, Routes } from '@angular/router';
import { TruncateWordsPipe } from '../../pipes/truncate-words.pipe';

const routes: Routes = [
  { path: '', component: LoggingEffortsListComponent },
];

@NgModule({
  declarations: [LoggingEffortsListComponent],
  imports: [
    CommonModule,
    TruncateWordsPipe,
    RouterModule.forChild(routes),
  ],exports:[RouterModule]
})
export class LoggingEffortsModule { }
