import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header/header.service';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  productLists: any = [];

  constructor(private headerService:HeaderService) { }

  ngOnInit(): void {
    this.productLists = [...this.headerService.cartProducts];
    console.log('test');
  }

}
