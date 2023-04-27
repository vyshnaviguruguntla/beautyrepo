import { Component, OnInit } from '@angular/core';
import { HeaderService } from './header.service';
import { ToastService } from '../toaster/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
 approvalText:string="";
 productList: any = [];

  constructor(private headerService:HeaderService, private toastr: ToastService, private router:Router) { }

  ngOnInit(): void {
    this.headerService.currentApprovalStageMessage1.subscribe(products => {
      console.log("products to header component:",products)
      //this.productList = [];
      this.productList.push(products);
    });
  }

  submit(){
    console.log("search Text",this.approvalText);
    this.headerService.updateApprovalMessage(this.approvalText)
 }

  addtoCart(){
    this.router.navigate(['./cart']);
    //this.headerService.displayCartItems(this.productList);
  }

}
