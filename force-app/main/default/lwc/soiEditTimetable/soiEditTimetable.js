
/**
 *   SoiEditVolunteer
 *   04-10-2019
 *   @ Damien Fleminks
 */
import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updateroles from '@salesforce/apex/SOI_VolunteerController.editRoles';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import FULLNAME from '@salesforce/schema/Contact.Name';
import COMMENTS from '@salesforce/schema/Contact.SOI_Comments__c';
import CONS_ID from '@salesforce/schema/Contact.SOI_ConsID__c';
import ACCOUNT from '@salesforce/schema/Contact.AccountId';
import CERT_ID from '@salesforce/schema/Contact.SOI_Certificate__c';
import MEM_CARD from '@salesforce/schema/Contact.SOI_Membership_Card__c';
import { roleOptions } from 'c/soi_configVariables';


import { LightningElement } from 'lwc';

export default class SoiEditTimetable extends LightningElement {}