({
    runFlow : function( component, event, helper ) {
        let flowName = event.getSource().get( "v.name" );
        var flow = component.find("flowData");
       
        component.set( "v.showModal", true );
        flow.startFlow(flowName);
    },
    handleStatusChange : function (component, event) {
        console.log("flow.status");
        console.log(event.getParam("status"));
        if(event.getParam("status") === "FINISHED") {
            let toastEvent = $A.get("e.force:showToast");
            component.set( "v.showModal", false );
            $A.get('e.force:refreshView').fire();
            toastEvent.setParams({
                "type" : "success",
                "title": "Success!",
                "message": "The record has been updated successfully."
            });
            toastEvent.fire();
         }
     },
     handleToast : function (component, event) {
         console.log('handleToast event triggered');
        component.get( "v.flow" ).destroy();
     }
})