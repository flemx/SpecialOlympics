public with sharing class SOI_VenueTimetableController {
   
   
     @AuraEnabled
    public static User getUser(){
        Id userId = UserInfo.getUserId();
        return [select ContactId, Contact.AccountId, Name, Profile.Name from User where Id = :userId limit 1];
    }

    /**
     *  getVenues method
     *  Get all the venues timetables the user has access to and format the SOI_venueSports__c related list into a single string field
     */
    @AuraEnabled(cacheable=true)
    public static List<SOI_Venue_timetable__c> getVenues(){
        List<SOI_Venue_timetable__c> venueTimetables = [select Name, Sport_Name__c, City__c, Venue_Name__c, MON__c, TUE__c, WED__c, THU__c, FRI__c, SAT__c, SUN__c,
                                    SOI_Venue__c, SOI_Status__c, SOI_Sport__c, SOI_ActionLabel__c from SOI_Venue_timetable__c];
        return venueTimetables;
    }


    /**
     *  updateStatus method
     *  Updates the status of the venue timetable record
     */
    @AuraEnabled
    public static void deleteVenue(String Id, String status, String AccId){
            SOI_Venue_timetable__c tim = [select SOI_Status__c, SOI_IsNew__c from SOI_Venue_timetable__c where  Id = :Id limit 1];

            if(tim.SOI_IsNew__c && tim.SOI_Status__c.equals('Deleted')){
               tim.SOI_Status__c = 'New';
                update tim;
            }
            else{
                tim.SOI_Status__c = status;
                update tim;
            }
    }
}
