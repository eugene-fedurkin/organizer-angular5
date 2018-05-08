import { Component, OnInit, OnDestroy, NgZone, ViewChild,
ElementRef } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { IMyDpOptions } from 'mydatepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '../../services/store.service';
import { Base } from '../base.component';
import { User } from '../../models/user.model';
import { Item } from '../../models/item.model';

import { MapsAPILoader, AgmMap } from '@agm/core';

import 'snazzy-info-window/dist/snazzy-info-window.min.css';

import { marker } from './marker-config';

declare var google: any;

@Component({
  selector: 'edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css']
})
export class EditForm extends Base implements OnInit, OnDestroy {

  @ViewChild('search') public search: ElementRef;
  @ViewChild('map') public map;
  private mapRef;

  private listId: number;
  private itemId: number;
  public item: Item;
  public itemTitle: string;
  public itemDescription: string;
  public itemIdSubscription: Subscription;
  public listIdSubscription: Subscription;
  private autocomplete;
  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd.mm.yyyy',
  };

  public marker = marker;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private mapsAPILoader: MapsAPILoader,
    private zone: NgZone,
  ) { super(); }

  public model: any = { date: { year: 2018, month: 10, day: 9 } };

  public mapReady(mapRef) {
    this.mapRef = mapRef;
  }

  public dragEnd(event) {
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(event.coords.lat, event.coords.lng);
    const request = { latLng: latlng };

    geocoder.geocode(request, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0] != null) {
          this.marker.address = results[0].formatted_address;
        } else {
          alert("No address available"); // TODO: notification
        }
      }
    });
  }

  public saveChanges(): void {
    this.item.title = this.itemTitle;
    this.item.description = this.itemDescription;

    this.closeForm();
  }

  public closeForm(): void {
    this.router.navigate([`lists/${this.listId}/${this.itemId}/details`]);
  }

  private initializeItem(user: User): void {
    const list = user.lists.find(list => list.id === this.listId);
    const item = list.items.find(item => item.id === this.itemId);

    this.item = item;
    this.itemTitle = item.title;
    this.itemDescription = item.description;
    if (item.marker) {
      this.marker.address = item.marker.address;
      this.marker.latitude = item.marker.coordinates.lat;
      this.marker.longitude = item.marker.coordinates.lng;
    }
  }

  private changeMapLocation(): void {
    this.zone.run(() => {
      const place = this.autocomplete.getPlace();

      if (!place.geometry) {
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }
      this.marker.latitude = place.geometry.location.lat();
      this.marker.longitude = place.geometry.location.lng();
      this.marker.address = place.address_components.reduce((prev, current) => {
        if (prev) return `${prev}, ${current['long_name']}`;
        else return `${current['long_name']}`;
      }, '');

      this.mapRef.setCenter(place.geometry.location);
      this.mapRef.setZoom(17);
    })
  }

  ngOnInit() {
    this.itemIdSubscription = this.route.parent.params
      .takeUntil(this.destroy)
      .subscribe(param => this.itemId = +param.itemId);
    this.listIdSubscription = this.route.parent.parent.params
      .takeUntil(this.destroy)
      .subscribe(param => this.listId = +param.listId);
    this.store.cast
      .takeUntil(this.destroy)
      .subscribe(user => {
        if (user) {
          this.initializeItem(user);
        }
      }
    )
    this.mapsAPILoader.load()
      .then(() => {
        this.autocomplete = new google.maps.places.Autocomplete(this.search.nativeElement, { types: ['address'] });

        this.autocomplete.addListener('place_changed', () => this.changeMapLocation())
    });
  }

  OnDestroy() {
    this.destroy.next();
    this.autocomplete.removeEventListener('place_changed', this.changeMapLocation)
  }
}
