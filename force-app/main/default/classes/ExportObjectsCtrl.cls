public class ExportObjectsCtrl {
    @auraEnabled
    public static List<String> returnObjectNames(){
        List<String> objects = new List<String>();
        for ( Schema.SObjectType o : Schema.getGlobalDescribe().values() )
        {
            if(o.getDescribe().isAccessible()){
                Schema.DescribeSObjectResult objResult = o.getDescribe();
                system.debug( 'Sobject API Name: ' + objResult.getName() );
                objects.add(objResult.getName());
            }
        }
        return objects;
    }
    
    
    @auraEnabled
    public static String getAthletes(){
        	
         String csv = 'Id,Name\n';
         for(List<Contact> accts: [SELECT id, name FROM Contact LIMIT 10])
         {
          for (Contact acct: accts) {
           csv += acct.id + ',' + acct.name.escapeCsv() + '\n';
          }
         }
         return csv;      
    }
    
    @auraEnabled
    public static String exportObjectData(String objName){
        system.debug('objName-->'+objName);
        SObjectType objectType = Schema.getGlobalDescribe().get(objName);
        Map<String,Schema.SObjectField> fieldMap = objectType.getDescribe().fields.getMap();
        List<Schema.SObjectField> fields= fieldMap.values();
        List<String> queryFields = new List<String>();
        //System.debug('fields-->'+fields);
        String query;
        //String fieldNames = '';
        for(Schema.SObjectField f: fields){
            //fieldNames = fieldNames + f + ',';
            
            //System.debug('fields-->'+f);
            //System.debug('field accessible-->'+f.getDescribe().isAccessible());
            if(f.getDescribe().isAccessible()){
                queryFields.add(string.valueof(f));
                if(query == '' || query == null){
                    query = 'SELECT '+f;
                }else{
                    query = query+', '+f;
                }
            }
        }
        query = query +' FROM '+ objName + ' LIMIT 50000';
        System.debug('query-->'+query);
        
        List<SObject> objData = Database.query(query);
        System.debug('objData-->'+objData);
        /*String objString = '';
for(SObject obj: objData){
objString = objString + obj;
objString = objString + '\n';
}
String objJSON = JSON.serialize(objData);
system.debug('objString-->'+objString);
system.debug('objJSON-->'+objJSON);*/
        System.debug('queryFields-->'+queryFields);
        String csvFileString = ''; 
        for(String fieldName : queryFields)
        {
            csvFileString = csvFileString + ',' + fieldName.replace(',','');
        } 
        csvFileString = csvFileString.replaceFirst(',','') + '\n';
        String fileRow = '';
        String fieldValue = '';
        for(SObject obj : objData) //THIS FOR LOOP IS CONSUMING MORE SCIRPT STATMENTS, IS THERE ANY WAY TO OPTIMIZE THIS ?**
        {
            fileRow = '';
            System.debug('===>' + obj); 
            
            for(Schema.SObjectField f: fields){
                {  
                    if(f.getDescribe().isAccessible()){
                        //System.debug('fieldName-->'+f);
                        if(obj.get(string.valueOf(f)) == null){
                            fieldValue = ' '; 
                        }else{
                        fieldValue = '' + obj.get(string.valueOf(f));
                        }
                        fieldValue = fieldValue.replace(',','');
                        fileRow = fileRow + ',' + fieldValue;
                    }
                }
            }
            fileRow = fileRow.replaceFirst(',','');
            csvFileString = csvFileString + fileRow + '\n';
            //SObject a = c.getSObject('Account');// for parent objects fields like Account.Name
        }
        System.debug('csvFileString-->'+csvFileString);
        
        return csvFileString;
    }
}