/**
 *   SOI_VenueController
 *   Class to handle the actions related to the soi venues in the community portal
 *   @ Damien Fleminks 
 *   22-08-2019
 */
public with sharing class SOI_VenueController {
  
  @AuraEnabled
    public static User getUser(){
        Id userId = UserInfo.getUserId();
        return [select ContactId, Contact.AccountId, Name, Profile.Name from User where Id = :userId limit 1];
    }

    /**
     *  getVenues method
     *  Get all the venues the user has access to and format the SOI_venueSports__c related list into a single string field
     */
     
    @AuraEnabled(cacheable=true)
    public static List<SOI_Venue__c> getVenues(){
        List<SOI_Venue__c> newVenues= new List<SOI_Venue__c>();
        for(SOI_Venue__c ven: [select Name, SOI_Club__c, SOI_City__c, SOI_venueSports__c, 
                                    SOI_Status__c, SOI_ActionLabel__c,
                                    (select Name,SOI_Status__c from Venue_timetables__r where SOI_Status__c != 'Deleted') 
                                    from SOI_Venue__c]){
            String myTimes = '';
            for(Integer i = 0; i < ven.Venue_timetables__r.size(); i++){
                if(i == 0){
                    myTimes = ven.Venue_timetables__r[i].Name;
                }
                else{
                    myTimes = myTimes + ', ' + ven.Venue_timetables__r[i].Name;
                }
            }
            ven.SOI_venueSports__c = myTimes;
            newVenues.add(ven);    
        }
        return newVenues;
    }


    /**
     *  updateStatus method
     *  Updates the status of the venue record
     */
    @AuraEnabled
    public static void deleteVenue(String Id, String status, String AccId){
            SOI_Venue__c ven = [select SOI_Status__c from SOI_Venue__c where  Id = :Id limit 1];
            ven.SOI_Status__c = status;
            update ven;
    }
    
}
