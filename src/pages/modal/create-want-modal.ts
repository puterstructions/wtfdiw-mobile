import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ViewController} from 'ionic-angular';
import database = firebase.database;

import {AuthProvider} from '../../providers/auth.provider';
import {DataProvider} from '../../providers/data.provider';
import {WantItem} from '../../modules/wants/want.item';

@Component({
  selector: 'page-create-want',
  templateUrl: 'create-want-modal.html'
})

export class CreateWantModalPage {
  form: FormGroup;
  description: string;

  constructor(private view: ViewController,
              private formBuilder: FormBuilder,
              private auth: AuthProvider,
              private data: DataProvider) {
    this.form = this.formBuilder.group({
      description: ['', Validators.required],
    });
  }

  submitForm() {
    let want = new WantItem({
      description: this.description,
      ts: (<any>database).ServerValue.TIMESTAMP,
      isDeleted: false,
      isDecided: false,
    });
    this.data.list(`/wants/${this.auth.getKey()}`)
      .push(want)
      .then(() => this.dismiss());
  }

  dismiss() {
    this.view.dismiss();
  }
}
