import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import ASSETS from '@salesforce/resourceUrl/AF_assets';

export default class af_navigation extends NavigationMixin(LightningElement) {
    @api pagenum
    @api accountId;

    /* Icons used for nav manu */
    @track myIcons = {
        "home" : ASSETS + '/icons/home.png',
        "athletes" : ASSETS + '/icons/athlete.png',
        "club" : ASSETS + '/icons/club.png',
        "venues" : ASSETS + '/icons/venue.png',
        "submit" : ASSETS + '/icons/submit.png',
        "volunteers" : ASSETS + '/icons/volunteer.png'
    };

    /* Open account page */
    openClub(){
        console.log(this.accountId);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                //recordId: '0013E0000163bj2QAA',
                recordId: this.accountId,
                actionName: 'view'
            }
        });
    }

    /* Open page in community */
    openPage(event){
        let pageName;
        if(event.target.nodeName === "P" || event.target.nodeName === "img"){
            pageName = event.target.parentNode.getAttribute("data-page");
            window.console.log('Opening page: ' + pageName);
        }
        else{
            pageName = event.target.getAttribute("data-page");
            window.console.log('Opening page: ' + pageName);
        }        
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: pageName
            }
        });
        
    }

    renderedCallback(){
        /* Set selected page */
        this.template.querySelector(`.${this.pagenum}`).classList.add('selected');
        this.myIcons[this.pagenum] = ASSETS + `/icons/${this.pagenum}2.png`;

        
    }
}