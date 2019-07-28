trigger ClubJobTrigger on ClubJob__c (before insert, after insert, after update, after delete) {
    
    
    /* Temporarily script to hard code accountid for beta testing */
    if(Trigger.isInsert && Trigger.isBefore){
        for(ClubJob__c job: Trigger.New){
        	job.Club__c = '0010D00000HF5YJQA1';
        }
    }
    if(Trigger.isAfter){
        
        /* When new Job is inserted, deleted or updated below script will update the Contact field to display the Jobs*/
        if(Trigger.isDelete){
            for(ClubJob__c myJob: Trigger.Old){
           		updateContact(myJob);
        	}
        }
        if(Trigger.isInsert){
            for(ClubJob__c myJob: Trigger.New){
           		updateContact(myJob);
        	}
        }
    }
    private static void updateContact(ClubJob__c myJob){
         List<ClubJob__c> jobs = [select JobCat__c from ClubJob__c where Volunteer__c = :myJob.Volunteer__c];
            Contact myCon = [select Club_Jobs_api__c,Id from Contact where Id=:myJob.Volunteer__c];
            String jobStr = '';
            for(Integer i = 0; i < jobs.size()-1; i++){
                jobStr = jobStr + jobs[i].JobCat__c + ', ';
                System.debug('Job name: ' + jobs[i].JobCat__c);
            }
            jobStr = jobStr + jobs[jobs.size()-1].JobCat__c;
            System.debug('Contact ID: ' + myCon.Id + ', Jobs are: ' + jobStr);
            myCon.Club_Jobs_api__c = jobStr;
            update myCon;
    }
    
}