import 'snazzy-info-window/dist/snazzy-info-window.min.css';

import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, HostBinding, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMyDateModel, IMyDpOptions } from 'mydatepicker';
import { Subscription } from 'rxjs/Subscription';

import { bounceTop } from '../../animations/bounce-edit-form';
import { Item } from '../../models/item.model';
import { Marker } from '../../models/marker.model';
import { User } from '../../models/user.model';
import { Store } from '../../services/store.service';
import { Base } from '../base.component';
import { styles } from './google-map.styles';
import { markerConfig } from './marker-config';
import { IItemHttpService } from '../../interfaces/i.item.http';

declare var google: any;

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css'],
  animations: [ bounceTop() ],
})
export class EditFormComponent extends Base implements OnInit, OnDestroy {

  @HostBinding('@bounceTop') private animateProfile = true;
  @ViewChild('search') public search: ElementRef;
  @ViewChild('map') public map;
  private mapRef;

  private listId: number;
  private itemId: number;
  public savedItem: Item;
  public googleMapStyles = styles;
  public item: Item;
  public itemIdSubscription: Subscription;
  public listIdSubscription: Subscription;
  private autocomplete;

  public dateModel: any = { date: { } };
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
  };

  public markerConfig = markerConfig;

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store,
    private readonly mapsAPILoader: MapsAPILoader,
    private readonly zone: NgZone,
    private readonly http: IItemHttpService,
  ) { super(); }


  public mapReady(mapRef) {
    this.mapRef = mapRef;
  }

  public dragEnd(event) {
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(event.coords.lat, event.coords.lng);
    const request = { latLng: latlng };

    geocoder.geocode(request, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0] != null) {
          this.item.mapMarker.address = results[0].formatted_address;
          this.item.mapMarker.latitude = results[0].geometry.location.lat();
          this.item.mapMarker.longitude = results[0].geometry.location.lng();
        } else {
          alert('No address available'); // TODO: notification
        }
      }
    });
  }

  public saveChanges(): void {
    if (this.isEmpty(this.item.mapMarker)) this.item.mapMarker = null;

    const subscr = this.http.updateItem(this.item)
      .finally(() => subscr.unsubscribe())
      .subscribe(item => {
        this.savedItem.completed = this.item.completed;
        this.savedItem.description = this.item.description;
        this.savedItem.dueDate = this.item.dueDate;
        this.savedItem.mapMarker = this.item.mapMarker;
        this.savedItem.title = this.item.title;

        this.closeForm();
      }, error => {
        console.log('Error'); // TODO: nitify
      }
    );
  }

  public closeForm(): void {
    this.router.navigate(['lists', this.listId, this.itemId, 'details']);
  }

  private initializeItem(user: User): void {
    const list = user.lists.find(l => l.id === this.listId);
    const item = list.items.find(i => i.id === this.itemId);

    this.savedItem = item;
    this.item = new Item(
      item.id,
      item.title,
      item.description,
      item.completed,
      item.dueDate,
      item.listId,
      item.mapMarker,
    );
    if (item.mapMarker) {
      this.item.mapMarker.address = item.mapMarker.address;
      this.item.mapMarker.latitude = item.mapMarker.latitude;
      this.item.mapMarker.longitude = item.mapMarker.longitude;
    } else {
      this.item.mapMarker = new Marker();
    }

    const date = this.savedItem.dueDate
      ? this.savedItem.dueDate.split('-')
      : '';

    this.dateModel.date.year = this.savedItem.dueDate
      ? date[0]
      : (new Date()).getFullYear();
    this.dateModel.date.month = this.savedItem.dueDate
      ? date[1]
      : (new Date()).getMonth() + 1;
    this.dateModel.date.day = this.savedItem.dueDate
      ? date[2]
      : (new Date()).getDate();

      if (!this.item.dueDate) {
        this.item.dueDate = `${this.dateModel.date.year}-${this.dateModel.date.month}-${this.dateModel.date.day}`;
    }
  }

  private changeMapLocation(): void {
    this.zone.run(() => {
      const place = this.autocomplete.getPlace();

      if (!place.geometry) {
        window.alert(`No details available for input: ${place.name}`);
        return;
      }
      this.item.mapMarker.latitude = place.geometry.location.lat();
      this.item.mapMarker.longitude = place.geometry.location.lng();
      this.item.mapMarker.address = place.address_components.reduce((prev, current) => {
        if (prev) return `${prev}, ${current['long_name']}`;
        else return `${current['long_name']}`;
      }, '');

      this.mapRef.setCenter(place.geometry.location);
      this.mapRef.setZoom(this.markerConfig.zoom);
    });
  }

  public dateChanges(event: IMyDateModel): void {
    this.dateModel.date.year = event.date.year;
    this.dateModel.date.month = event.date.month;
    this.dateModel.date.day = event.date.day;

    if (!event.date.day || !event.date.month || !event.date.month) {
      console.log('Uncorrect date!'); // TODO: notify
      return;
    }

    this.item.dueDate = `${this.dateModel.date.year}-${this.dateModel.date.month}-${this.dateModel.date.day}`;
  }

  private isEmpty(obj: Object): boolean {
    return Object.keys(obj).length === 0;
  }

  public ngOnInit() {
    this.itemIdSubscription = this.route.parent.params
      .takeUntil(this.componentDestroyed)
      .subscribe(param => this.itemId = +param.itemId);
    this.listIdSubscription = this.route.parent.parent.params
      .takeUntil(this.componentDestroyed)
      .subscribe(param => this.listId = +param.listId);
    this.store.state$
      .takeUntil(this.componentDestroyed)
      .subscribe(user => {
        if (user) {
          this.initializeItem(user);
        }
      }
    );
    this.mapsAPILoader.load()
      .then(() => {
        this.autocomplete = new google.maps.places.Autocomplete(this.search.nativeElement);

        this.autocomplete.addListener('place_changed', () => this.changeMapLocation());
    });
  }

  public OnDestroy() {
    this.componentDestroyed.next();
    this.autocomplete.removeEventListener('place_changed', this.changeMapLocation);
  }
}
