import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent {

  private selectData: File = null;

  constructor(
    private elementRef: ElementRef,
    private readonly router: Router,
  ) {}

  qwe: FormData;
  public password: string = '';
  public photo: File[] = [];

  public change(event) {
    this.selectData = event.target.files[0];
  }

  public save() {
    if (this.selectData) {
      const fd = new FormData();
      fd.append('image', this.selectData, this.selectData.name);

      this.elementRef.nativeElement.ownerDocument.body.style.background = `url(assets/${this.photo[this.photo.length - 1].name})`;
    }
    this.router.navigate(['lists']);
  }
}
