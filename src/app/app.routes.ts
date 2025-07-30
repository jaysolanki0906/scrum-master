import { Routes } from '@angular/router';
import { loginGuard } from './core/guards/login.guard';
import { authGuard } from './core/guards/auth.guard';
import { AcessDeniedPageComponent } from './shared/acess-denied-page/acess-denied-page.component';
import { roleBasedGuard } from './core/guards/role.guard';
import { homeGuard } from './core/guards/home.guard';
import { NotfoundComponent } from './shared/notfound/notfound/notfound.component';

export const routes: Routes = [

     { path: 'login',loadChildren: () => import('./features/login/login.module').then(m => m.LoginModule),canActivate:[loginGuard]},
     { path: 'dashboard',loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),canActivate:[authGuard,homeGuard,roleBasedGuard]},
     { path: 'projects',loadChildren: () => import('./features/projects/projects.module').then(m => m.ProjectsModule),canActivate:[authGuard,homeGuard,roleBasedGuard]},
     { path:'sprint',loadChildren:()=>import('./features/sprint/sprint.module').then(m=>m.SprintModule),canActivate:[authGuard,homeGuard,roleBasedGuard]},
     { path:'employee',loadChildren:()=>import('./features/employee/employee.module').then(m=>m.EmployeeModule),canActivate:[authGuard,homeGuard,roleBasedGuard]},
     { path:'scrum-board',loadChildren:()=>import('./features/story/story.module').then(m=>m.StoryModule),canActivate:[authGuard,homeGuard,roleBasedGuard]},
     { path: 'profile', loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule), canActivate: [authGuard,homeGuard,roleBasedGuard] },
     { path:'register',loadChildren:()=>import('./features/register/register.module').then(m=>m.RegisterModule),canActivate:[loginGuard]},
     { path:'access-denied',component:AcessDeniedPageComponent,canActivate:[authGuard]},
     { path: '**', component: NotfoundComponent,canActivate:[homeGuard]}
];
