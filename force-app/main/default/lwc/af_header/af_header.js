import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import ASSETS from '@salesforce/resourceUrl/AF_assets';

export default class Af_header extends NavigationMixin(LightningElement) {
    mainLogo = ASSETS + '/logos/soilogo.png';

    logoutNow(){
        let hostname = window.location.hostname;
        window.location.replace(`https://${hostname}/soiportal/secur/logout.jsp?retUrl=https://${hostname}/soiportal/`);
    }

    getHelp(){
        // Navigate to the Account home page
        this[NavigationMixin.Navigate]({
            "type": "standard__namedPage",
            "attributes": {
                "pageName": "help"    
            },
        }).then(url => {
            window.open(url);
        });
    }
}