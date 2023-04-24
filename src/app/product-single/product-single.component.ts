import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { HeaderService } from '../header/header.service';
import { ToastService } from '../toaster/toast.service';
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

  constructor(private http: HttpClient, private headerService: HeaderService,
    private toastr: ToastService) { }

  ngOnInit(): void {
    this.displayProducts();
    this.fetchLikedProducts();
    this.headerService.currentApprovalStageMessage.subscribe(msg => {
      this.productList = [];
      this.searchProducts(msg);
    });
  }

  fetchProducts() {
    const headers: any = [];
    headers['Content-Type'] = 'application/json';
    headers['Acess-Control-Allow-Origin'] = '*';
    const url = "https://sample-poc-8a5f.vercel.app/api/getProducts"
    const options = { headers: new HttpHeaders(headers) }
    return this.http.get(url, options);
  }

  fetchYouMayAlsoLikeService() {
    const headers: any = [];
    headers['Content-Type'] = 'application/json';
    headers['Acess-Control-Allow-Origin'] = '*';
    const url = "https://sample-poc-8a5f.vercel.app/api/getLikedProducts"
    const options = { headers: new HttpHeaders(headers) }
    return this.http.get(url, options);
  }

  searchProductsService(text: any) {
    const headers: any = [];
    headers['Content-Type'] = 'application/json';
    headers['Acess-Control-Allow-Origin'] = '*';
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
      this.getBearerToken(searchText);
    }, (err: any) => {
      console.log("error:", err);
    })
  }

  /* Create Bearer Token  to call Rig URL in cip environment*/

  callBearerTokenService() {
    const headers: any = [];
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
    headers['Authorization'] = 'Basic UjVwX1NrM0M0TU55dEs5V1NBbnFqNm0ySUxvYTpfZV9jeHF4VHlzdGdCRFpzVGdRb1QyZVV4OUVh'
    //headers['recognition-identity-id'] = 'b95548f7deeea93bc0abeaade6597433'
    const body =
      'grant_type=password&username=dir/experiencebuilder@cipdemo.accenture.com@cipdemo.accenture.com&password=Digitalinsurance786#&scope=PRODUCTION'
    const url = "https://cipdemo-1643214451-iam-sit.cognitiveinsurance.accenture.com/platform/enabler/iam/token/1.0.0/token"
    const options = { headers: new HttpHeaders(headers) }
    return this.http.post(url, body, options);
  }

  getBearerToken(searchText:any) {
    this.callBearerTokenService().subscribe((res: any) => {
      console.log("Bearer Token:", res);
      this.bearerToken = res.access_token
      this.getRigResponse(searchText);
    }, (err: any) => {
      console.log("error:", err);
    })
  }

  /* Call Rig */

  callRigService(searchText:any) {
    const headers: any = [];
    headers['Content-Type'] = 'application/json'
    headers['Authorization'] = 'Bearer ' + this.bearerToken
    headers['cpaas-user-id'] = '123'
    const body = JSON.stringify({
      "id": "e60e628b-2400-413e-b486-664a3d8bc752--11",
      "type": "server.request",
      "specversion": "0.2",
      "source": "rig",
      "contenttype": "application/json",
      "deo": {
        "eventIdentifier": "NjM4NzFkZjkyMzVjY2QwMDE3YzVlMmVl-NjNhYThlNmMwY2ViNjYwMDE3ZTNiNzM0",
        "projectName": "Commerce",
        "event": {
          "eventData": {
            "user": "test_user",
            "query": searchText,
            "channel": "Web",
            "action": "",
            "refererpage": "",
            "device_type": "",
            "device_name": ""
          }
        }
      }
    })

    //const url = "https://cip-1621266427-iam-sit.aipacn.com/xaas/enabler/producer/1.0.0/publish"
    const url = "https://cipdemo-1643214451-iam-sit.cognitiveinsurance.accenture.com/xaas/enabler/rigevent/1.0.0/publish"
    const options = { headers: new HttpHeaders(headers) }
    return this.http.post(url, body, options);
  }

  getRigResponse(searchText:any){
    this.callRigService(searchText).subscribe((res: any) => {
      console.log("Rig Response:", res);
      this.toastr.showSuccess('Event Triggered successfully','');
    }, (err: HttpErrorResponse) => {
      console.log("error:", err);
      this.toastr.showError('Event Trrigger failed','')
    })
  }

}
