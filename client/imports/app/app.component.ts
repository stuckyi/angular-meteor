import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Parties } from '../../../both/collections/parties.collection';
import { Party } from '../../../both/models/party.model';

import template from './app.component.html';
import appStyle from './app.component.css';

@Component({
  selector: 'app',
  template,
  appStyle
})
export class AppComponent {
  parties: Observable<Party[]>;

  constructor() {
    console.log(this.parties = Parties.find({}));
    console.log("Parties",Parties);
    this.parties = Parties.find({}).zone();
  }

  removeParty(party: Party): void {
    Parties.remove(party._id);
  }
}