public with sharing class SOI_User {
  
  
     @AuraEnabled
    public static User getAccount(){
        Id userId = UserInfo.getUserId();
        return [select Contact.Account.Name from User where Id = :userId limit 1];
    }
}
