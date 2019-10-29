/**
 * ContactTriggerHandler
 * 05-08-2019
 * @ Damien Fleminks
 */
public class ContactTriggerHandler {


    /**
     * If user is a community user, change the Comtact owner of newly created Triggers to the Account Owner
     */
       public static void changeOwner(List<Contact> contacts){
            User user = [select Contact.AccountId from User where Id = :UserInfo.getUserId()][0];
            if(UserInfo.getUserType().equals('CspLitePortal')){
                 for(Contact con: contacts){
                     Account acc = [Select Id, OwnerId from Account where Id =:user.Contact.AccountId][0];
                     //Account acc = [Select OwnerId from Account where Id = '0013E0000163bj2QAA'][0];
                     con.AccountId = acc.Id;
                     System.debug('Account ownerId is:' + acc.OwnerId);
                    con.OwnerId = acc.OwnerId;
                  }
            }
        }	
    
}