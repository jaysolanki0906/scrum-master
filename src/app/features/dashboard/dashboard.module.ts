import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashbaordComponent } from './dashbaord/dashbaord.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: '', component: DashbaordComponent },
];

@NgModule({
  declarations: [DashbaordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), 
    NgChartsModule,
  ],
  exports:[RouterModule],
  providers:[AuthService]
})
export class DashboardModule { }
