/**
 *   soiNewAthlete
 *   04-08-2019
 *   @ Damien Fleminks
 */
import { LightningElement,track,wire,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import addSports from '@salesforce/apex/SOI_AthleteController.newSports';
import theUser from '@salesforce/apex/SOI_AthleteController.getUser';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import DOB from '@salesforce/schema/Contact.Birthdate';
import COMMENTS from '@salesforce/schema/Contact.SOI_Comments__c';
import CONS_ID from '@salesforce/schema/Contact.SOI_ConsID__c';
import ACCOUNT from '@salesforce/schema/Contact.AccountId';


export default class Soi_newAthlete extends LightningElement {
    

    // Track if modal is open or not
    @track openmodel = false;

    // Object and field variables for submit form
    contactObject = CONTACT_OBJECT;
    firstName = FIRSTNAME_FIELD;
    lastName = LASTNAME_FIELD;
    birthdate = DOB;
    comments = COMMENTS;
    athleteId = CONS_ID;
    accountId =  ACCOUNT;
    
    @track submitDisabled = false;

    @api userAccountId;

    //Get object information such as record types
    @track objectInfo;
    @wire(getObjectInfo, { objectApiName: CONTACT_OBJECT })
    objectInfo;


    //Return the record type Id for 'Athlete'
    get recordTypeId() {
        // Returns a map of record type Ids 
        const rtis = this.objectInfo.data.recordTypeInfos;
        return Object.keys(rtis).find(rti => rtis[rti].name === 'Athlete');
    }

    @track _selected = [];

    @track options = [];

    get selected() {
        return this._selected.length ? this._selected : false;
    }

    constructor(){
        super();
        theUser()
            .then(result => {
                console.log('User returned');
                console.log(result);
                if(result.Contact){
                    this.userRecord = result;
                    let newSports = [];
                    let sportList =  result.Contact.Account.SOI_venueSports__c.split(';');
                    for(let sport of sportList){
                        newSports.push({label: sport, value: sport });
                    }
                    this.options = newSports;
                    console.log('clubSports: ');
                    console.log(this.options);
                  
                }
            })
            .catch(error => {
                console.log('ERROR on theUser()');
                console.log(error);
                let toastInfo = {
                    "myTitle" : "Error getting user details",
                    "myMessage" : `Unbale to get user, please try to load again or contact the administrator. Error message: ${error}`,
                    "variant" : "error"
                };
            })
        }

    handleChange(e) {
        this._selected = e.detail.value;
    }

    handleSubmit(event){
        this.submitDisabled = true;
        event.preventDefault();       // stop the form from submitting
        const fields = event.detail.fields;
        fields.AccountId = this.userAccountId;
        fields.SOI_IsNew__c = true;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
     }


     /**
      *  After form for new athlete is submitted, use the contactId of the newly created record to associate the assigned sports as related records 
      * @param {*} event 
      */
    successHandle(event){
        console.log('EXECUTE successHandle');
        console.log(event.detail.id);
        
        if(this.selected){
            console.log('his.selected) true');
            console.log('event.detail.Id: ' + event.detail.id);
            addSports({ sportList: this.selected, contactId: event.detail.id})
                .then(result => {
                    console.log('event.detail successful');
                    let toastInfo = {
                        "myTitle" : "Succesfully created Athlete",
                        "myMessage" : `Athelete is created and sports have been added`,
                        "variant" : "success"
                    };
                    this.submitDisabled = false;
                    this.triggerToast(toastInfo);
                    this.closeModal();
                    const selectedEvent = new CustomEvent('refreshApexEvent', { bubbles: true });
                    this.dispatchEvent(selectedEvent);
                    
                })
                .catch(error => {
                    console.log('ERROR on successHandle');
                    console.log(error);
                    let toastInfo = {
                        "myTitle" : "Error adding athlete sports",
                        "myMessage" : `Athlete csuccesfully created, but an error occurred adding the sports. Please try again or contact the administrator. Error message: ${error}`,
                        "variant" : "error"
                    };
                    this.submitDisabled = false;
                    this.triggerToast(toastInfo);
                    this.closeModal();
                    const selectedEvent = new CustomEvent('refreshApexEvent', { bubbles: true });
                    this.dispatchEvent(selectedEvent);
                });
        }else{
            let toastInfo = {
                "myTitle" : "Succesfully created Athlete",
                "myMessage" : `Athelete is created, but no sports have been added yet`,
                "variant" : "success"
            };
            this.submitDisabled = false;
            this.triggerToast(toastInfo);
            this.closeModal();
            const selectedEvent = new CustomEvent('refreshApexEvent', { bubbles: true });
            this.dispatchEvent(selectedEvent);
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
    }


}