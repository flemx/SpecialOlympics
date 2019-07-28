public with sharing class SOI_AthleteController {
    
    @AuraEnabled
    public static List<Contact> getAthletes(){
        return [select SOI_ConsID__c, Name, Birthdate, SOI_Medical_Expiry__c, SOI_Membership_Card__c, (select Name from Sports__r), SOI_Status__c  from Contact where RecordTypeId IN (select Id FROM RecordType where Name = 'Athlete')];
    }
    @AuraEnabled
    public static void deleteAthlete(String consId, String status, String ClubId){
            Contact con = [select SOI_Status__c from Contact where  SOI_ConsID__c = :consId and AccountId = :ClubId limit 1];
            con.SOI_Status__c = status;
            update con;
    }
}
