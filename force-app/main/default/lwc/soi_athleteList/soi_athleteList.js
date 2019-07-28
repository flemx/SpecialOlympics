import { LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import athleteList from '@salesforce/apex/SOI_AthleteController.getAthletes';

const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' },
];

const columns = [
    { label: 'ID', fieldName: 'SOI_ConsID__c', type: 'text' },
    { label: 'Name', fieldName: 'Name', type: 'text', sortable : 'true' },
    { label: 'Birthdate', fieldName: 'Birthdate', type: 'date' },
    { label: 'Medical Expiry', fieldName: 'SOI_Medical_Expiry__c', type: 'date' },
    { label: 'View', type: 'button', initialWidth: 135, typeAttributes: { label: 'View Details', name: 'view_details', title: 'Click to View Details'}},
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

export default class Soi_athleteList extends LightningElement {


    @track contacts;
    @track error;
    @track sortedBy;
    @track sortedDirection;

    isRendered = false;

    /*
    @wire(athleteList)
    wiredContacts({ error, data }) {
        if (data) {
            this.contacts = data;
            console.log(this.contacts);
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.contacts = undefined;
        }
    }
    */

    @track data = [];
    @track columns = columns;
    @track record = {};

    renderedCallback() {
        if(this.isRendered){
            return;
        }
        athleteList()
            .then(result => {
                let myData = result;
                //debugger;
                this.contacts = result;
                console.log(result);
                this.isRendered = true;
            })
            .catch(error => {
                this.error = error;
            });
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'delete':
                this.deleteRow(row);
                break;
            case 'view_details':
                this.showRowDetails(row);
                break;
            default:
        }
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
        var data = JSON.parse(JSON.stringify(this.contacts));
        //function to return the value stored in the field
        var key =(a) => a[fieldName]; 
        var reverse = sortDirection === 'asc' ? 1: -1;
        data.sort((a,b) => {
            let valueA = key(a) ? key(a).toLowerCase() : '';
            let valueB = key(b) ? key(b).toLowerCase() : '';
            return reverse * ((valueA > valueB) - (valueB > valueA));
        });

        //set sorted data to contacts attribute
        this.contacts = data;
    }

}