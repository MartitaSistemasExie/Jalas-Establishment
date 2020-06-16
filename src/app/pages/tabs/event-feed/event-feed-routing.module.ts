import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventFeedPage } from './event-feed.page';

const routes: Routes = [
  {
    path: '',
    component: EventFeedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventFeedPageRoutingModule {}
