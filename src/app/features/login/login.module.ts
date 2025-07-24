import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './login-form/login-form.component';
import { loginGuard } from '../../core/guards/login.guard';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

const routes: Routes = [
  { path: '', component: LoginFormComponent },
];

@NgModule({
  declarations: [LoginFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
     RouterModule.forChild(routes),
  ],
  exports:[RouterModule],
   providers: [AuthService] 
})
export class LoginModule { }
