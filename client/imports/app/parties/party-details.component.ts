import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/map';

import { Parties } from '../../../../both/collections/parties.collection';
import { Party } from '../../../../both/models/party.model';

import template from './party-details.component.html';

@Component({
        selector: 'party-details',
        template
})

export class PartyDetailsComponent implements OnInit, OnDestroy {
        partyId: string;
        paramsSub: Subscription;
        party: Party;

        constructor(private route: ActivatedRoute) { }
        


        ngOnInit() {
                this.paramsSub = this.route.params
                        .map(params => params['partyId'])
                        .subscribe(partyId => {
                                this.partyId = partyId
                                this.party = Parties.findOne(this.partyId);
                        });
        }
        
        //Component가 더 이상 view에 없고, DOM에서 제거되었을 때 호출된다.
        ngOnDestroy() {
                this.paramsSub.unsubscribe();
        }
        
}