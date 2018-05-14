import { AgmCoreModule, GoogleMapsAPIWrapper, MarkerManager } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyDatePickerModule } from 'mydatepicker';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { AddInputComponent } from './components/add-input.component/add-input.component';
import { AuthComponent } from './components/auth.component/auth.component';
import { EditFormComponent } from './components/edit-form.component/edit-form.component';
import { HeaderComponent } from './components/header.component/header.component';
import { ItemDetailsComponent } from './components/item-details.component/item-details.component';
import { ItemComponent } from './components/item.component/item.component';
import { ItemsComponent } from './components/items.component/items.component';
import { ListComponent } from './components/list.component/list.component';
import { ListsComponent } from './components/lists.component/lists.component';
import { LoaderComponent } from './components/loader.component/loader.component';
import { ModalComponent } from './components/modal.component/modal.component';
import { SettingWindowComponent } from './components/setting-window.component/setting-window.component';
import { PageNotFoundComponent } from './components/page-not-found.component/page-not-found.component';
import { IItemHttpService } from './interfaces/i.item.http';
import { IListHttpService } from './interfaces/i.list.http';
import { IUserHttpService } from './interfaces/i.user.http';
import { MockItemHttpService } from './mock/mock.item.http.service';
import { MockListHttpService } from './mock/mock.list.http.service';
import { MockUserHttpService } from './mock/mock.user.http.service';
import { LoaderService } from './services/loader.service';
import { ModalService } from './services/modal.service';
import { UnsavedEntitiesFactory } from './services/unsaved-entities-factory.service';
import { Store } from './services/store.service';
import { UserHttpService } from './services/http/user.http.service';
import { ListHttpService } from './services/http/list.http.service';
import { ItemHttpService } from './services/http/item.http.service';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ListsComponent,
    LoaderComponent,
    ListComponent,
    HeaderComponent,
    SettingWindowComponent,
    ModalComponent,
    ItemsComponent,
    ItemComponent,
    ItemDetailsComponent,
    AddInputComponent,
    EditFormComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MyDatePickerModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCXHioGLeLWvHGHdO47hiwu2VlUzb1fZiA',
      language: 'ru',
      libraries: ['places'],
    }),
    AgmSnazzyInfoWindowModule
  ],
  providers: [
    Store,
    LoaderService,
    ModalService,
    UnsavedEntitiesFactory,
    MarkerManager,
    GoogleMapsAPIWrapper,
    { provide: IUserHttpService, useClass: UserHttpService }, // mock: MockUserHttpService, original: UserHttpService
    { provide: IListHttpService, useClass: ListHttpService }, // mock: MockListHttpService, original: ListHttpService
    { provide: IItemHttpService, useClass: ItemHttpService }, // mock: MockItemHttpService, original: ItemHttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
