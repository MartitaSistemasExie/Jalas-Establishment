import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateInfoPage } from './create-info.page';

const routes: Routes = [
  {
    path: '',
    component: CreateInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateInfoPageRoutingModule {}
