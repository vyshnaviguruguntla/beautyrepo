import { Component, OnInit } from '@angular/core';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
 approvalText:string="";

  constructor(private headerService:HeaderService) { }

  ngOnInit(): void {}

  submit(){
    console.log("search Text",this.approvalText);
    this.headerService.updateApprovalMessage(this.approvalText)
 }

}
