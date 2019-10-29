trigger SoiCLubTrigger on Account (before update) {
		
    if(UserInfo.getUserType().equals('CspLitePortal')){
        
        for(Account acc : Trigger.new){
            Account oldAcc = Trigger.oldMap.get(acc.Id);
            
            Boolean nameChanged = !oldAcc.SOI_first_name__c.equals(acc.SOI_first_name__c) &&
              	!oldAcc.SOI_last_name__c.equals(acc.SOI_last_name__c);
            
            Boolean conIdChanged = !oldAcc.SOI_Club_Contact_ID__c.equals(acc.SOI_Club_Contact_ID__c);
                             
            if(!conIdChanged && nameChanged){
                acc.addError('If you change the name, change the ID accordingly to match the new Club Contact');
            }
            if(conIdChanged){
                
                try{
                    User user = [select Contact.AccountId from User where Id = :UserInfo.getUserId()][0];
                    Contact newCon = [select Id, SOI_ConsID__c, SOI_ClubContact__c from Contact where SOI_ConsID__c = :acc.SOI_Club_Contact_ID__c and AccountId = :user.AccountId][0];
                    
                    List<Contact> oldCon = [select Id, SOI_ConsID__c, SOI_ClubContact__c from Contact where SOI_ConsID__c = :oldAcc.SOI_Club_Contact_ID__c and AccountId = :user.AccountId];
                    if(oldCon.size() > 0){
                        oldCon[0].SOI_ClubContact__c = false;
                    }
                    newCon.SOI_ClubContact__c = true;
                }catch(Exception e){
                    acc.addError('The Club Contact ID does not match an existing ID in the system');
                    System.debug(e.getMessage());
                }

            }
        }
    }
      
    
}