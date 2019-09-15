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
    public static List<Account> getVenues(){
        List<Account> newVenues= new List<Account>();
        for(Account acc: [select Name, Parent.Name, ParentId, ShippingCity, SOI_venueSports__c, 
                                    SOI_Status__c, SOI_ActionLabel__c,
                                    (select Name,SOI_Status__c from Venue_timetables__r where SOI_Status__c != 'Deleted') 
                                    from Account where RecordTypeId IN 
                                    (select Id FROM RecordType where Name = 'Venue')]){
            String myTimes = '';
            for(Integer i = 0; i < acc.Venue_timetables__r.size(); i++){
                if(i == 0){
                    myTimes = acc.Venue_timetables__r[i].Name;
                }
                else{
                    myTimes = myTimes + ', ' + acc.Venue_timetables__r[i].Name;
                }
            }
            acc.SOI_venueSports__c = myTimes;
            newVenues.add(acc);    
        }
        return newVenues;
    }


    /**
     *  updateStatus method
     *  Updates the status of the venue record
     */
    @AuraEnabled
    public static void deleteVenue(String Id, String status, String AccId){
            Account acc = [select SOI_Status__c from Account where  Id = :Id and ParentId = :AccId limit 1];
            acc.SOI_Status__c = status;
            update acc;
    }

}
