
import { Meteor } from 'meteor/meteor';
import { loadParties } from './imports/fixtures/parties';
"../../../both/collections/demo.collection";
 
Meteor.startup(() => { loadParties(); });



