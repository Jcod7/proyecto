import { Ubicacion } from './../../../interfaces/ubicacion';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import { MapaComponent } from '../../mapa/mapa.component';
import { UbicacionService } from 'src/app/services/ubicacion.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,MapaComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  listProduct: Product[] = [];
  listUbicacion: Ubicacion[] = [];
  serverBaseUrl = 'http://localhost:3001';
  token: string | null = null;
  opciones = [
    { nombre: 'Tradicional', checked: false },
    { nombre: 'Electrica', checked: false },
    { nombre: 'Montaña', checked: false },
    { nombre: 'Todas', checked: true }
  ];
  isAdmin: boolean = false;
  constructor(private _productService: ProductService, private _userService: UserService,private _ubicacionService: UbicacionService) {
   }

  ngOnInit(): void {
    this._userService.getRolUsuario().subscribe(rol => {
      this.isAdmin = rol === 2;
    });
    // Obtén el token del Local Storage
    this.token = localStorage.getItem('token');
    this.getUbicacions();
    this.getProducts();

  }

  getProducts() {
    this._productService.getProductsWithImages().subscribe(data => {
      console.log('Datos recibidos:', data);
      this.listProduct = data;

    });
  }

  getUbicacions() {
    this._ubicacionService.getUbicacion().subscribe(data => {
      console.log('Datos recibidos de ubicacion:', data);
      this.listUbicacion = data;
    });
  }

  toggleCheckbox(opcion: any) {
    // Si ya estaba seleccionado, deseleccionar
    if (opcion.checked) {
      opcion.checked = false;
    } else {
      // Si no estaba seleccionado, seleccionar y deseleccionar otras opciones
      opcion.checked = true;

      this.opciones.forEach((o: any) => {
        if (o !== opcion) {
          o.checked = false;
        }
      });
    }
  }

  resetFilters() {
    // Deseleccionar todas las opciones
    this.opciones.forEach((opcion: any) => {
      opcion.checked = false;
    });
  }
  getImageUrl(imageName: string): string {
    const token = localStorage.getItem('token');
    const tokenParam = token ? `?token=${token}` : '';
    return `${this.serverBaseUrl}/api/products/bikes/imagen/${imageName}${tokenParam}`;
  }


  createProduct(newProduct: Product) {
    this._productService.createProduct(newProduct).subscribe(createdProduct => {
      // Lógica adicional si es necesario
      this.getProducts(); // Recargar la lista después de crear un nuevo producto
    });
  }


  updateProduct(productId: number, updatedProduct: Product) {
    this._productService.updateProduct(productId, updatedProduct).subscribe(() => {
      // Lógica adicional si es necesario
      this.getProducts(); // Recargar la lista después de actualizar el producto
    });
  }

  deleteProduct(productId: number) {
    if (productId !== undefined && productId !== null) {
      this._productService.deleteProduct(productId).subscribe(() => {
        this.getProducts();
      });
    } else {
      console.error('El ID del producto es indefinido o nulo.');
    }
  }

}
