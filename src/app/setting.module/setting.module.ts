import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SettingComponent } from './setting.component/setting.component';
import { settingRouter } from './setting.routing.module';

@NgModule({
  declarations: [
    SettingComponent,
  ],
  imports: [
    FormsModule,
    settingRouter,
    CommonModule
  ],
})

export class SettingModule {}
