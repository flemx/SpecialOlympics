public with sharing class SOI_AthleteList {

    public List<contactWrapper> athletes{get; set;}

    
    public SOI_AthleteList() {
        List<Contact> oldAthletes = [select AccountId, Account.Name, SOI_ClubName__c, SOI_ConsID__c, 
                                    Name, Birthdate, SOI_Medical_Expiry__c, SOI_Membership_Card__c, 
                                    (select Name from Sports__r), SOI_Status__c from 
                                    Contact where RecordTypeId IN 
                                    (select Id FROM RecordType where Name = 'Athlete')];
        formatAtheletes(oldAthletes);
    }


    private void formatAtheletes(List<Contact> oldAthletes){
        List<contactWrapper> newAthletes = new List<contactWrapper>();
        for(Contact con: oldAthletes){
            contactWrapper newCon = new contactWrapper(con);
             if(con.Sports__r.size() > 0){
                String mySports = '';
                for(Integer i = 0; i < con.Sports__r.size(); i++){
                    String name = con.Sports__r[i].Name;
                    if(i == 0){
                        mySports = name;
                    }else{
                        mySports = mySports+', '+name;
                    }
                }
                newCon.mySports = mySports;   
            }
            if(con.SOI_Status__c == 'Deleted'){
                newCon.actionLabel = 'Undelete';
            }else{
                newCon.actionLabel = 'Delete';
            }
            newAthletes.add(newCon);
        }
        athletes = newAthletes;
    }

    public class contactWrapper
    {
        public Contact con{get; set;}
        public String mySports {get; set;}
        public String actionLabel {get; set;}
        public contactWrapper(Contact c)
        {
            con = c;
        }
    }
    
}
