import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Auth } from './components/auth.component/auth.component';
import { Lists } from './components/lists.component/lists.component';
import { Items } from './components/items.component/items.component';
import { ItemDetails } from './components/item-details.component/item-details.component';
import { EditForm } from './components/edit-form.component/edit-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', component: Auth },
  { path: 'lists', component: Lists, children: [
    { path: ':listId', component: Items, children: [
      { path: ':itemId/details', component: ItemDetails, children: [
        { path: 'edit-form', component: EditForm },
      ] },
    ] },
  ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
