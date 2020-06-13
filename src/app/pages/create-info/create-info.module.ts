import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateInfoPageRoutingModule } from './create-info-routing.module';

import { CreateInfoPage } from './create-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateInfoPageRoutingModule
  ],
  declarations: [CreateInfoPage]
})
export class CreateInfoPageModule {}
