
/**
 *   SoiEditVolunteer
 *   20-08-2019
 *   @ Damien Fleminks
 */
import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updateroles from '@salesforce/apex/SOI_VolunteerController.editRoles';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import FULLNAME from '@salesforce/schema/Contact.Name';
import COMMENTS from '@salesforce/schema/Contact.SOI_Comments__c';
import CONS_ID from '@salesforce/schema/Contact.SOI_ConsID__c';
import ACCOUNT from '@salesforce/schema/Contact.AccountId';
import CERT_ID from '@salesforce/schema/Contact.SOI_Certificate__c';
import MEM_CARD from '@salesforce/schema/Contact.SOI_Membership_Card__c';
import { roleList } from 'c/soi_configVariables';


export default class SoiEditVolunteer extends LightningElement {

        // Track if modal is open or not
        @api openmodel = false;
        @api contactId;
    
        // Object and field variables for submit form
        contactObject = CONTACT_OBJECT;
        fullName = FULLNAME;
        comments = COMMENTS;
        safeguarding = CERT_ID;
        volunteerId = CONS_ID;
        accountId =  ACCOUNT;
        membershipCard = MEM_CARD;
    
        //Disable submit button
        @track submitDisabled = false;
    
        // Track newly added role
        newRoles;
    
        //All the available and selected options
        @track _selected = [];
        @track options = [];
        allRoles = roleList;
       
    
        get selected() {
            return this._selected.length ? this._selected : false;
        }
    
        // set current roles
        _currentRoles;
        @api get currentRoles(){
            return this._currentRoles;
        }
        set currentRoles(value){
            this._selected = [];
            this._currentRoles = value.split(',').map(Function.prototype.call, String.prototype.trim);
            this._selected.push(...this._currentRoles);
        }

        @track
        radioOptions = [
            {'label': 'All', 'value': 'All'},
            {'label': 'General', 'value': 'General'},
            {'label': 'Management', 'value': 'Management'},
            {'label': 'Coach', 'value': 'Coach'}
        ];
    
        // Select option1 by default
        @track
        radioValue = 'All';
    
        handleRadioChange(event) {
            const filterType = event.detail.value;
            console.log(`Option selected with value: ${filterType}`);
            let selected = this.selected;
            console.log(selected);
            this.options = [];
            let tempList = [];
            if(filterType !== 'All'){
                tempList =  this.allRoles.filter(function(role) {
                    return role.Type === filterType;
                });
            }else{
                tempList = this.allRoles;
            }
            for(let role of tempList){
                this.options.push({ label: role.Name, value: role.Name})
            }
            for(let role of selected){
                this.options.push({ label: role, value: role})
            }
            
        }


        constructor(){
            super();
            for(let role of this.allRoles){
                this.options.push({ label: role.Name, value: role.Name})
            }
        }
    
        handleChange(e) {
            this._selected = e.detail.value;
        }
    
        openmodal() {
            this.openmodel = true
        }
        closeModal() {
            this.openmodel = false
        } 
    
    
        handleSubmit(){
            this.submitDisabled = true;
            //event.preventDefault();       // stop the form from submitting
    
         }
    
    
          /**
          *  After form for new volunteer is submitted, use the contactId of the newly created record to associate the assigned roles as related records 
          * @param {*} event 
          */
        successHandle(event){
            let isChanged = false;
            console.log('EXECUTE successHandle');
            console.log(this.currentRoles);
            // Get array of newly added roles
            let newRoles = this._selected.filter(
                (role)=>{
                    if(!this._currentRoles.includes(role)){
                        isChanged = true;
                        return true;
                    }
                    return false;
                }
            );
            console.log(newRoles);
            //Get array of removed roles
            let removedRoles = this._currentRoles.filter(
                (role)=>{
                    if(!this._selected.includes(role)){
                        isChanged = true;
                        return true;
                    }
                        return false;
                }
            );
            console.log(removedRoles);
    
    
            if(isChanged){
                console.log('Changes to roles detected');
                updateroles({ rolesList: [newRoles,removedRoles], contactId: this.contactId})
                    .then(result => {
                        console.log('event.detail successful');
                        let toastInfo = {
                            "myTitle" : "Succesfully updated volunteer",
                            "myMessage" : `Volunteer is updated and roles have been modified`,
                            "variant" : "success"
                        };
                        this.triggerToast(toastInfo);
                    })
                    .catch(error => {
                        console.log('ERROR on successHandle');
                        console.log(error);
                        let toastInfo = {
                            "myTitle" : "Error updating volunteer roles",
                            "myMessage" : `volunteer succesfully updated, but an error occurred updating the roles. Please try again or contact the administrator. Error message: ${error}`,
                            "variant" : "error"
                        };
                        this.triggerToast(toastInfo);
                    });
            }else{
                let toastInfo = {
                    "myTitle" : "Succesfully created volunteer",
                    "myMessage" : `Volunteer is updated, but no roles have modified`,
                    "variant" : "success"
                };
                this.triggerToast(toastInfo);
            }   
            
    
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