/**
 *  soi_athletelist
 *   @ Damien Fleminks
 *   28-07-2019
 */
import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import athleteList from '@salesforce/apex/SOI_AthleteController.getAthletes';
import deleteAth from '@salesforce/apex/SOI_AthleteController.updateStatus';
import { refreshApex } from '@salesforce/apex';
//import theUser from '@salesforce/apex/SOI_AthleteController.getUser';
//import { profileSettings } from 'c/soi_configVariables';
import { athleteColumns } from 'c/soi_configVariables';



export default class Soi_athleteList extends LightningElement {

    // Used to keep track of data sorting
    @track sortedBy;
    @track sortedDirection;

    // Variableds used to store the data, columns and error message used for the data table
    @track error;
    @track columns = athleteColumns;

    //Track search filter
    @track searchKey;

    // Raw data for filtering
    rawData;

    @wire(athleteList) wiredAthletes;
    /**
     *  Wire function to get the atheletes list
     * @param {*} param0 
     
    @wire(athleteList)
    wiredAthletes({ error, data }) {
        if (data) {
            console.log(data);
            this.error = undefined;
            return data;
        } else if(error) {
            let myTitle = `Error loading athletes`;
            let myMessage = `Please reload the page or contact the administrator `;
            this.triggerToast(myTitle,myMessage,'error');
            this.error = error;
            return undefined;
        }
        return undefined;
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
                return refreshApex(this.wiredAthletes);
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
        var data = JSON.parse(JSON.stringify(this.data));
        //function to return the value stored in the field
        var key =(a) => a[fieldName]; 
        var reverse = sortDirection === 'asc' ? 1: -1;
        data.sort((a,b) => {
            let valueA = key(a) ? key(a).toLowerCase() : '';
            let valueB = key(b) ? key(b).toLowerCase() : '';
            return reverse * ((valueA > valueB) - (valueB > valueA));
        });

        //set sorted data to contacts attribute
        this.data = data;
    }


    /**
     *  Function to filter table based on name & SOI_ConsID__c input
     * @param {*} event 
     */
    fiterData(event){
        let newArray = this.rawData.filter(function (el) {
            if(el.Name.toLowerCase().includes(event.target.value.toLowerCase()) ||
            el.SOI_ConsID__c.toLowerCase().includes(event.target.value.toLowerCase()) ||
            el.SOI_Status__c.toLowerCase().includes(event.target.value.toLowerCase()) ){
                return true;
            }
            return false;
          });
          this.data = newArray;
    }

}