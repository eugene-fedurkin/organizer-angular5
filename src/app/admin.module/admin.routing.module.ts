import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin.component/admin.component';

const router: Routes = [
  { path: '', component: AdminComponent },
];

export const adminRouter = RouterModule.forChild(router);
