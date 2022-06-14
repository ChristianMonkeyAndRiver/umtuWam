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
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['dashboard']);

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'login',
    component: SignInComponent,
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    ...canActivate(redirectUnauthorizedToLogin),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'active',
      },
      {
        path: 'active',
        component: ActiveUsersListComponent,
        children: [
          {
            path: 'profile',
            component: ViewProfileComponent,
          },
        ],
      },
      {
        path: 'reports',
        component: ReportsListComponent,
        children: [
          {
            path: 'profile',
            component: ViewProfileComponent,
          },
        ],
      },
      {
        path: 'banned',
        component: BannedAccountsListComponent,
        children: [
          {
            path: 'profile',
            component: ViewProfileComponent,
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