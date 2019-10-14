
// Set the profile to be used by the admins
const profileSettings = {
    "adminProfile" : "System Administrator"
}


// Define the colums used by the datatable for the athelete list
const athleteColumns = [
    { label: 'ID', fieldName: 'SOI_ConsID__c', type: 'text', initialWidth: 80 },
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
    { label: 'ID', fieldName: 'SOI_ConsID__c', type: 'text', initialWidth: 80 },
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
    { label: 'Sports', fieldName: 'SOI_venueSports__c', type: 'text'}
];
/*
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
*/


// Venue Timetables
const timetableColumns = [
    { label: 'Venue', fieldName: 'Venue_Name__c', type: 'text', sortable : 'true' },
    { label: 'Sport', fieldName: 'Name', type: 'text', sortable : 'true'},
    { label: 'Mon', fieldName: 'MON__c', type: 'text'},
    { label: 'Tue', fieldName: 'TUE__c', type: 'text'},
    { label: 'Wed', fieldName: 'WED__c', type: 'text'},
    { label: 'Thu', fieldName: 'THU__c', type: 'text'},
    { label: 'Fri', fieldName: 'FRI__c', type: 'text'},
    { label: 'Sat', fieldName: 'SAT__c', type: 'text'},
    { label: 'Sun', fieldName: 'SUN__c', type: 'text'},
    { label: 'Status', fieldName: 'SOI_Status__c', initialWidth: 90, type: 'text' , sortable : 'true', cellAttributes:{ class: {fieldName:"SOI_Status__c"} }},
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

const roleList = [{"Name":"Alpine Skiing Coach","Type":"Coach"},
{"Name":"Alpine Skiing Head Coach","Type":"Management"},
{"Name":"Assistant SO Coordinator","Type":"Management"},
{"Name":"Assistant Special Olympics Coordinator","Type":"Management"},
{"Name":"Athletics Assistant Coach","Type":"Coach"},
{"Name":"Athletics Coach","Type":"Coach"},
{"Name":"Athletics Head Coach","Type":"Management"},
{"Name":"Badminton Assistant Coach","Type":"Coach"},
{"Name":"Badminton Coach","Type":"Coach"},
{"Name":"Badminton Head Coach","Type":"Management"},
{"Name":"Basketball  Assistant Couch","Type":"Management"},
{"Name":"Basketball Assistant Coach","Type":"Coach"},
{"Name":"Basketball Coach","Type":"Coach"},
{"Name":"Basketball Head Coach","Type":"Management"},
{"Name":"Bocce Assistant Coach","Type":"Coach"},
{"Name":"Bocce Coach","Type":"Coach"},
{"Name":"Bocce Head Coach","Type":"Management"},
{"Name":"Chairperson","Type":"Management"},
{"Name":"Club Safeguarding Officer","Type":"Management"},
{"Name":"Equestrian Assistant Coach","Type":"Coach"},
{"Name":"Equestrian Coach","Type":"Coach"},
{"Name":"Equestrian Head Coach","Type":"Management"},
{"Name":"Families Officer","Type":"Management"},
{"Name":"Floorball Assistant Coach","Type":"Coach"},
{"Name":"Floorball Coach","Type":"Coach"},
{"Name":"Floorball Head Coach","Type":"Management"},
{"Name":"Footbal 5 Coach","Type":"Coach"},
{"Name":"Football 11 Coach","Type":"Coach"},
{"Name":"Football 11 Head Coach","Type":"Management"},
{"Name":"Football 5 Assistant Coach","Type":"Coach"},
{"Name":"Football 5 Coach","Type":"Coach"},
{"Name":"Football 5 Head Coach","Type":"Management"},
{"Name":"Football 7 Assistant Coach","Type":"Coach"},
{"Name":"Football 7 Coach","Type":"Coach"},
{"Name":"Football 7 Head Coach","Type":"Management"},
{"Name":"General Volunteer","Type":"General"},
{"Name":"Golf Assistant Coach","Type":"Coach"},
{"Name":"Golf Coach","Type":"Coach"},
{"Name":"Golf Head Coach","Type":"Management"},
{"Name":"Golf Partner","Type":"General"},
{"Name":"Gymnastics Artistic Assistant Coach","Type":"Coach"},
{"Name":"Gymnastics Artistic Coach","Type":"Coach"},
{"Name":"Gymnastics Artistic Head Coach","Type":"Management"},
{"Name":"Gymnastics Rhythmic Assistant Coach","Type":"Coach"},
{"Name":"Gymnastics Rhythmic Coach","Type":"Coach"},
{"Name":"Gymnastics Rhythmic Head Coach","Type":"Management"},
{"Name":"Head Coach","Type":"Management"},
{"Name":"Health Promotion Facilitator","Type":"General"},
{"Name":"Kayaking Assistant Coach","Type":"Coach"},
{"Name":"Kayaking Coach","Type":"Coach"},
{"Name":"Kayaking Head Coach","Type":"Management"},
{"Name":"Membership Officer","Type":"Management"},
{"Name":"Motor Activities Training Programme Assistant Coac","Type":"Coach"},
{"Name":"Motor Activities Training Programme Coach","Type":"Coach"},
{"Name":"Motor Activities Training Programme Head Coach","Type":"Management"},
{"Name":"Pitch & Putt Coach","Type":"Coach"},
{"Name":"Pitch & Putt Head Coach","Type":"Management"},
{"Name":"PR Officer","Type":"Management"},
{"Name":"Safety Officer","Type":"Management"},
{"Name":"Secretary","Type":"Management"},
{"Name":"Special Olympics Coordinator","Type":"Management"},
{"Name":"Sports Officer","Type":"Management"},
{"Name":"Swimming Assistant Coach","Type":"Coach"},
{"Name":"Swimming Assistant Couch","Type":"Management"},
{"Name":"Swimming Coach","Type":"Coach"},
{"Name":"Swimming Head Coach","Type":"Management"},
{"Name":"Table Tennis Coach","Type":"Coach"},
{"Name":"Table Tennis Head Coach","Type":"Management"},
{"Name":"Tenpin Bowling Assistant Coach","Type":"Coach"},
{"Name":"Tenpin Bowling Coach","Type":"Coach"},
{"Name":"Tenpin Bowling Head Coach","Type":"Management"},
{"Name":"Treasurer","Type":"Management"},
{"Name":"Vice-Chairperson","Type":"Management"},
{"Name":"Volunteer Officer","Type":"Management"},
{"Name":"Young Athletes Assistant Coach","Type":"Coach"},
{"Name":"Young Athletes Lead","Type":"Management"}];


export { profileSettings, athleteColumns, volunteerColumns, roleList, venuColumns, timetableColumns };