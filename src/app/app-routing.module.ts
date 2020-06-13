import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'create-account',
    loadChildren: () => import('./pages/create-account/create-account.module').then( m => m.CreateAccountPageModule)
  },
  {
    path: 'create-info',
    loadChildren: () => import('./pages/create-info/create-info.module').then( m => m.CreateInfoPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'main-tabs',
    loadChildren: () => import('./pages/tabs/main-tabs/main-tabs.module').then( m => m.MainTabsPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/tabs/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/tabs/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'feed',
    loadChildren: () => import('./pages/tabs/feed/feed.module').then( m => m.FeedPageModule)
  },
  {
    path: 'create',
    loadChildren: () => import('./pages/tabs/create/create.module').then( m => m.CreatePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
