import { Component, OnInit, OnChanges, SimpleChange, ViewChild, Input } from '@angular/core';
import {RequiredProductComponent} from './required-product.component'
import {RequiredProduct} from './required-product'
import { ProductService } from './product.service';
import { MovProductService } from '../app_deshacerProduccion/mov-product.service';
import { Producto } from './producto';
import { MovProductoFinal } from '../app_deshacerProduccion/mov-product-final';
import { CommonFunctions } from './common-functions';

@Component({
  selector: 'my-product-detail',
  template: `
	<div *ngIf="producto" style="overflow-x:auto;">
		<table class="table table-bordered">
			
			<thead class="thead-inverse">
			  <tr>
				<th>A producir</th>
				<th>Stock actual</th>
				<th>Unidad</th>
				<th>Cantidad</th>
				<th>Merma</th>
			  </tr>
			</thead>
			
			<tbody>
				<td>{{producto.nombre}}</td>
				<td>{{producto.cantidad}}</td>
				<td>{{producto.unidad}}</td>
				<td><input [(ngModel)]="producto.cant" type="number" min="0.01" step="0.01" (blur)="setGastos()" placeholder="Cantidad"/></td>
				<td><input [(ngModel)]="producto.porcentajeMerma" type="number" min="0.01" max="99.99" step="0.01" (blur)="overideGastos()" placeholder="Merma"/></td>
			</tbody>
			
		</table>
		<hr>
		<required-product-detail #required (notify)="onNotify($event)" [product]="producto"></required-product-detail> 
		
		<div style="text-align:center">
			<button (click)="fabricar()" type="button" class="btn btn-primary">Fabricar</button>
		</div>
	</div>
  `,
  styles:[`
	
	th, td {
		text-align:center
	}
	
	hr { 
		display: block;
		margin-top: 0.5em;
		margin-bottom: 0.5em;
		margin-left: auto;
		margin-right: auto;
		border-style: inset;
		border-width: 1px;
		background-color: #607d8b;
	}
	 thead {
    background-color: #607d8b;
    color: white;
	}
 `],
  providers: [ProductService, MovProductService]
})
export class ProductDetailComponent implements OnChanges {
  
  @Input()
  productoID: Producto;
  producto: Producto;
  requiredListDone: boolean = false;
  hasErrorsEmitted: boolean = false;
  
  @ViewChild('required') 	
  requiredProds: RequiredProductComponent;
  
  constructor(private productService: ProductService, private movProductService: MovProductService) { }
  
  ngOnChanges(changes: { [key: string]: SimpleChange}) {		
	this.productService.getProduct(this.productoID)
		.then(product => {
			this.producto = product;
		});
  }
  
  fabricar(): void {
	this.hasErrorsEmitted = false;
	//no ceros, no NAN, no negativo, aviso de no cumple con porcentaje, aviso excluye merma
	if (this.producto.cant && this.producto.cant > 0 && this.producto.porcentajeMerma && this.producto.porcentajeMerma > 0 && this.requiredProds.allGastosSetted() ) {
		console.log('post server');
		this.producto.add = true;
		//solo me fijo de los productos requeridos, ya que hace una resta, al sacar del stock (al agregar no hace falta);
		this.requiredProds.canUpdate(); //si puede va al onNotify
	} else {
		if (this.producto.cant == null || this.producto.cant <= 0) {
			alert('Cantidad erronea.');
		} else if (this.producto.porcentajeMerma == null || this.producto.porcentajeMerma <= 0) {
			alert('Merma erronea.');
		} else  {
			alert('Indicadores en rojo.');
		}
	}
  }
  
  onNotify(message:string):void {
	if (message == 'Done') {
		this.requiredListDone = true;
	} else if (message == 'Can'){//Si puede viene aca
		this.productService.putNewStock(this.producto).then(() => {
			this.movProductService.postMovimientoFinal(this.producto).then( movFinal => this.requiredProds.putNewStock(movFinal));
		}).catch(err => {
			if(err.status == 505) {
				alert(err._body);
			}
		});
	} else if (message == 'Error'){
		alert('No se pudo conectar al servidor.');
	} else if(message == 'Fin'){
		alert('Stock actualizado con éxito.');
		this.producto.cant = null;
		this.producto = null;
	} else if (message == 'StckEr' && !this.hasErrorsEmitted) {
		this.hasErrorsEmitted = true;
		alert('No hay stock suficiente para realizar la acción.');
	}
  }
  
  setGastos(): void {
	
	if (this.producto.cant && this.producto.cant > 0 && this.producto.porcentajeMerma && this.producto.porcentajeMerma > 0
		&& this.requiredListDone && this.requiredProds.allGastosEmpty()) {
			this.requiredProds.setGastos(this.producto.cant / (1 - (this.producto.porcentajeMerma / 100)));
	}
  }
  
  overideGastos(): void {
	if (this.producto.cant && this.producto.cant > 0 && this.producto.porcentajeMerma && this.producto.porcentajeMerma > 0)
		this.requiredProds.setGastos(this.producto.cant / (1 - (this.producto.porcentajeMerma / 100)));
	
  }
}
