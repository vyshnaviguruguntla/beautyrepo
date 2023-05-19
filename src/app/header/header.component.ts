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

  approvalText: string = "";
  productList: any = [];
  geocoords: any = null;
  constructor(private headerService: HeaderService, private toastr: ToastService, private router: Router) { }

  ngOnInit(): void {
    this.getLocation();

    this.headerService.currentApprovalStageMessage1.subscribe(products => {
      console.log("products to header component:", products)
      //this.productList = [];
      this.productList.push(products);
    });

    this.headerService.currentApprovalStageMessage3.subscribe(geocoords => {
      console.log("geocoords__Static", geocoords)
      //this.productList = [];
      this.geocoords = geocoords;
      console.log("geocoords___", geocoords)
      this.headerService.updateGeoLocation(this.geocoords)

    });
  }

  submit() {
    console.log("search Text", this.approvalText);
    this.headerService.updateApprovalMessage(this.approvalText)
    if (this.geocoords != null)
      this.headerService.updateGeoLocation(this.geocoords)
  }

  addtoCart() {
    this.router.navigate(['./cart']);
    //this.headerService.displayCartItems(this.productList);
  }

  getLocation() {
    console.log("getLocation");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition);
      console.log("IF COND");
    } else {
      console.log("ELSE COND");
    }
  }

  showPosition(position: any) {
    console.log(position.coords + "Latitude: " + position.coords.latitude +
      "Longitude: " + position.coords.longitude);
    //  this.geocoords = position.coords;
    // this.headerService.geoCoords = position.coords;
    HeaderService.updateGeoLocation(position.coords);
  }

}
