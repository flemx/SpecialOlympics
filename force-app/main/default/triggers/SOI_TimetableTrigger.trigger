trigger SOI_TimetableTrigger on SOI_Venue_timetable__c (before update) {
    
	  if(trigger.isUpdate & trigger.isBefore){
      	List<SOI_Venue_timetable__c> times = Trigger.New;
      	for(SOI_Venue_timetable__c tim: times){
            if(!tim.SOI_IsNew__c && !tim.SOI_Status__c.equals('Deleted')){
                tim.SOI_Status__c = 'Edited';
            }
         }
          
    }
}