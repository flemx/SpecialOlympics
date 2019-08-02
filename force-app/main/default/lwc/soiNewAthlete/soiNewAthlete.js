import { LightningElement,track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import NAME_FIELD from '@salesforce/schema/Contact.Name';

export default class Soi_newAthlete extends LightningElement {
    
    @track openmodel = false;

    //contactObject = CONTACT_OBJECT;
    //nameField = NAME_FIELD;
    name = '';


    handleNameChange(event) {
        this.name = event.target.value;
    }

    handleAthleteCreated(){
        const fields = {};
        fields[NAME_FIELD.fieldApiName] = this.name;
        const recordInput = { apiName: CONTACT_OBJECT.objectApiName, fields };
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
    saveMethod() {
        console.log('save method invoked');
        this.closeModal();
    }
}