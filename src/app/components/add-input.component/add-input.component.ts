import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { CustomValidator } from '../../validators/validator';
import { Base } from '../base.component';
import { fadeTooltip } from '../../animations/fade-tooltip';
@Component({
  selector: 'app-add-input',
  templateUrl: './add-input.component.html',
  styleUrls: ['./add-input.component.css'],
  animations: [ fadeTooltip() ]
})
export class AddInputComponent implements OnInit {

  public titleForm: FormGroup;
  public errorMessage: string = '';

  @Input() public message: string = '';
  @Output() public addEvent = new EventEmitter();

  constructor(private readonly fb: FormBuilder) {}

  public add(): void {
    this.setMessage();
    if (!this.errorMessage.length) {
      this.addEvent.emit(this.titleForm.get('title').value);
      this.clear();
    }
  }

  public clear(): void {
    this.titleForm.get('title').setValue('');
  }

  public closeMessage(): void {
    this.errorMessage = '';
  }

  private createForm(): void {
    this.titleForm = this.fb.group({
      title: ['', { validators: [ CustomValidator.titleRequiredLength ], updateOn: 'submit'}],
    });
  }

  private setMessage(): void {
    const emailControl = this.titleForm.get('title');
    if (emailControl.errors) this.errorMessage = 'Title must be at 1 to 256 characters';
    else this.closeMessage();
  }

  ngOnInit(): void {
    this.createForm();
  }
}
