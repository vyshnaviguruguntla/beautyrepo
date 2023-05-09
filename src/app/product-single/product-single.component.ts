import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { HeaderService } from '../header/header.service';
import { ToastService } from '../toaster/toast.service';
import { Router } from '@angular/router';
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

  constructor(private http: HttpClient, private headerService: HeaderService,
    private toastr: ToastService, private router:Router) { }

  ngOnInit(): void {
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
    this.searchProductsService(text).subscribe((res: any) => {
      this.productList = res['Hair Products'] ? res['Hair Products'] : res;
      console.log("SearchListProducts:", this.productList);
      // Trigger Rig on click of search fuctionality
      this.getBearerToken(searchText,'search');
    }, (err: any) => {
      console.log("error:", err);
    })
  }

  /* Create Bearer Token  to call Rig URL in cip environment*/

  callBearerTokenService() {
    const headers: any = [];
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
    //cip demo
    //headers['Authorization'] = 'Basic UjVwX1NrM0M0TU55dEs5V1NBbnFqNm0ySUxvYTpfZV9jeHF4VHlzdGdCRFpzVGdRb1QyZVV4OUVh'
    //cip old
    headers['Authorization'] = 'Basic VXZ4MGxlTkM2QjBpeUVVbFZ4dWVRUUhxMFBnYTpYNVk2ZU5INHlUUTlDOFJOcnlqZkptaHJoc0lh'
    //headers['recognition-identity-id'] = 'b95548f7deeea93bc0abeaade6597433'
    //cip demo
    //const body ='grant_type=password&username=dir/experiencebuilder@cipdemo.accenture.com@cipdemo.accenture.com&password=Digitalinsurance786#&scope=PRODUCTION'
    //cip old
    const body = 'grant_type=password&username=dir/experiencebuilder@cip.accenture.com@cip.accenture.com&password=Digitalinsurance786#&scope=PRODUCTION'
    //cip demo url
    //const url = "https://cipdemo-1643214451-iam-sit.cognitiveinsurance.accenture.com/platform/enabler/iam/token/1.0.0/token"
    //cip old url
    const url = "https://cip-1621266427-iam-sit.aipacn.com/platform/enabler/iam/token/1.0.0/token"
    const options = { headers: new HttpHeaders(headers) }
    return this.http.post(url, body, options);
  }

  getBearerToken(searchText:any,parm:any) {
    this.callBearerTokenService().subscribe((res: any) => {
      console.log("Bearer Token:", res);
      this.bearerToken = res.access_token
      this.getRigResponse(searchText,parm);
    }, (err: any) => {
      console.log("error:", err);
    })
  }

  /* Call Rig */

  callRigService(searchText:any,parm:any) {
    const headers: any = [];
    headers['Content-Type'] = 'application/json'
    headers['Authorization'] = 'Bearer ' + this.bearerToken
    headers['cpaas-user-id'] = '123';
    let body:any;
    let url: any;
    if(parm === 'search'){
      body = JSON.stringify({
        "id": "e60e628b-2400-413e-b486-664a3d8bc752--11",
        "type": "server.request",
        "specversion": "0.2",
        "source": "rig",
        "contenttype": "application/json",
        "deo": {
          //cip demo
          //"eventIdentifier": "NjQ0NjY4MWY4OWI5NzUwMDE3ZTUwZTlh-NjQ0NjY3NDk4OWI5NzUwMDE3ZTUwZTVk",//comb of journey id and event id
          //"projectName": "Commerce",
          "projectName":"commerce",
          "event": {
            //cip old
            "eventName": "SearchEvent",
            "eventData": {
              "user": "1234",
              "query": searchText,
              "channel": "web",
              "action": "click on home search icon",
              "refererpage": window.location.href,
              "device_type": navigator.appVersion,
              "sessionId":this.uuid
            }
          }
        }
      })
      //cip demo
      //url = "https://cipdemo-1643214451-iam-sit.cognitiveinsurance.accenture.com/xaas/enabler/producer/1.0.0/publish"
      //cip old
      url = "https://cip-1621266427-iam-sit.aipacn.com/xaas/enabler/rigevent/1.0.0/publish"
    }else { //parm is addtocart
      body = JSON.stringify({
        "id": "e60e628b-2400-413e-b486-664a3d8bc752--11",
        "type": "server.request",
        "specversion": "0.2",
        "source": "rig",
        "contenttype": "application/json",
        "deo": {
          //cip demo
          //"eventIdentifier": "NjQ0NjY4MWY4OWI5NzUwMDE3ZTUwZTlh-NjQ0YTFlMDk4OWI5NzUwMDE3ZTUxNzNk",//comb of journey id and event id
          //"projectName": "Commerce",
          "projectName":"commerce",
          "event": {
            //cip old
            "eventName": "AddToCartEvent",
            "eventData": {
              "user":"1234",
              "channel" :"Web",
              "action" :"add to cart",
              "product_data":searchText,
              "quantity":1,
              "refererpage" :window.location.href,
              "device_type":navigator.appVersion, //session id should be included
              "sessionId":this.uuid
            }
          }
        }
      })
      //cip demo
      //url = "https://cipdemo-1643214451-iam-sit.cognitiveinsurance.accenture.com/xaas/enabler/rigevent/1.0.0/publish"
      //cip old
      url = "https://cip-1621266427-iam-sit.aipacn.com/xaas/enabler/rigevent/1.0.0/publish"
    }
    const options = { headers: new HttpHeaders(headers) }
    return this.http.post(url, body, options);
  }

  getRigResponse(searchText:any,parm:any){
    this.callRigService(searchText,parm).subscribe((res: any) => {
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
    this.getBearerToken(selectedProduct,'addtoCart');
    //this.router.navigate(['./cart']);
  }

}
