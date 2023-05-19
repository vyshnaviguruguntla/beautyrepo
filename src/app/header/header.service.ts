import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
 

  cartProducts:any = [];
  geoCoords : any;
  private approvalStageMessage = new Subject();
  currentApprovalStageMessage = this.approvalStageMessage.asObservable();


  private approvalStageMessage1 = new Subject();
  currentApprovalStageMessage1 = this.approvalStageMessage1.asObservable();


  private approvalStageMessage2 = new Subject();
  currentApprovalStageMessage2 = this.approvalStageMessage2.asObservable();

  static approvalStageMessage3 = new Subject();
  currentApprovalStageMessage3 = HeaderService.approvalStageMessage3.asObservable();


  private approvalStageMessage4 = new Subject();
  currentApprovalStageMessage4 = this.approvalStageMessage4.asObservable();



  constructor() { }

  updateApprovalMessage(message: string) {
    console.log("message:",message);
    this.approvalStageMessage.next(message)
  }

  getCartItems(products:any){
    console.log("products to header section to header service:",products)
    this.approvalStageMessage1.next(products);
    this.cartProducts.push(products);
  }

  displayCartItems(products:any){
    console.log("products to cart section from header service:",products)
    this.approvalStageMessage2.next(products)
  }

  updateGeoLocation(geoCoords : any) {
    console.log("updateGeoLocation",geoCoords.latitude)
    this.approvalStageMessage4.next(geoCoords)
  }

  static updateGeoLocation(coords: any) {
    console.log("static"+coords);
    this.approvalStageMessage3.next(coords)
  }
}
