import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventFeedPageRoutingModule } from './event-feed-routing.module';

import { EventFeedPage } from './event-feed.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventFeedPageRoutingModule
  ],
  declarations: [EventFeedPage]
})
export class EventFeedPageModule {}
