import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './components/auth.component/auth.component';
import { EditFormComponent } from './components/edit-form.component/edit-form.component';
import { ItemDetailsComponent } from './components/item-details.component/item-details.component';
import { ItemsComponent } from './components/items.component/items.component';
import { ListsComponent } from './components/lists.component/lists.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'lists', component: ListsComponent, children: [
    { path: ':listId', component: ItemsComponent, children: [
      { path: ':itemId/details', component: ItemDetailsComponent, children: [
        { path: 'edit-form', component: EditFormComponent },
      ] },
    ] },
  ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
