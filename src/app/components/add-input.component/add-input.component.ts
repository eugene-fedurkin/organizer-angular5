import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-input',
  templateUrl: './add-input.component.html',
  styleUrls: ['./add-input.component.css']
})
export class AddInputComponent {

  public title: string = '';
  @Input() public message: string = '';
  @Output() public addEvent = new EventEmitter();

  public add(): void {
    this.addEvent.emit(this.title);
    this.title = '';
  }

  public clear(): void {
    this.title = '';
  }
}
