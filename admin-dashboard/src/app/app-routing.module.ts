import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
// route guard
import { AuthGuard } from './shared/guard/auth.guard';
import { ReportsListComponent } from './components/reports-list/reports-list.component';
import { ActiveUsersListComponent } from './components/active-users-list/active-users-list.component';
import { BannedAccountsListComponent } from './components/banned-accounts-list/banned-accounts-list.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'active',
        pathMatch: 'full'
      },
      {
        path: 'active',
        component: ActiveUsersListComponent,
        children: [
          {
            path: 'profile',
            component: ViewProfileComponent
          },
        ],
      },
      {
        path: 'reports',
        component: ReportsListComponent,
        children: [
          {
            path: 'profile',
            component: ViewProfileComponent
          },
        ],
      },
      {
        path: 'banned',
        component: BannedAccountsListComponent,
        children: [
          {
            path: 'profile',
            component: ViewProfileComponent
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  SignInComponent, DashboardComponent, ActiveUsersListComponent,
  ReportsListComponent, BannedAccountsListComponent, ViewProfileComponent
]