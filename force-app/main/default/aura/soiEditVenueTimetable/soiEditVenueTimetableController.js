({  
    handleToast : function(component, event, helper){
        //var appEvent = $A.get("e.c:editUnderReviewIdea");
        //appEvent.fire();
        //console.log('Fire event');
    },
    cancel : function(component, event, helper){
        let bool = component.get('v.theBoolean');
        component.set('v.theBoolean', false);
    },
    save : function(component, event, helper){
        component.find("edit").get("e.recordSave").fire();
    },
    handleSaveSuccess : function(component, event) {
        let toastEvent = $A.get("e.force:showToast");
        let bool = component.get('v.theBoolean');
        component.set('v.theBoolean', false);
        toastEvent.setParams({
            "type" : "success",
            "title": "Success!",
            "message": "The record has been updated successfully."
        });
        var compEvent = component.getEvent("saveEvent");
        compEvent.fire();
        toastEvent.fire();
        

        //onst saveEvent = new CustomEvent('onsaveEvent');
        // Fire the custom event
        //this.dispatchEvent(saveEvent);
    },
    editSubmission : function(component, event, helper){
        let bool = component.get('v.theBoolean');
        component.set('v.theBoolean', false);
    }
})
