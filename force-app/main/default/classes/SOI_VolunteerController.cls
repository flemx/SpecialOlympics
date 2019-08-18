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
                                    (select Name,SOI_Status__c from Volunteer_Roles__r where SOI_Status__c != 'Deleted'), SOI_Status__c, SOI_myRoles__c,
                                    SOI_ActionLabel__c from Contact where SOI_VolunteerType__c includes (:volunteerType) and RecordTypeId IN 
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
            Contact con = [select SOI_Status__c from Contact where  Id = :Id and AccountId = :AccId limit 1];
            con.SOI_Status__c = status;
            update con;
    }


}
