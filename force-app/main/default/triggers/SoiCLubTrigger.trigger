trigger SoiCLubTrigger on Account (before update) {
		
    if(UserInfo.getUserType().equals('CspLitePortal')){
        
        for(Account acc : Trigger.new){
            Account oldAcc = Trigger.oldMap.get(acc.Id);
            acc.SOI_ContactModified__c  = true;   
            
            Boolean nameChanged = !oldAcc.SOI_first_name__c.equals(acc.SOI_first_name__c) &&
              	!oldAcc.SOI_last_name__c.equals(acc.SOI_last_name__c);
            
            Boolean conIdChanged = !oldAcc.SOI_Club_Contact_ID__c.equals(acc.SOI_Club_Contact_ID__c);
            
            Boolean addressChanged = !oldAcc.BillingStreet.equals(acc.BillingStreet) || !oldAcc.BillingCity.equals(acc.BillingCity) ||
                !oldAcc.BillingState.equals(acc.BillingState) || !oldAcc.BillingPostalCode.equals(acc.BillingPostalCode) ||
                !oldAcc.BillingCountry.equals(acc.BillingCountry);
                                             
            if(!conIdChanged && nameChanged){
                acc.addError('If you change the name, change the ID accordingly to match the new Club Contact');
            }
            if(conIdChanged || (conIdChanged && nameChanged) ){
                acc.SOI_ContactReplaced__c = true;
            } 
           
        }
    }
      
    
}