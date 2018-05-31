import { NgModule } from '@angular/core';

import { AdminComponent } from './admin.component/admin.component';
import { adminRouter } from './admin.routing.module';

@NgModule({
  declarations: [
    AdminComponent,
  ],
  imports: [adminRouter],
})

export class AdminModule {}
