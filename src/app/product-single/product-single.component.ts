import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-single',
  templateUrl: './product-single.component.html',
  styleUrls: ['./product-single.component.css']
})
export class ProductSingleComponent implements OnInit {

  productList:any;
  likedProducts:any;
  searchList: any;

  constructor(private http: HttpClient) { }
  
  ngOnInit(): void {
    this.displayProducts();
    this.fetchLikedProducts();
  }

  fetchProducts(){
    const headers:any = [];
    headers['Content-Type'] =  'application/json';
    const url = "https://sample-poc-8a5f.vercel.app/api/getProducts"
    const options =  {headers: new HttpHeaders(headers)}
    return this.http.get(url, options);
  }

  fetchYouMayAlsoLikeService() {
    const headers:any = [];
    headers['Content-Type'] =  'application/json';
    const url = "https://sample-poc-8a5f.vercel.app/api/getLikedProducts"
    const options =  {headers: new HttpHeaders(headers)}
    return this.http.get(url, options);
  }

  fetchLikedProducts(){
    this.fetchYouMayAlsoLikeService().subscribe((res:any)=>{
      this.likedProducts = res['Liked Hair Products'];
      console.log("Liked productsList:",this.likedProducts);
    },(err:any)=>{
      console.log("error:",err);
    })
  }

  displayProducts(){
    this.fetchProducts().subscribe((res:any)=>{
      this.productList = res['Hair Products'];
      console.log("productsList:",this.productList);
    },(err:any)=>{
      console.log("error:",err);
    })
  }

  searchProductsService(text:any){
    const headers:any = [];
    headers['Content-Type'] =  'application/json';
    const url = "https://sample-poc-8a5f.vercel.app/api/search?searchKey="+ text;
    const options =  {headers: new HttpHeaders(headers)}
    return this.http.get(url, options);
  }

  searchProducts(text:any){
    this.searchProductsService(text).subscribe((res:any)=>{
      this.searchList = res['Hair Products'];
      console.log("productsList:",this.productList);
    },(err:any)=>{
      console.log("error:",err);
    })
  }
}
