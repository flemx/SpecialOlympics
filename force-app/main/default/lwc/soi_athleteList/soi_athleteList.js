import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import athleteList from '@salesforce/apex/SOI_AthleteController.getAthletes';
import deleteAth from '@salesforce/apex/SOI_AthleteController.deleteAthlete';
import theUser from '@salesforce/apex/SOI_AthleteController.getUser';
import { profileSettings } from 'c/soi_configVariables';
import { athleteColumns } from 'c/soi_configVariables';



export default class Soi_athleteList extends LightningElement {

    // Used to keep track of data sorting
    @track sortedBy;
    @track sortedDirection;

    // Hanlde what is exeuted in renderedCallback
    isRendered = false;

    // Variableds used to store the data, columns and error message used for the data table
    @track error;
    @track data = [];
    @track columns = athleteColumns;


    //Track search filter
    @track searchKey;

    // Raw data
    rawData;

    /**
     * Call the atheletes once after component is rendered
     */
    renderedCallback() {
        console.log('Executing renderedCallback');
        
        if(this.isRendered){
            return;
        }
        
        athleteList()
            .then(result => {
                console.log(' athleteList success');
                this.renderSports(result);
                this.isRendered = true;
            })
            .catch(error => {
                console.log(' athleteList error');
                let myTitle = `Error loading athletes`;
                let myMessage = `Please reload or contact the administrator `;
                this.triggerToast(myTitle,myMessage,'error');
                this.error = error;
           });
            
        }

        
    /**
     *  Format the array of related sports into a single tet field seperated by comma's
     * @param {*} result 
     */
    renderSports(result){
        let newList = [];
        for(let con of result){
            if(con.Sports__r){
                let mySports;
                for(let i = 0; i < con.Sports__r.length; i++){
                    let name = con.Sports__r[i].Name;
                    if(i === 0){
                        mySports = name
                    }else{
                        mySports = `${mySports}, ${name}`;
                    }
                }
                con.mySports = mySports;   
            }
            if(con.SOI_Status__c === 'Deleted'){
                con.actionLabel = 'Undelete';
            }else{
                con.actionLabel = 'Delete';
            }
            newList.push(con);
        }
        this.data = newList;
        this.rawData = newList;
        console.log(newList);
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
        console.log(`actionLabel is: ${row.actionLabel}`);
        if(row.actionLabel === 'Undelete'){
            let toastInfo = {
                "myTitle" : `Athlete succesfully Undeleted`,
                "myMessage" : `Athlete is not marked to be deleted anymore`,
                "variant" : "success"
            };
            this.deleteAthlete(row, 'Edited', toastInfo);
        }
        if(row.actionLabel === 'Delete'){
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
        deleteAth({ consId: row.SOI_ConsID__c, status: newStatus, AccId: row.AccountId})
            .then(result => {
                console.log('deleteAthlete successful');
                
                this.triggerToast(toastInfo);
                this.setDeleteButton(row,newStatus)
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
     *  Function to hanldle the Action Delete/Undelete buttons 
     * @param {*} row 
     * @param {*} newStatus 
     */
    setDeleteButton(row,newStatus){
        let myData = this.data;
        myData = myData.map(function(rowData) {
            if (rowData.SOI_ConsID__c === row.SOI_ConsID__c) {
                switch(row.actionLabel) {
                    case 'Delete':
                        rowData.actionLabel = 'Undelete';
                        rowData.SOI_Status__c = newStatus;
                        break;
                    case 'Undelete':
                        rowData.actionLabel = 'Delete';
                        rowData.SOI_Status__c = newStatus;
                        break;
                    default:
                        break;
                }
            }
            return rowData;
        });
        this.data = myData;
        this.rawData = myData;
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