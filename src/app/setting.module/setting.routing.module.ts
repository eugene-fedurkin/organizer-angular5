import { RouterModule, Routes } from '@angular/router';

import { SettingComponent } from './setting.component/setting.component';

const router: Routes = [
  { path: '', component: SettingComponent },
];

export const settingRouter = RouterModule.forChild(router);
