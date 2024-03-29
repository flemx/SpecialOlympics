import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updateSports from '@salesforce/apex/SOI_AthleteController.editSports';
import theUser from '@salesforce/apex/SOI_AthleteController.getUser';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import DOB from '@salesforce/schema/Contact.Birthdate';
import COMMENTS from '@salesforce/schema/Contact.SOI_Comments__c';
import SOI_STATUS from '@salesforce/schema/Contact.SOI_MarkInactive__c';
import CONS_ID from '@salesforce/schema/Contact.SOI_ConsID__c';
import ACCOUNT from '@salesforce/schema/Contact.AccountId';


export default class SoiEditAthlete extends LightningElement {
    
    // Track if modal is open or not
    @api openmodel = false;
    @api contactId;
    @api isActive = false;

    // Object and field variables for submit form
    contactObject = CONTACT_OBJECT;
    firstName = FIRSTNAME_FIELD;
    lastName = LASTNAME_FIELD;
    birthdate = DOB;
    comments = COMMENTS;
    athleteId = CONS_ID;
    accountId =  ACCOUNT;
    deleteStatus = SOI_STATUS;
    //Disable submit button
    @track submitDisabled = false;

    // Track newly added sport
    newSports;



    //All the available and selected options
    @track _selected;

    get options(){
        return this._options;
    }
    _options = [];
    @track allOptionsList = [];


    get selected() {
        return this._selected.length ? this._selected : false;
    }

    // set current sports
    _currentSports;
    @api get currentSports(){
        return this._currentSports;
    }
    set currentSports(value){
        this._selected = [];
        this._currentSports = value.split(',').map(Function.prototype.call, String.prototype.trim);
        this._selected.push(...this._currentSports);
        //Checks for any selected values that are not part of the available options
        for(let selected of this._selected){
            if(!this.allOptionsList.includes(selected)){
                this._options.push({label: selected, value: selected });
            }
         
        } 
   
    }

       /**
     *  Get the current user record 
     */
    constructor(){
        super();
        theUser()
            .then(result => {
                console.log('User returned');
                console.log(result);
                if(result.Contact){
                    this.userRecord = result;
                    let newSports = [];
                    let sportList =  result.Contact.Account.SOI_venueSports__c.split(',').map(Function.prototype.call, String.prototype.trim);
                    for(let sport of sportList){
                        newSports.push({label: sport, value: sport });
                        this.allOptionsList.push(sport);
                    }
                    this._options = newSports;
                    console.log('clubSports: ');
                    console.log(this._options);
                  
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
            });

        

    }


    handleChange(e) {
        this._selected = e.detail.value;
        console.log(this._selected);
    }

    openmodal() {
        this.openmodel = true
    }
    closeModal() {
        this.openmodel = false
    } 

    handleError(){
        this.submitDisabled = false;
    }

    submitForm(){
        this.template.querySelector('.hidden-submit').click();
    }


    handleSubmit(){
        //event.preventDefault();       // stop the form from submitting
        this.submitDisabled = true;
     }


      /**
      *  After form for new athlete is submitted, use the contactId of the newly created record to associate the assigned sports as related records 
      * @param {*} event 
      */
    successHandle(event){
        let isChanged = false;
        console.log('EXECUTE successHandle');
        // Get array of newly added sports
        let newSports = this._selected.filter(
            (sport)=>{
                if(!this._currentSports.includes(sport)){
                    isChanged = true;
                    return true;
                }
                return false;
            }
        );
        console.log(newSports);
        //Get array of removed sports
        let removedSports = this._currentSports.filter(
            (sport)=>{
                if(!this._selected.includes(sport)){
                    isChanged = true;
                    return true;
                }
                    return false;
            }
        );
        console.log(removedSports);


        if(isChanged){
            console.log('Changes to sports detected');
            updateSports({ sportList: [newSports,removedSports], contactId: this.contactId})
                .then(result => {
                    console.log('event.detail successful');
                    let toastInfo = {
                        "myTitle" : "Succesfully updated Athlete",
                        "myMessage" : `Athelete is updated and sports have been modified`,
                        "variant" : "success"
                    };
                    this.triggerToast(toastInfo);
                })
                .catch(error => {
                    console.log('ERROR on successHandle');
                    console.log(error);
                    let toastInfo = {
                        "myTitle" : "Error updating athlete sports",
                        "myMessage" : `Athlete csuccesfully updated, but an error occurred updating the sports. Please try again or contact the administrator. Error message: ${error}`,
                        "variant" : "error"
                    };
                    this.triggerToast(toastInfo);
                });
        }else{
            let toastInfo = {
                "myTitle" : "Succesfully created Athlete",
                "myMessage" : `Athelete is updated, but no sports have modified`,
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