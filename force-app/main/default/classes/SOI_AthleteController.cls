/**
 *   SOI_AthleteController
 *   Class to handle the actions related to the soi athletes in the community portal
 *   @ Damien Fleminks
 *   28-07-2019
 */
public with sharing class SOI_AthleteController {
    

    @AuraEnabled
    public static User getUser(){
        Id userId = UserInfo.getUserId();
        return [select ContactId,Name, Profile.Name from User where Id = :userId limit 1];
    }

    /**
     *  getAthletes method
     *  Get all the athletes the user has access to and format the SOI_mySports__c related list into a single string field
     */
    @AuraEnabled(cacheable=true)
    public static List<Contact> getAthletes(){
        List<Contact> newAthletes = new List<Contact>();
        for(Contact con: [select AccountId, Account.Name, SOI_ClubName__c, SOI_ConsID__c, 
                                    Name, Birthdate, SOI_Medical_Expiry__c, SOI_Membership_Card__c, 
                                    (select Name from Sports__r), SOI_Status__c, SOI_mySports__c,
                                    SOI_ActionLabel__c from Contact where RecordTypeId IN 
                                    (select Id FROM RecordType where Name = 'Athlete')]){
            String mySports = '';
            for(Integer i = 0; i < con.Sports__r.size(); i++){
                if(i == 0){
                    mySports = con.Sports__r[i].Name;
                }
                else{
                    mySports = mySports + ', ' + con.Sports__r[i].Name;
                }
            }
            con.SOI_mySports__c = mySports;
            newAthletes.add(con);    
        }
        return newAthletes;
    }

    /**
     *  updateStatus method
     *  Updates the status of the athlete record
     */
    @AuraEnabled
    public static void deleteAthlete(String Id, String status, String AccId){
            Contact con = [select SOI_Status__c from Contact where  Id = :Id and AccountId = :AccId limit 1];
            con.SOI_Status__c = status;
            update con;
    }
}
