import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { HeaderService } from '../header/header.service';
import { ToastService } from '../toaster/toast.service';
import { Router } from '@angular/router';
import { time } from 'console';
@Component({
  selector: 'app-product-single',
  templateUrl: './product-single.component.html',
  styleUrls: ['./product-single.component.css']
})
export class ProductSingleComponent implements OnInit {

  productList: any =[];
  likedProducts: any;
  searchList: any;
  bearerToken: any;
  cartProduct:any;
  uuid: any;
  uniqueId: any;
  mCoords : any;
  geoCoords:any = null;

  constructor(private http: HttpClient, private headerService: HeaderService,
    private toastr: ToastService, private router:Router) { }

  ngOnInit(): void {
    this.headerService.currentApprovalStageMessage4.subscribe(msg => {
      console.log("VALUE"+msg)
      this.geoCoords = msg;
    });
    this.uuid = this.getUUID4();
    console.log("random ID:",this.uuid);
    this.displayProducts();
    this.fetchLikedProducts();
    this.headerService.currentApprovalStageMessage.subscribe(msg => {
      this.productList = [];
      this.searchProducts(msg);
    });
  
   

  }

  getUUID4(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0; 
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  uniqueID() {
    return Math.floor(Math.random() * Date.now()).toString(16)
  }

  fetchProducts() {
    const headers: any = [];
    headers['Content-Type'] = 'application/json';
    headers['Acess-Control-Allow-Origin'] = '*';
    headers['sessionId'] = this.uuid;
    const url = "https://sample-poc-8a5f.vercel.app/api/getProducts"
    const options = { headers: new HttpHeaders(headers) }
    return this.http.get(url, options);
  }

  fetchYouMayAlsoLikeService() {
    const headers: any = [];
    headers['Content-Type'] = 'application/json';
    headers['Acess-Control-Allow-Origin'] = '*';
    headers['sessionId'] = this.uuid;
    const url = "https://sample-poc-8a5f.vercel.app/api/getLikedProducts"
    const options = { headers: new HttpHeaders(headers) }
    return this.http.get(url, options);
  }

  searchProductsService(text: any) {
    const headers: any = [];
    headers['Content-Type'] = 'application/json';
    headers['Acess-Control-Allow-Origin'] = '*';
    headers['sessionId'] = this.uuid;
    const url = "https://sample-poc-8a5f.vercel.app/api/search?searchKey=" + text;
    const options = { headers: new HttpHeaders(headers) }
    return this.http.get(url, options);
  }

  /* Display Liked products */

  fetchLikedProducts() {
    this.fetchYouMayAlsoLikeService().subscribe((res: any) => {
      this.likedProducts = res['Liked Hair Products'];
      console.log("Liked productsList:", this.likedProducts);
    }, (err: any) => {
      console.log("error:", err);
    })
  }


  /* Display products list */

  displayProducts() {
    this.fetchProducts().subscribe((res: any) => {
      this.productList = res['Hair Products'];
      console.log("productsList:", this.productList);
    }, (err: any) => {
      console.log("error:", err);
    })
  }

  /* Display Search Products */

  searchProducts(text: any) {
    let searchText = text;
    this.uniqueId = this.uniqueID()
    this.searchProductsService(text).subscribe((res: any) => {
      this.productList = res['Hair Products'] ? res['Hair Products'] : res;
      console.log("SearchListProducts:", this.productList);
      // Trigger Rig on click of search fuctionality
      this.getBearerToken(searchText,'search',this.geoCoords);
    }, (err: any) => {
      console.log("error:", err);
    })
  }

  /* Create Bearer Token  to call Rig URL in cip environment*/

  callBearerTokenService() {
    const headers: any = [];
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
    headers['Authorization'] = 'Basic MEgyVmpYWHRPYkVGYXZ3NFFqc0VVa3ROUTRnYTo4VUgwRnBPZW1QRHY3dnVkSXVuRkpFV05LaGth'
    const body = 'grant_type=client_credentials&username=dir/experiencebuilder@songcomm04.accenture.com@songcomm04.accenture.com&password=HDtes!1urdc&scope=PRODUCTION'
    const url = "https://songcomm04-1685353139-iam-sit.aipacn.com/platform/enabler/iam/token/1.0.0/token"
    const options = { headers: new HttpHeaders(headers) }
    return this.http.post(url, body, options);
  }

  getBearerToken(searchText:any,parm:any,geoCoords:any) {
    this.callBearerTokenService().subscribe((res: any) => {
      console.log("Bearer Token:", res);
      this.bearerToken = res.access_token
      this.getRigResponse(searchText,parm,geoCoords);
    }, (err: any) => {
      console.log("error:", err);
    })
  }

  /* Call Rig */

  callRigService(searchText:any,parm:any,geoCoords:any) {
    const headers: any = [];
    headers['Content-Type'] = 'application/json'
    headers['Authorization'] = 'Bearer ' + this.bearerToken
    headers['cpaas-user-id'] = '123';
    let body:any;
    let url: any;
    console.log(geoCoords)
   
    if(parm === 'search'){
      window.analytics.track('SearchEvent', { 
        "user": "14d224f7-844d-4975-9dde-a00f6f4f05f2",
        "query": searchText,
        "channel": "web",
        "action": "search click from home page",
        "results": this.productList,
        "language": navigator.language,
        "page_title": document.title,
        "location":{
          "latitude":(geoCoords == null)? 0.0 :geoCoords.latitude,
          "longitude":(geoCoords == null)? 0.0 :geoCoords.longitude
        },
        "refererpage": window.location.href,
        "device_type": navigator.appVersion,
        "sessionId":this.uuid,
        "uniqueId": this.uniqueId
      });
      body = JSON.stringify({
        "id": "e60e628b-2400-413e-b486-664a3d8bc752--11",
        "type": "server.request",
        "specversion": "0.2",
        "source": "rig",
        "contenttype": "application/json",
        "deo": {
          "eventIdentifier": "NjQ4OTU1ZWEyYWI3YjYwMDE4YjUyYTYy-NjQ4OTUyYmYyYWI3YjYwMDE4YjUyOTdh",
		      "projectName": "commerce",
          "event": {
            "eventData": {
              "user": "14d224f7-844d-4975-9dde-a00f6f4f05f2",
              "query": searchText,
              "channel": "web",
              "action": "click on home search icon",
              "results": this.productList,
              "language": navigator.language,
              "page_title": document.title,
              "location":{
                "latitude":(geoCoords == null)? 0.0 :geoCoords.latitude,
                "longitude":(geoCoords == null)? 0.0 :geoCoords.longitude
              },
              "refererpage": window.location.href,
              "device_type": navigator.appVersion,
              "sessionId":this.uuid,
              "uniqueId": this.uniqueId
            }
          }
        }
      })
      localStorage.setItem("uniqueId", this.uniqueId);
      url = "https://songcomm04-1685353139-iam-sit.aipacn.com/xaas/enabler/producer/1.0.0/publish"
    }else { //parm is addtocart
      body = JSON.stringify({
        "id": "e60e628b-2400-413e-b486-664a3d8bc752--11",
        "type": "server.request",
        "specversion": "0.2",
        "source": "rig",
        "contenttype": "application/json",
        "deo": {
          "eventIdentifier": "NjQ4OTU1ZWEyYWI3YjYwMDE4YjUyYTYy-NjQ4OTUyOWUyYWI3YjYwMDE4YjUyOTZl",
          "projectName":"commerce",
          "event": {
            "eventData": {
              "user": "14d224f7-844d-4975-9dde-a00f6f4f05f2",
              "channel" :"Web",
              "action" :"add to cart",
              "location":{
                "latitude":(geoCoords == null)? 0.0 :geoCoords.latitude,
                "longitude":(geoCoords == null)? 0.0 :geoCoords.longitude
              },
              "product_data":searchText,
              "language": navigator.language,
              "page_title": document.title,
              "quantity":1,
              "refererpage" :window.location.href,
              "device_type":navigator.appVersion,
              "sessionId":this.uuid,
              "uniqueId": this.uniqueId ? this.uniqueId : ""
            }
          }
        }
      })
      url = "https://songcomm04-1685353139-iam-sit.aipacn.com/xaas/enabler/producer/1.0.0/publish"
    }
    const options = { headers: new HttpHeaders(headers) }
    return this.http.post(url, body, options);
  }

  getRigResponse(searchText:any,parm:any,geoCoords:any){
    this.callRigService(searchText,parm,geoCoords).subscribe((res: any) => {
      console.log("Rig Response:", res);
      this.toastr.showSuccess('Event Triggered successfully','');
    }, (err: HttpErrorResponse) => {
      console.log("error:", err);
      this.toastr.showError('Event Trigger failed','')
    })
  }

  addtoCart(selectedProduct:any){   
    this.toastr.showSuccess('Product added Successfully','');
    console.log("selected product",selectedProduct);
  
    this.headerService.getCartItems(selectedProduct);
  
    this.getBearerToken(selectedProduct,'addtoCart',this.geoCoords);
  }

}
