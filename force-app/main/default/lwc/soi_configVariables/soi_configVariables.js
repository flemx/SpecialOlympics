
// Set the profile to be used by the admins
const profileSettings = {
    "adminProfile" : "System Administrator"
}


// Define the colums used by the datatable for the athelete list
const athleteColumns = [
    { label: 'ID', fieldName: 'SOI_ConsID__c', type: 'text', initialWidth: 75 },
    { label: 'Name', fieldName: 'Name', type: 'text', sortable : 'true' },
    { label: 'Birthdate', fieldName: 'Birthdate', type: 'date', sortable : 'true', initialWidth: 110  },
    { label: 'Medical Expiry', fieldName: 'SOI_Medical_Expiry__c', type: 'date', sortable : 'true' , initialWidth: 110 },
    { label: 'Sports', fieldName: 'mySports', type: 'text'},
    {label: 'Action', type: 'button', initialWidth: 110, typeAttributes:
                { label: { fieldName: 'actionLabel'}, title: 'Click to Edit', name: 'delete-record', class: 'btn_next'}
            },
    { label: 'View', type: 'button', initialWidth: 100, typeAttributes: { label: 'View', name: 'view_details', title: 'Click to View Details'}},
    { label: 'Status', fieldName: 'SOI_Status__c', type: 'text' , sortable : 'true'},
    { label: 'Club', fieldName: 'SOI_ClubName__c', type: 'text' , sortable : 'true'}
];



export { profileSettings, athleteColumns };