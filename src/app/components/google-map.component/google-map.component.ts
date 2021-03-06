import { MapsAPILoader } from '@agm/core';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, HostBinding } from '@angular/core';

import { Marker } from '../../models/marker.model';
import { NotificationService } from '../../services/notification.service';
import { styles } from './google-map.styles';
import { markerConfig } from './marker-config';

declare const google: any;

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleMapComponent implements OnInit {

  constructor(
    private readonly zone: NgZone,
    private readonly mapsAPILoader: MapsAPILoader,
    private readonly notify: NotificationService,
  ) {}

  @Input() public markerDraggable: boolean;
  @Input() public mapZoom: number;
  @Input() public mapMarker: Marker;
  @Input() public searchElement: ElementRef;
  @Output() public saveMarkerData = new EventEmitter<Marker>();

  public markerConfig = markerConfig;
  private autocomplete: any;
  public googleMapStyles = styles;
  private mapRef: any;

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
          if (!this.mapMarker) this.mapMarker = new Marker();

          this.mapMarker.address = results[0].formatted_address;
          this.mapMarker.latitude = results[0].geometry.location.lat();
          this.mapMarker.longitude = results[0].geometry.location.lng();
          this.saveMarkerData.emit(this.mapMarker);
        } else {
          this.notify.addNotification('No address available');
        }
      }
    });
  }

  private changeMapLocation(): void {
    this.zone.run(() => {
      const place = this.autocomplete.getPlace();

      if (!place.geometry) {
        this.notify.addNotification(`No details available for input: ${place.name}`);
        return;
      }
      this.mapMarker.latitude = place.geometry.location.lat();
      this.mapMarker.longitude = place.geometry.location.lng();
      this.mapMarker.address = place.address_components.reduce((prev, current) => {
        if (prev) return `${prev}, ${current['long_name']}`;
        else return `${current['long_name']}`;
      }, '');

      this.saveMarkerData.emit(this.mapMarker);
      this.mapRef.setCenter(place.geometry.location);
      this.mapRef.setZoom(this.markerConfig.zoom);
    });
  }

  public ngOnInit(): void {
    this.mapsAPILoader.load()
      .then(() => {
        if (this.searchElement) {
          this.autocomplete = new google.maps.places.Autocomplete(this.searchElement);
          this.autocomplete.addListener('place_changed', () => this.changeMapLocation());
        }
      });
  }

  public OnDestroy(): void {
    if (this.searchElement) {
      this.autocomplete.removeEventListener('place_changed', this.changeMapLocation); // TODO: need?
    }
  }
}
