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
    }
})
