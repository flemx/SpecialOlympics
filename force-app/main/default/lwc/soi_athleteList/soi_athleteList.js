import { LightningElement, track } from 'lwc';
import athleteList from '@salesforce/apex/SOI_AthleteController.getAthletes';
import deleteAth from '@salesforce/apex/SOI_AthleteController.deleteAthlete';

const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' },
];

const columns = [
    { label: 'ID', fieldName: 'SOI_ConsID__c', type: 'text' },
    { label: 'Name', fieldName: 'Name', type: 'text', sortable : 'true' },
    { label: 'Birthdate', fieldName: 'Birthdate', type: 'date', sortable : 'true'  },
    { label: 'Medical Expiry', fieldName: 'SOI_Medical_Expiry__c', type: 'date', sortable : 'true'  },
    { label: 'Sports', fieldName: 'mySports', type: 'text'},
    {label: 'Action', type: 'button', initialWidth: 150, typeAttributes:
                { label: { fieldName: 'actionLabel'}, title: 'Click to Edit', name: 'delete-record', class: 'btn_next'}
            },
    { label: 'View', type: 'button', initialWidth: 135, typeAttributes: { label: 'View Details', name: 'view_details', title: 'Click to View Details'}},
    { label: 'Status', fieldName: 'SOI_Status__c', type: 'text' },
];

export default class Soi_athleteList extends LightningElement {


    @track rawContacts;
    @track error;
    @track sortedBy;
    @track sortedDirection;

    isRendered = false;


    @track data = [];
    @track columns = columns;
    @track record = {};

    renderedCallback() {
        if(this.isRendered){
            return;
        }
        athleteList()
            .then(result => {
                this.renderSports(result);
                this.isRendered = true;
            })
            .catch(error => {
                this.error = error;
            });
    }

    /**
     *  Format the array of related sports into a single text field seperated by comma's
     * @param {*} result 
     */
    renderSports(result){
        this.rawContacts = result;
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
    }

    /**
     *  Event listener for table action buttons
     * @param {*} event 
     */
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'delete':
                this.deleteRow(row);
                break;
            case 'delete-record':
                this.deleteHandler(event,row);
                break;
            case 'view_details':
                this.showRowDetails(row);
                break;
            default:
        }
    }

     // Add modal to confirm deletion
     // Add logic to determine correct status
    deleteHandler(event,row){
        console.log(`actionLabel is: ${row.actionLabel}`);
        if(row.actionLabel === 'Undelete'){
            this.deleteAthlete(row, 'Edited');
        }
        if(row.actionLabel === 'Delete'){
            this.deleteAthlete(row, 'Deleted');
        }
    }

    // Add fucntion to get clubId
    // Add error in UI
    deleteAthlete(row, newStatus){
        deleteAth({ consId: row.SOI_ConsID__c, status: newStatus, ClubId: '0011X00000MgYfkQAF'})
            .then(result => {
                console.log('deleteAthlete successful');
                this.setDeleteButton(row,newStatus)
            })
            .catch(error => {
                console.log('ERROR on deleteAthlete' + error);
            });
    }

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
    }

    deleteRow(row) {
        const { id } = row;
        const index = this.findRowIndexById(id);
        if (index !== -1) {
            this.data = this.data
                .slice(0, index)
                .concat(this.data.slice(index + 1));
        }
    }

    findRowIndexById(id) {
        let ret = -1;
        this.data.some((row, index) => {
            if (row.id === id) {
                ret = index;
                return true;
            }
            return false;
        });
        return ret;
    }

    showRowDetails(row) {
        this.record = row;
        //return refreshApex(this.wiredContacts);
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

}