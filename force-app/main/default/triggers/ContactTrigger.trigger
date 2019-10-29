/**
 * ContactTriggerHandler
 * 05-08-2019
 * @ Damien Fleminks
 */
 
trigger ContactTrigger on Contact (before insert) {
	
  
    if(trigger.isInsert & trigger.isBefore){
      	List<Contact> contacts = Trigger.New;
        ContactTriggerHandler.changeOwner(contacts);
    }


}