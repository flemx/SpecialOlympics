
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
    { label: 'Card', fieldName: 'SOI_Membership_Card__c', type: 'boolean', initialWidth: 65 },
    { label: 'Sports', fieldName: 'SOI_mySports__c', type: 'text'},
    { label: 'Status', fieldName: 'SOI_Status__c', type: 'text' , sortable : 'true', cellAttributes:{ class: {fieldName:"SOI_Status__c"} }},
    //{ label: 'Club', fieldName: 'SOI_ClubName__c', type: 'text' , sortable : 'true'},
    { label: 'Actions', type: 'button', initialWidth: 110, typeAttributes: { label: 'Edit', name: 'view_details', title: 'Click to View Details'}},
    {label: '', type: 'button', initialWidth: 110, typeAttributes:
                { label: { fieldName: 'SOI_ActionLabel__c'}, title: 'Click to Edit', name: 'delete-record', class: 'btn_next'}
            }
];

const volunteerColumns = [
    { label: 'ID', fieldName: 'SOI_ConsID__c', type: 'text', initialWidth: 75 },
    { label: 'Name', fieldName: 'Name', type: 'text', sortable : 'true' },
    { label: 'Card', fieldName: 'SOI_Membership_Card__c', type: 'boolean', initialWidth: 65 },
    { label: 'Roles', fieldName: 'SOI_myRoles__c', type: 'text'},
    { label: 'Safeguarding', fieldName: 'SOI_Certificate__c', type: 'text'},
    { label: 'Status', fieldName: 'SOI_Status__c', type: 'text' , sortable : 'true', cellAttributes:{ class: {fieldName:"SOI_Status__c"} }},
    //{ label: 'Club', fieldName: 'SOI_ClubName__c', type: 'text' , sortable : 'true'},
    { label: 'Actions', type: 'button', initialWidth: 110, typeAttributes: { label: 'Edit', name: 'view_details', title: 'Click to View Details'}},
    {label: '', type: 'button', initialWidth: 110, typeAttributes:
                { label: { fieldName: 'SOI_ActionLabel__c'}, title: 'Click to Edit', name: 'delete-record', class: 'btn_next'}
            }
];

// Venues
const venuColumns =  [
    { label: 'Name', fieldName: 'Name', type: 'text', sortable : 'true' },
    { label: 'City', fieldName: 'SOI_City__c', type: 'text', sortable : 'true'},
    { label: 'Sports', fieldName: 'SOI_venueSports__c', type: 'text'},
    { label: 'Status', fieldName: 'SOI_Status__c', type: 'text' , sortable : 'true', cellAttributes:{ class: {fieldName:"SOI_Status__c"} }},
    //{ label: 'Club', fieldName: 'SOI_ClubName__c', type: 'text' , sortable : 'true'},
    { label: 'Actions', type: 'button', initialWidth: 110, typeAttributes: { label: 'Edit', name: 'view_details', title: 'Click to View Details'}},
    {label: '', type: 'button', initialWidth: 110, typeAttributes:
                { label: { fieldName: 'SOI_ActionLabel__c'}, title: 'Click to Edit', name: 'delete-record', class: 'btn_next'}
            }   
];


// Volunteer Sport and Role options
const roleOptions =  [
    { label: 'Chairperson', value: 'Chairperson' },
    { label: 'Manager', value: 'Manager' },
    { label: 'Coach1', value: 'Coach1' },
    { label: 'Coach2', value: 'Coach2' },
    { label: 'Basketball Coach', value: 'Basketball Coach' },
    { label: 'Assistant', value: 'Assistant' },
    { label: 'collector', value: 'collector' },
    { label: 'teacher', value: 'teacher' },
    { label: 'Treasurer', value: 'Treasurer' }        
];




export { profileSettings, athleteColumns, volunteerColumns, roleOptions, venuColumns };