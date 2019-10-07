/**
 *   SOI_VolunteerController
 *   Class to handle the actions related to the soi volunteers in the community portal
 *   @ Damien Fleminks 
 *   18-08-2019
 */
public with sharing class SOI_VolunteerController {
   
    @AuraEnabled
    public static User getUser(){
        Id userId = UserInfo.getUserId();
        return [select ContactId, Contact.AccountId, Name, Profile.Name from User where Id = :userId limit 1];
    }

    /**
     *  getVolunteers method
     *  Get all the volunteers the user has access to and format the SOI_myRoles__c related list into a single string field
     */
    @AuraEnabled(cacheable=true)
    public static List<Contact> getVolunteers(String volunteerType){
        System.debug(volunteerType);
        List<Contact> newVolunteers = new List<Contact>();
        for(Contact con: [select AccountId, Account.Name, SOI_ClubName__c, SOI_ConsID__c, 
                                    Name, SOI_Membership_Card__c,SOI_Certificate__c,
                                    SOI_Status__c, SOI_myRoles__c,SOI_ActionLabel__c,
                                    (select Name,SOI_Status__c from Volunteer_Roles__r where SOI_Status__c != 'Deleted')
                                    from Contact where SOI_VolunteerType__c includes (:volunteerType) and RecordTypeId IN 
                                    (select Id FROM RecordType where Name = 'Volunteer')]){
            String myRoless = '';
            for(Integer i = 0; i < con.Volunteer_Roles__r.size(); i++){
                if(i == 0){
                    myRoless = con.Volunteer_Roles__r[i].Name;
                }
                else{
                    myRoless = myRoless + ', ' + con.Volunteer_Roles__r[i].Name;
                }
            }
            con.SOI_myRoles__c = myRoless;
            newVolunteers.add(con);    
        }
        return newVolunteers;
    }

    /**
     *  updateStatus method
     *  Updates the status of the volunteer record
     */
    @AuraEnabled

    public static void deleteVolunteer(String Id, String status, String AccId){
            Contact con = [select SOI_Status__c, SOI_IsNew__c from Contact where  Id = :Id and AccountId = :AccId limit 1];
             if(con.SOI_IsNew__c && con.SOI_Status__c.equals('Deleted')){
               con.SOI_Status__c = 'New';
                update con;
            }
            else{
                con.SOI_Status__c = status;
                update con;
            }
    }


     /**
     *  newRoles method
     *  Add roles to newly created volunteers
     */
    @AuraEnabled
    public static void newRoles(List<String> roleList, String contactId){
            List<SOI_Roles__c> newRoles = new List<SOI_Roles__c>();
            System.debug(roleList);
            System.debug(contactId);
            for(String role: roleList){
                SOI_Roles__c newRole = new SOI_Roles__c();
                newRole.Name = role;
                newRole.SOI_Volunteer__c = contactId;
                newRole.SOI_Status__c = 'New';
                newRole.SOI_NewAdded__c = true;
                newRoles.add(newRole);
            }
            System.debug(newRoles);
            insert newRoles;
    }


     /**
     *  editRoles method
     *  Edit roles, add newly added and mak as deleted
     *  (DML & SOQL are used in loops deliberately as the lists are very small)
     */
    @AuraEnabled
    public static void editRoles(List<List<String>> rolesList, String contactId){
            List<SOI_Roles__c> newRoles = new List<SOI_Roles__c>();
            List<SOI_Roles__c> duplicates = [select Name, SOI_Status__c from SOI_Roles__c where SOI_Volunteer__c=:contactId and SOI_Status__c='Deleted' and Name in :rolesList[0]];
            for(String role: rolesList[0]){
                Boolean noDubble = true;
                //First check if any of the newly added roles already exist as deleted status
                if(duplicates.size() > 0){
                    List<SOI_Roles__c> dubble = [select Name, SOI_Status__c,SOI_NewAdded__c from SOI_Roles__c where SOI_Volunteer__c=:contactId and SOI_Status__c='Deleted' and Name = :role limit 1];
                    if(dubble.size() > 0){
                        if(dubble[0].SOI_NewAdded__c){
                            dubble[0].SOI_Status__c = 'New';
                        }else{
                            dubble[0].SOI_Status__c = 'Unchanged';
                        }
                        update dubble;
                        noDubble = false;
                    }
                }
                if(noDubble){
                    //If no existing deleted dubplicate, create a new role
                    SOI_Roles__c newRole = new SOI_Roles__c();
                    newRole.Name = role;
                    newRole.SOI_Volunteer__c = contactId;
                    newRole.SOI_Status__c = 'New';
                    newRole.SOI_NewAdded__c = true;
                    newRoles.add(newRole);
                }
            }
            insert newRoles;

            // Update status of roles to be markes as deleted
             List<SOI_Roles__c> removeRoles = new List<SOI_Roles__c>();
             for(SOI_Roles__c role: [select Name, SOI_Status__c from SOI_Roles__c where SOI_Volunteer__c=:contactId and Name in :rolesList[1]]){
                 role.SOI_Status__c = 'Deleted';
                 removeRoles.add(role);
             }
             update removeRoles;

            Contact con = [select SOI_Status__c, SOI_IsNew__c from Contact where  Id = :contactId limit 1];
             if(!con.SOI_IsNew__c){
                con.SOI_Status__c = 'Edited';
                update con;
             }

    }

}
