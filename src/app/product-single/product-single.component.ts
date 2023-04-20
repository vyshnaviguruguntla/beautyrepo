import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { HeaderService } from '../header/header.service';

@Component({
  selector: 'app-product-single',
  templateUrl: './product-single.component.html',
  styleUrls: ['./product-single.component.css']
})
export class ProductSingleComponent implements OnInit {

  productList: any;
  likedProducts: any;
  searchList: any;

  constructor(private http: HttpClient, private headerService: HeaderService) { }

  ngOnInit(): void {
    this.displayProducts();
    this.fetchLikedProducts();
    this.headerService.currentApprovalStageMessage.subscribe(msg => {
      // if (msg !== 'Basic Approval is required!') {
        this.searchProducts(msg);
      // }
    });
    this.getBearerToken();
  }

  fetchProducts() {
    const headers: any = [];
    headers['Content-Type'] = 'application/json';
    const url = "https://sample-poc-8a5f.vercel.app/api/getProducts"
    const options = { headers: new HttpHeaders(headers) }
    return this.http.get(url, options);
  }

  fetchYouMayAlsoLikeService() {
    const headers: any = [];
    headers['Content-Type'] = 'application/json';
    const url = "https://sample-poc-8a5f.vercel.app/api/getLikedProducts"
    const options = { headers: new HttpHeaders(headers) }
    return this.http.get(url, options);
  }

  searchProductsService(text: any) {
    const headers: any = [];
    headers['Content-Type'] = 'application/json';
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
    this.searchProductsService(text).subscribe((res: any) => {
      this.productList = res['Hair Products'] ? res['Hair Products'] : res;
      console.log("SearchListProducts:", this.productList);
    }, (err: any) => {
      console.log("error:", err);
    })
  }

  /* Create Bearer Token  to call Rig URL in cip environment*/

  callBearerTokenService() {
    const headers: any = [];
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
    headers['Host'] = 'cip-1621266427-iam-sit.aipacn.com'
    headers['User-Agent'] = 'Apache-HttpClient/4.5.5 (Java/1.8.0_271)'
    headers['Authorization'] = 'Basic VXZ4MGxlTkM2QjBpeUVVbFZ4dWVRUUhxMFBnYTpYNVk2ZU5INHlUUTlDOFJOcnlqZkptaHJoc0lh'
    //headers['recognition-identity-id'] = 'b95548f7deeea93bc0abeaade6597433'
    const body = 
    'grant_type=password&username=dir/ACEuser@cip.accenture.com@cip.accenture.com&password=Digitalinsurance786#&scope=PRODUCTION'
    //'grant_type=password&username=dir/experiencebuilder@cip.accenture.com@cip.accenture.com&password=Digitalinsurance786&&scope=PRODUCTION'
    const url = "https://cip-1621266427-iam-sit.aipacn.com/platform/enabler/iam/token/1.0.0/token"
    const options = { headers: new HttpHeaders(headers) }
    return this.http.post(url, body, options);
  }

  getBearerToken() {
    this.callBearerTokenService().subscribe((res: any) => {
      console.log("Bearer Token:", res);
    }, (err: any) => {
      console.log("error:", err);
    })
  }

  /* Call Rig Url */

  

}
