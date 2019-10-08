({
    handleEditEvent : function(component, event, helper) {
        let recordId = event.getParam('record');
        console.log('handleEditEvent triggered: ' +  recordId);
        component.find('editForm').set("v.recordId", recordId);
        component.find('editForm').set("v.theBoolean", true);
    },
    handleSaveEvent:  function(component, event, helper) {
        console.log('handleSaveEvent triggered: ');
        component.find('venueList').set("v.triggerRefresh", 'isTrigger');
    },
    handleNewEvent : function(component, event, helper) {
        console.log('handleNewEvent triggered: ');
        var windowHash = window.location.hash;
        var createEvent = $A.get("e.force:createRecord");
        createEvent.setParams({
            "navigationLocation" : "LOOKUP",
            "entityApiName": "SOI_Venue_timetable__c",
            "panelOnDestroyCallback": function(event) {
                window.location.hash = windowHash;
            }
        });
        createEvent.fire();
        component.find('venueList').set("v.triggerRefresh", 'isTrigger');
        }
})
