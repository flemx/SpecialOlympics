public with sharing class SOI_AthleteController {
    
    @AuraEnabled
    public static List<Contact> getAthletes(){
        return [select SOI_ConsID__c, Name, Birthdate, SOI_Medical_Expiry__c, SOI_Membership_Card__c, (select Name from Sports__r)  from Contact where RecordTypeId IN (select Id FROM RecordType where Name = 'Athlete')];
    }
}
