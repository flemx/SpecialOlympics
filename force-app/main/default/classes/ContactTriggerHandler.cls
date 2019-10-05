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
    	if(UserInfo.getUserType().equals('CspLitePortal')){
             for(Contact con: contacts){
         	 	con.OwnerId = '0051x0000026WGpAAM';
         	 	//con.OwnerId = con.Account.OwnerId;
         	  }
        }
    }	
    
}