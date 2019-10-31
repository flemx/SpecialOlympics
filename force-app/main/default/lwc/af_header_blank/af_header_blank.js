import { LightningElement } from 'lwc';
import ASSETS from '@salesforce/resourceUrl/AF_assets';



export default class Af_header_blank extends LightningElement {

    mainLogo = ASSETS + '/logos/soilogo.png';

    logoutNow(){
        let hostname = window.location.hostname;
        window.location.replace(`https://${hostname}/soiportal/secur/logout.jsp?retUrl=https://${hostname}/soiportal/`);
    }
    
    goBack(){
        window.history.back();
    }
}