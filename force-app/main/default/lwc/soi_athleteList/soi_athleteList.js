/**
 *  soi_athletelist
 *   @ Damien Fleminks
 *  
 */
import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import athleteList from '@salesforce/apex/SOI_AthleteController.getAthletes';
import deleteAth from '@salesforce/apex/SOI_AthleteController.deleteAthlete';
import { refreshApex } from '@salesforce/apex';
import theUser from '@salesforce/apex/SOI_AthleteController.getUser';
//import { profileSettings } from 'c/soi_configVariables';
import { athleteColumns } from 'c/soi_configVariables';



export default class Soi_athleteList extends LightningElement {

    // Used to keep track of data sorting
    @track sortedBy;
    @track sortedDirection;

    // Variableds used to store the data, columns and error message used for the data table
    @track columns = athleteColumns;
    @track data;
    @track error;

    //Track search filter
    @track searchKey;

    // Track if renderedCallback was executed
    isRendered = false;
    
    // Raw data for filtering
    rawData;

    // Keep track of wiredAthletes result for refreshApex to work
    wiredAthletesResult;

    // Store the user record
    userRecord;

    // Keep track of the user's accountId
    @track userAccountId;
    
    /** 
     *  Wired function to get the athlete list and reset the search field
     * @param {*} result 
     */
    @wire(athleteList)
    wiredAthletes(result) {
        this.wiredContactResult = result;
        if(result.data) {
            this.data = result.data;
            this.rawData = result.data;
            this.error = undefined;
            this.template.querySelector('.searchbar').value = '';
        }
        else{
            console.log(' athleteList error');
            //console.log(result.error);
            let toastInfo = {
                "myTitle" : "Error loading athletes",
                "myMessage" : `Please reload or contact the administrator.`,
                "variant" : "error"
            };
            this.triggerToast(toastInfo);
            this.error = "Error loading athletes, please try to load the page again or contact the administrator if that does not resolve the problem.";
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
                    this.userAccountId = result.Contact.AccountId;
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

    // Add event listeners after first render
    renderedCallback(){
        if(!this.isRendered){
            this.isRendered = true;
        }
        const element = this.template.querySelector('.newAthlete');
        element.addEventListener('refreshApexEvent', ()=>{
            console.log('Received refreshApexEvent event');
            console.log('Refreshing athelete list');
            return refreshApex(this.wiredContactResult);
        });

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

      /**
     *  Event listener for table action buttons
     * @param {*} event 
     */
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'delete-record':
                this.deleteHandler(row);
                break;
            case 'view_details':
                break;
            default:
        }
    }

    /**
     *   Function to decide which delete action to execute
     * @param {*} row 
     */
    deleteHandler(row){
        console.log(`actionLabel is: ${row.SOI_ActionLabel__c}`);
        if(row.SOI_ActionLabel__c === 'Undelete'){
            let toastInfo = {
                "myTitle" : `Athlete succesfully Undeleted`,
                "myMessage" : `Athlete is not marked to be deleted anymore`,
                "variant" : "success"
            };
            this.deleteAthlete(row, 'Edited', toastInfo);
        }
        if(row.SOI_ActionLabel__c === 'Delete'){
            let toastInfo = {
                "myTitle" : `Athlete succesfully Deleted`,
                "myMessage" : `Athlete is marked as deleted, to undo this action, press the undelete buttton`,
                "variant" : "success"
            };
            this.deleteAthlete(row, 'Deleted',toastInfo);
        }
    }


    /**
     *  Function to update athlete status as Deleted
     * @param {*} row 
     * @param {*} newStatus 
     */
    deleteAthlete(row, newStatus, toastInfo){
        //console.log(row.Id);
        deleteAth({ Id: row.Id, status: newStatus, AccId: row.AccountId})
            .then(result => {
                console.log('deleteAthlete successful');
                this.triggerToast(toastInfo);
                //this.this = this.wiredAthletes;
                return refreshApex(this.wiredContactResult);
                //this.setDeleteButton(row,newStatus)
            })
            .catch(error => {
                let toastInfo = {
                    "myTitle" : `Error deleting athletes`,
                    "myMessage" : `Unable to delete the athlete, please try again or contact the admin`,
                    "variant" : "error"
                };
                this.triggerToast(toastInfo);
                console.log('ERROR on deleteAthlete' + error);
            });
    }



    /**
     *  Event listener for onsort 
     * @param {*} event 
     */
    updateColumnSorting(event) {
        var fieldName = event.detail.fieldName;
        var sortDirection = event.detail.sortDirection;
        console.log(fieldName);
        console.log(sortDirection);
        // assign the latest attribute with the sorted column fieldName and sorted direction
        this.sortedBy = fieldName;
        this.sortedDirection = sortDirection;
        //this.data = this.sortData(fieldName, sortDirection);
        this.sortData(fieldName, sortDirection);
   }

    /**
     *  Function to sort contacts list by given colum name
     * @param {*} fieldName 
     * @param {*} sortDirection 
     */
    sortData(fieldName, sortDirection){
        let data = JSON.parse(JSON.stringify(this.wiredAthletes));
        console.log(data.data);
        //function to return the value stored in the field
        let key =(a) => a[fieldName]; 
        let reverse = sortDirection === 'asc' ? 1: -1;
        data.data.sort((a,b) => {
            let valueA = key(a) ? key(a).toLowerCase() : '';
            let valueB = key(b) ? key(b).toLowerCase() : '';
            return reverse * ((valueA > valueB) - (valueB > valueA));
        });

        //set sorted data to contacts attribute
        this.wiredAthletes = data;
        console.log(data.data);
    }


    /**
     *  Function to filter table based on name & SOI_ConsID__c and SOI_mySports__c input
     * @param {*} event 
     */
    fiterData(event){
        let newArray = this.rawData.filter(function (el) {
            if(el.Name.toLowerCase().includes(event.target.value.toLowerCase()) ||
            el.SOI_ConsID__c.toLowerCase().includes(event.target.value.toLowerCase()) ||
            el.SOI_mySports__c.toLowerCase().includes(event.target.value.toLowerCase()) ||
            el.SOI_Status__c.toLowerCase().includes(event.target.value.toLowerCase()) ){
                return true;
            }
            return false;
          });
          this.data = newArray;
    }

}