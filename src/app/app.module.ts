import { AgmCoreModule, GoogleMapsAPIWrapper, MarkerManager } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyDatePickerModule } from 'mydatepicker';
import { NgDragDropModule } from 'ng-drag-drop';

import { AdminGuard } from './guards/admin.guard';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { AddInputComponent } from './components/add-input.component/add-input.component';
import { AuthComponent } from './components/auth.component/auth.component';
import { EditFormComponent } from './components/edit-form.component/edit-form.component';
import { GoogleMapComponent } from './components/google-map.component/google-map.component';
import { HeaderComponent } from './components/header.component/header.component';
import { ItemDetailsComponent } from './components/item-details.component/item-details.component';
import { ItemComponent } from './components/item.component/item.component';
import { ItemsComponent } from './components/items.component/items.component';
import { ListComponent } from './components/list.component/list.component';
import { ListsComponent } from './components/lists.component/lists.component';
import { LoaderComponent } from './components/loader.component/loader.component';
import { ModalComponent } from './components/modal.component/modal.component';
import { NotificationComponent } from './components/notification.component/notification.component';
import { PageNotFoundComponent } from './components/page-not-found.component/page-not-found.component';
import { SettingWindowComponent } from './components/setting-window.component/setting-window.component';
import { SignInComponent } from './components/sign-in.component/sign-in.component';
import { SignUpComponent } from './components/sign-up.component/sign-up.component';
import { MapTooltipDirective } from './directives/map-tooltip.directive';
import { FormAwayGuard } from './guards/form-away.guard';
import { IItemHttpService } from './interfaces/i.item.http';
import { IListHttpService } from './interfaces/i.list.http';
import { IUserHttpService } from './interfaces/i.user.http';
import { MockItemHttpService } from './mock/mock.item.http.service';
import { MockListHttpService } from './mock/mock.list.http.service';
import { MockUserHttpService } from './mock/mock.user.http.service';
import { CapitalizePipe } from './pipes/capitilize.pipe';
import { LoaderService } from './services/loader.service';
import { ModalService } from './services/modal.service';
import { NotificationService } from './services/notification.service';
import { Store } from './services/store.service';
import { UnsavedEntitiesFactory } from './services/unsaved-entities-factory.service';
import { HomeComponent } from './components/home.component/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
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
    PageNotFoundComponent,
    NotificationComponent,
    GoogleMapComponent,
    SignInComponent,
    SignUpComponent,
    CapitalizePipe,
    MapTooltipDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MyDatePickerModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCXHioGLeLWvHGHdO47hiwu2VlUzb1fZiA',
      language: 'ru',
      libraries: ['places'],
    }),
    NgDragDropModule.forRoot(),
    AgmSnazzyInfoWindowModule,
  ],
  providers: [
    Store,
    LoaderService,
    ModalService,
    UnsavedEntitiesFactory,
    NotificationService,
    MarkerManager,
    GoogleMapsAPIWrapper,
    FormAwayGuard,
    AdminGuard,
    { provide: IUserHttpService, useClass: MockUserHttpService }, // mock: MockUserHttpService, original: UserHttpService
    { provide: IListHttpService, useClass: MockListHttpService }, // mock: MockListHttpService, original: ListHttpService
    { provide: IItemHttpService, useClass: MockItemHttpService }, // mock: MockItemHttpService, original: ItemHttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
