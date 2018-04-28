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
import { HttpService } from './services/http/user.http.servise';
import { IUserHttpService } from './interfaces/i.user.http';
import { MockUserHttpService } from './mock/mock.user.http.service';
import { ModalService } from './services/modal.service';

@NgModule({
  declarations: [
    AppComponent,
    Auth,
    Lists,
    Loader,
    List,
    Header,
    SettingWindow,
    Modal
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [
    Store,
    LoaderService,
    ModalService,
    { provide: IUserHttpService, useClass: HttpService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
