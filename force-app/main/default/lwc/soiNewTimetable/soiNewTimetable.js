import { LightningElement,track,wire,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

import TIMETABLE_OBJECT from '@salesforce/schema/SOI_Venue_timetable__c';
import NAME from '@salesforce/schema/SOI_Venue_timetable__c.Name';
import SOI_VENUE from '@salesforce/schema/SOI_Venue_timetable__c.SOI_Venue__c';

import MON_S from '@salesforce/schema/SOI_Venue_timetable__c.monStart__C';
import MON_E from '@salesforce/schema/SOI_Venue_timetable__c.monEnd__C';
import TUE_S from '@salesforce/schema/SOI_Venue_timetable__c.tueStart__C';
import TUE_E from '@salesforce/schema/SOI_Venue_timetable__c.tueEnd__C';
import WED_S from '@salesforce/schema/SOI_Venue_timetable__c.wedStart__C';
import WED_E from '@salesforce/schema/SOI_Venue_timetable__c.wedEnd__C';
import THU_S from '@salesforce/schema/SOI_Venue_timetable__c.thuStart__C';
import THU_E from '@salesforce/schema/SOI_Venue_timetable__c.thuEnd__C';
import FRI_S from '@salesforce/schema/SOI_Venue_timetable__c.friStart__C';
import FRI_E from '@salesforce/schema/SOI_Venue_timetable__c.friEnd__C';
import SAT_S from '@salesforce/schema/SOI_Venue_timetable__c.satStart__C';
import SAT_E from '@salesforce/schema/SOI_Venue_timetable__c.satEnd__C';
import SUN_S from '@salesforce/schema/SOI_Venue_timetable__c.sunStart__C';
import SUN_E from '@salesforce/schema/SOI_Venue_timetable__c.sunEnd__C';



export default class SoiNewTimetable extends LightningElement {

    // Track if modal is open or not
    @track openmodel = false;

    // Object and field variables for submit form
    timetableObject = TIMETABLE_OBJECT;
    sportName = NAME;
    venue = SOI_VENUE;

    monS = MON_S;
    monE = MON_E;
    tueS = TUE_S;
    tueE = TUE_E;
    wedS = WED_S;
    wedE = WED_E;
    thuS = THU_S;
    thuE = THU_E;
    friS = FRI_S;
    friE = FRI_E;
    satS = SAT_S;
    satE = SAT_E;
    sunS = SUN_S;
    sunE = SUN_E;

    @track monStart;
    @track monEnd;

    
    @track submitDisabled = false;

    @api userAccountId;

    //Get object information such as record types
    @track objectInfo;
    @wire(getObjectInfo, { objectApiName: TIMETABLE_OBJECT })
    objectInfo;



    get selected() {
        return this._selected.length ? this._selected : false;
    }

    handleChange(e) {
        this._selected = e.detail.value;
    }
    
    handleSubmit(event){
        this.submitDisabled = true;
        //event.preventDefault();       // stop the form from submitting
        //const fields = event.detail.fields;
        //this.template.querySelector('lightning-record-edit-form').submit(fields);
     }
     


     /**
      *  After form for new athlete is submitted, use the contactId of the newly created record to associate the assigned sports as related records 
      * @param {*} event 
      */
    successHandle(event){
        console.log('EXECUTE successHandle');
        let toastInfo = {
            "myTitle" : "Succesfully created timetable",
            "myMessage" : `Timetable is created`,
            "variant" : "success"
        };
        this.submitDisabled = false;
        this.triggerToast(toastInfo);
        this.closeModal();
        const selectedEvent = new CustomEvent('refreshApexEvent', { bubbles: true });
        this.dispatchEvent(selectedEvent);

    }
    


    openmodal() {
        this.openmodel = true
    }
    closeModal() {
        this.openmodel = false
    } 

    /**
     *  Function to trigger a toast pop-up message dynamically
     * @param {*} toastInfo
     */
    triggerToast(toastInfo){
        const evt = new ShowToastEvent({
            title: toastInfo.myTitle,
            message: toastInfo.myMessage,
            variant: toastInfo.variant,
        });
        this.dispatchEvent(evt);
    }
}