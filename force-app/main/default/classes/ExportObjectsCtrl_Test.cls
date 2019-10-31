@istest
public class ExportObjectsCtrl_Test {
    static testmethod void testDataExport(){
        Account acc = new Account(Name='abc');
        insert acc;
        ExportObjectsCtrl.returnObjectNames();
        ExportObjectsCtrl.exportObjectData('Account');
    }
}