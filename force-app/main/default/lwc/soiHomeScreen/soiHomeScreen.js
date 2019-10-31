import { LightningElement, track } from 'lwc';
import theUser from '@salesforce/apex/SOI_User.getAccount';

export default class SoiHomeScreen extends LightningElement {

    @track clubName;

    isRun = false;

    renderedCallback(){
        if(!this.isRun){
            theUser()
            .then(result => {
                console.log('User returned');
                console.log(result);
                if(result.Contact){
                    this.clubName = result.Contact.Account.Name;
                }
            })
            .catch(error => {
                console.log('ERROR on theUser()');
                console.log(error);
      
            });
        }
        this.isRun = true;
    }

}