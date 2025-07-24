import { Routes } from '@angular/router';
import { loginGuard } from './core/guards/login.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

     { path: 'login',loadChildren: () => import('./features/login/login.module').then(m => m.LoginModule),canActivate:[loginGuard]},
     { path: 'dashboard',loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),canActivate:[authGuard]},
     { path: 'projects',loadChildren: () => import('./features/projects/projects.module').then(m => m.ProjectsModule),canActivate:[authGuard]},
     { path:'sprint',loadChildren:()=>import('./features/sprint/sprint.module').then(m=>m.SprintModule),canActivate:[authGuard]},
     { path:'employee',loadChildren:()=>import('./features/employee/employee.module').then(m=>m.EmployeeModule),canActivate:[authGuard]},
     { path:'scrum-board',loadChildren:()=>import('./features/story/story.module').then(m=>m.StoryModule),canActivate:[authGuard]},
     { path:'logging-efforts',loadChildren:()=>import('./features/logging-efforts/logging-efforts.module').then(m=>m.LoggingEffortsModule),canActivate:[authGuard]}
];
