import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './components/auth.component/auth.component';
import { EditFormComponent } from './components/edit-form.component/edit-form.component';
import { HomeComponent } from './components/home.component/home.component';
import { ItemDetailsComponent } from './components/item-details.component/item-details.component';
import { ItemsComponent } from './components/items.component/items.component';
import { ListsComponent } from './components/lists.component/lists.component';
import { PageNotFoundComponent } from './components/page-not-found.component/page-not-found.component';
import { AdminGuard } from './guards/admin.guard';
import { FormAwayGuard } from './guards/form-away.guard';

const routes: Routes = [
  { path: '', redirectTo: '/lists', pathMatch: 'full' },
  { path: 'admin', canLoad: [AdminGuard], loadChildren: 'app/admin.module/admin.module#AdminModule' },
  { path: 'auth', component: AuthComponent },
  { path: 'lists', component: ListsComponent, children: [
    { path: ':listId', component: ItemsComponent, children: [
      { path: ':itemId/details', component: ItemDetailsComponent, children: [
        { path: 'edit-form', component: EditFormComponent, canDeactivate: [FormAwayGuard] },
      ] },
    ] },
  ] },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
