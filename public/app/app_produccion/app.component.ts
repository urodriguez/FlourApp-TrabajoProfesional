import { Component, OnInit } from '@angular/core';
import { Producto } from './producto';
import { ProductService } from './product.service';
@Component({
  selector: 'my-app',
  template: `
	<div *ngIf="productos" class="container-fluid">
		<div class="row">
			<div>
				<div class="list-group productos" style="padding-right: .25cm; padding-left: .25cm;">
					<li class="list-group-item">
						<strong>¿Qué producto desea fabricar?</strong>
					</li>
				
					<button type="button" class="list-group-item list-group-item-action" 
						*ngFor="let producto of productos"
						[class.selected]="producto === selectedProduct"
						(click)="onSelect(producto)">
							{{producto.nombre}}
					</button>
				</div>
			</div>
		
			<my-product-detail [producto]="selectedProduct"></my-product-detail> 
			
		</div>
	</div>
  `,
  styles: [`
  .selected {
      background-color: #CFD8DC !important;
      color: white;
    }
  `],
  providers: [ProductService]
})
export class AppComponent implements OnInit {
  productos: Producto[];
  auxProds: Producto[];
  selectedProduct: Producto;
  
  constructor(private productService: ProductService) { }
  
  getProducts(): void {
	
    this.productService.getProductsSemi().then(productosSemi => {
		this.auxProds = productosSemi;
		this.productService.getProductsTerm().then(productosTerm => this.productos = this.auxProds.concat(productosTerm));
	});
  }
 
  ngOnInit(): void {
    this.getProducts();
  }
  
  onSelect(producto: Producto): void {
    this.selectedProduct = producto;
  }
}
