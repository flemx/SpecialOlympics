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
        return [select ContactId, Contact.AccountId, Name, Profile.Name from User where Id = :userId limit 1];
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
                                    (select Name,SOI_Status__c from Sports__r where SOI_Status__c != 'Deleted'), SOI_Status__c, SOI_mySports__c,
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

     /**
     *  newSports method
     *  Add sports to newly created Athlete
     */
    @AuraEnabled
    public static void newSports(List<String> sportList, String contactId){
            List<SOI_Sport__c> newSports = new List<SOI_Sport__c>();
            
            for(String sport: sportList){
                SOI_Sport__c newSport = new SOI_Sport__c();
                newSport.Name = sport;
                newSport.SOI_Athlete__c = contactId;
                newSports.add(newSport);
            }
            insert newSports;
    }

     /**
     *  editSports method
     *  Edit sports, add newly added and mak as deleted
     *  (DML & SOQL are used in loops deliberately as the lists are very small)
     */
    @AuraEnabled
    public static void editSports(List<List<String>> sportList, String contactId){
            List<SOI_Sport__c> newSports = new List<SOI_Sport__c>();
            List<SOI_Sport__c> duplicates = [select Name, SOI_Status__c from SOI_Sport__c where SOI_Athlete__c=:contactId and SOI_Status__c='Deleted' and Name in :sportList[0]];
            for(String sport: sportList[0]){
                Boolean noDubble = true;
                //First check if any of the newly added sports already exist as deleted status
                if(duplicates.size() > 0){
                    List<SOI_Sport__c> dubble = [select Name, SOI_Status__c,SOI_NewAdded__c from SOI_Sport__c where SOI_Athlete__c=:contactId and SOI_Status__c='Deleted' and Name = :sport limit 1];
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
                    //If no existing deleted dubplicate, create a new sport
                    SOI_Sport__c newSport = new SOI_Sport__c();
                    newSport.Name = sport;
                    newSport.SOI_Athlete__c = contactId;
                    newSport.SOI_Status__c = 'New';
                    newSport.SOI_NewAdded__c = true;
                    newSports.add(newSport);
                }
            }
            insert newSports;

            // Update status of sports to be markes as deleted
             List<SOI_Sport__c> removeSports = new List<SOI_Sport__c>();
             for(SOI_Sport__c sport: [select Name, SOI_Status__c from SOI_Sport__c where SOI_Athlete__c=:contactId and Name in :sportList[1]]){
                 sport.SOI_Status__c = 'Deleted';
                 removeSports.add(sport);
             }
             update removeSports;

    }

}
