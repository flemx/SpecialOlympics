import { LightningElement,track,wire } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import DOB from '@salesforce/schema/Contact.Birthdate';
import COMMENTS from '@salesforce/schema/Contact.SOI_Comments__c';
import CONS_ID from '@salesforce/schema/Contact.SOI_ConsID__c';


export default class Soi_newAthlete extends LightningElement {
    
    @track openmodel = false;

    contactObject = CONTACT_OBJECT;
    firstName = FIRSTNAME_FIELD;
    lastName = LASTNAME_FIELD;
    birthdate = DOB;
    comments = COMMENTS;
    athleteId = CONS_ID;
    //surname = '';
    //firstname = '';

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


    /*
    handleFirstName(event) {
        this.firstname = event.target.value;
    }
    handleLastName(event) {
        this.surname = event.target.value;
    }
    */

    testHandle(event){
        const payload = event.detail;
        console.log(payload);
    }
    

    handleAthleteCreated(){
        const fields = {};
        fields[NAME_FIELD.fieldApiName] = this.surname;
        const recordInput = { apiName: CONTACT_OBJECT.objectApiName, fields };
        console.log(recordInput);
        
        createRecord(recordInput)
            .then(contact => {
                console.log(`Contact Id: ${contact.Id}`);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Athlete created',
                        variant: 'success',
                    }),
                );
            })
            .catch(error => {
                console.log('error');
                console.log(error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
            
    }

    openmodal() {
        this.openmodel = true
    }
    closeModal() {
        this.openmodel = false
    } 

}