import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app.routing.module';

import { AppComponent } from './app.component';
import { Auth } from './components/auth.component/auth.component';
import { Lists } from './components/lists.component/lists.component';
import { Loader } from './components/loader.component/loader.component';
import { List } from './components/list.component/list.component';
import { Header } from './components/header.component/header.component';
import { SettingWindow } from './components/setting-window.component/setting-window.component';
import { Modal } from './components/modal.component/modal.component';

import { LoaderService } from './services/loader.service';
import { Store } from './services/store.service';
import { UserHttpService } from './services/http/user.http.service';
import { IUserHttpService } from './interfaces/i.user.http';
import { MockUserHttpService } from './mock/mock.user.http.service';
import { ModalService } from './services/modal.service';
import { IListHttpService } from './interfaces/i.list.http';
import { ListHttpService } from './services/http/list.http.service';
import { MockListHttpService } from './mock/mock.list.http.service';
import { Items } from './components/items.component/items.component';
import { Item } from './components/item.component/item.component';
import { ItemDetails } from './components/item-details.component/item-details.component';
import { AddInput } from './components/add-input.component/add-input.component';
import { Queue } from './services/queue.service';
import { IItemHttpService } from './interfaces/i.item.http';
import { ItemHttpService } from './services/http/item.http.service';
import { MockItemHttpService } from './mock/mock.item.http.service';
import { MyDatePickerModule } from 'mydatepicker';
import { EditForm } from './components/edit-form.component/edit-form.component';

import { AgmCoreModule, MarkerManager, GoogleMapsAPIWrapper } from '@agm/core';

import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';

@NgModule({
  declarations: [
    AppComponent,
    Auth,
    Lists,
    Loader,
    List,
    Header,
    SettingWindow,
    Modal,
    Items,
    Item,
    ItemDetails,
    AddInput,
    EditForm
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
    Queue,
    MarkerManager,
    GoogleMapsAPIWrapper,
    { provide: IUserHttpService, useClass: MockUserHttpService }, // mock: MockUserHttpService, original: UserHttpService
    { provide: IListHttpService, useClass: MockListHttpService }, // mock: MockListHttpService, original: ListHttpService
    { provide: IItemHttpService, useClass: MockItemHttpService }, // mock: MockItemHttpService, original: ItemHttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
