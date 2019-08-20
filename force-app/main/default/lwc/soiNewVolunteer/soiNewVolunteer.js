/**
 *   SoiNewVolunteer
 *   18-08-2019
 *   @ Damien Fleminks
 */
import { LightningElement,track,wire,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import addRoles from '@salesforce/apex/SOI_VolunteerController.newRoles';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import COMMENTS from '@salesforce/schema/Contact.SOI_Comments__c';
import CONS_ID from '@salesforce/schema/Contact.SOI_ConsID__c';
import ACCOUNT from '@salesforce/schema/Contact.AccountId';
import { roleOptions } from 'c/soi_configVariables';


export default class SoiNewVolunteer extends LightningElement {
     // Track if modal is open or not
     @track openmodel = false;

     // Object and field variables for submit form
     contactObject = CONTACT_OBJECT;
     firstName = FIRSTNAME_FIELD;
     lastName = LASTNAME_FIELD;
     comments = COMMENTS;
     volunteerId = CONS_ID;
     accountId =  ACCOUNT;
     
     @track submitDisabled = false;
 
     @api userAccountId;

     @api volunteerType;

     //Get object information such as record types
    @track objectInfo;
    @wire(getObjectInfo, { objectApiName: CONTACT_OBJECT })
    objectInfo;


    //Return the record type Id for 'Athlete'
    get recordTypeId() {
        // Returns a map of record type Ids 
        const rtis = this.objectInfo.data.recordTypeInfos;
        return Object.keys(rtis).find(rti => rtis[rti].name === 'Volunteer');
    }

    //All the available and selected options
    @track _selected = [];
    options = roleOptions;

    get selected() {
        return this._selected.length ? this._selected : false;
    }

    handleChange(e) {
        this._selected = e.detail.value;
    }

    handleSubmit(event){
        this.submitDisabled = true;
        event.preventDefault();       // stop the form from submitting
        const fields = event.detail.fields;
        fields.AccountId = this.userAccountId;
        fields.SOI_VolunteerType__c = this.volunteerType;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
     }


     /**
      *  After form for new athlete is submitted, use the contactId of the newly created record to associate the assigned sports as related records 
      * @param {*} event 
      */
    successHandle(event){
        console.log('EXECUTE successHandle');
        console.log(event.detail.id);
        console.log("this.selected: ");
        console.log(this.selected);
        if(this.selected){
            console.log('This.selected true');
            console.log('event.detail.Id: ' + event.detail.id);
            addRoles({ roleList: this.selected, contactId: event.detail.id})
                .then(result => {
                    console.log('event.detail successful');
                    let toastInfo = {
                        "myTitle" : "Succesfully created volunteer",
                        "myMessage" : `Volunteer is created and roles have been added`,
                        "variant" : "success"
                    };
                    this.triggerToast(toastInfo);
                })
                .catch(error => {
                    console.log('ERROR on successHandle');
                    console.log(error);
                    let toastInfo = {
                        "myTitle" : "Error adding volunteer roles",
                        "myMessage" : `Volunteer succesfully created, but an error occurred adding the roles. Please try again or contact the administrator. Error message: ${error}`,
                        "variant" : "error"
                    };
                    this.triggerToast(toastInfo);
                });
        }else{
            let toastInfo = {
                "myTitle" : "Succesfully created volunteer",
                "myMessage" : `Volunteer is created, but no roles have been added yet`,
                "variant" : "success"
            };
            this.triggerToast(toastInfo);
        }   

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
        this.submitDisabled = false;
        this.closeModal();
        const selectedEvent = new CustomEvent('refreshApexEvent', { bubbles: true });
        this.dispatchEvent(selectedEvent);
    }


}