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

    //Track edit form
    @track editForm = false;
    @track editContactId;
    @track isActive = false;

    // Track if renderedCallback was executed
    isRendered = false;

    @track theSports = [];
    
    // Raw data for filtering
    rawData;

    // Keep track of wiredAthletes result for refreshApex to work
    wiredAthletesResult;

    // Store Clubs sports
    @track clubSports = [
        { label: 'Football', value: 'Football' },
        { label: 'Swimming', value: 'Swimming' },
        { label: 'Basketball', value: 'Basketball' },
        { label: 'Running', value: 'Running' },
        { label: 'Golf', value: 'Golf' },
        { label: 'Boxing', value: 'Boxing' },
        { label: 'Hockey', value: 'Hockey' },
        { label: 'Rugbey', value: 'Rugbey' }
    ];

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
            this.sortData('Name', 'asc');
            this.rawData = this.data;
            if(this.searchKey){
                this.data = this.fiterData(this.searchKey);
            }
            this.error = undefined;
            //this.template.querySelector('.searchbar').value = '';
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
        this.template.addEventListener('refreshApexEvent', ()=>{
            console.log('Received refreshApexEvent event');
            console.log('Refreshing athelete list');
            return refreshApex(this.wiredContactResult);
        });
        const editForm =  this.template.querySelector('.editForm');
        editForm.addEventListener('triggerModel', ()=>{
            if(this.editForm){
                this.editForm = false;
                console.log('this.editForm = false');
            }else{
                this.editForm = true;
                console.log('this.editForm = true');
            }
        });

    }

    /**
     *  Triggered when edit button is clicked, opens edit modal
     */
    openEdit(row){
        const editForm =  this.template.querySelector('.editForm');
        this.editContactId = row.Id;
        this.isActive = row.SOI_IsActive__c;
        editForm.currentSports = row.SOI_mySports__c;
        if(editForm.openmodel){
            editForm.openmodel = false;
        }else{
            editForm.openmodel = true;
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
    }

    /**
     *  Event listener for table action buttons
     * @param {*} event 
     */
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'view_details':
                this.openEdit(row);
                break;
            default:
        }
    }
   /*
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'delete-record':
                this.deleteHandler(row);
                break;
            case 'view_details':
                this.openEdit(row);
                break;
            default:
        }
    }
  */
    /**
     *   Function to decide which delete action to execute
     * @param {*} row 
     
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
*/

    /**
     *  Function to update athlete status as Deleted
     * @param {*} row 
     * @param {*} newStatus 
    
    deleteAthlete(row, newStatus, toastInfo){
        //console.log(row.Id);
        deleteAth({ Id: row.Id, status: newStatus, AccId: row.AccountId})
            .then(result => {
                console.log('deleteAthlete successful');
                this.triggerToast(toastInfo);
                return refreshApex(this.wiredContactResult);
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
     */


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
        this.sortData(fieldName, sortDirection);
   }

    /**
     *  Function to sort contacts list by given colum name
     * @param {*} fieldName 
     * @param {*} sortDirection 
     */
    sortData(fieldName, sortDirection){        
        let data = JSON.parse(JSON.stringify(this.data));
        //function to return the value stored in the field
        let key =(a) => a[fieldName]; 
        let reverse = sortDirection === 'asc' ? 1: -1;
        
        data.sort((a,b) => {
            let valueA = key(a) ? key(a).toLowerCase() : '';
            let valueB = key(b) ? key(b).toLowerCase() : '';
            return reverse * ((valueA > valueB) - (valueB > valueA));
        });

        //set sorted data to contacts attribute
        this.data = data;
    }


    /**
     *  Function to filter table based on name & SOI_ConsID__c and SOI_mySports__c input
     * @param {*} event 
     */
    searchKeyEvent(event){
        console.log('searchKeyEvent executed');
        this.searchKey = event.target.value;
        this.data = this.fiterData(this.searchKey);
    }

    fiterData(searchKey){
        console.log('fiterData executed');
        console.log('fValue is: ' + searchKey);
        let newArray = this.rawData.filter(function (el) {
            if(el.Name.toLowerCase().includes(searchKey.toLowerCase()) ||
            el.SOI_ConsID__c.toLowerCase().includes(searchKey.toLowerCase()) ||
            el.SOI_mySports__c.toLowerCase().includes(searchKey.toLowerCase()) ||
            el.SOI_Status__c.toLowerCase().includes(searchKey.toLowerCase()) ){
                return true;
            }
            return false;
          });
          return newArray;
        /*
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
          */
    }

}