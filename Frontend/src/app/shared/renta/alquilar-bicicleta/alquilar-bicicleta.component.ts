import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { product_add } from 'src/app/interfaces/product_add.';
import { NavComponent } from "../../renta/nav/nav.component";
import { FooterComponent } from "../../footer/footer.component";
import { MapaComponent } from '../../mapa/mapa.component';
import * as L from 'leaflet';

@Component({
    selector: 'app-alquilar-bicicleta',
    standalone: true,
    templateUrl: './alquilar-bicicleta.component.html',
    styleUrl: './alquilar-bicicleta.component.css',
    imports: [ReactiveFormsModule, NavComponent, FooterComponent,MapaComponent]
})

export class AlquilarBicicletaComponent {
  bicicletaForm: FormGroup | any;
  cedulaUsuario: string | null = null;
  map: L.Map | undefined;
  latitude?: number;
  longitude?: number;
  constructor(private formBuilder: FormBuilder, private productService: ProductService, private userService: UserService) {}

  ngOnInit(): void {
    // Obtén la cédula del usuario al inicializar el componente
    this.userService.getCedulaUsuario().subscribe(cedula => {
      this.cedulaUsuario = cedula;
    });

    // Obtén la ubicación actual del usuario
//no me carga el mapa




    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.map = L.map('map').setView([this.latitude, this.longitude], 13);
    });
    //

    //
    if (this.map) {
      L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
    }

    this.map?.on('click', (e) => {
      const latlng = e.latlng;
      const latitude = latlng.lat;
      const longitude = latlng.lng;
    });




    // Inicializa el formulario
    this.bicicletaForm = this.formBuilder.group({
      modelo: ['', Validators.required],
      tipo: ['', Validators.required],
      estado: ['', Validators.required],
      precioPorHora: ['', Validators.required],
      descripcion: [''],
      imagenReferencia: [null]
    });
  }

  onFileChange(event: any) {

    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.bicicletaForm.patchValue({
        imagenReferencia: file
      });

      reader.readAsDataURL(file);
    }
  }

  guardarBicicleta() {
    if (this.bicicletaForm.valid && this.cedulaUsuario !== null) {
      const product: product_add = {
        Modelo: this.bicicletaForm.value.modelo,
        Tipo: this.bicicletaForm.value.tipo,
        Estado: this.bicicletaForm.value.estado,
        imagenReferencia: this.bicicletaForm.value.imagenReferencia,
        PrecioPorHora: this.bicicletaForm.value.precioPorHora,
        Descripcion: this.bicicletaForm.value.descripcion,
      }
      console.log('Bicicleta agregada correctamente:', product);

      // Verifica en la consola si los valores se están capturando correctamente
      this.productService.createBicycleForUser(this.cedulaUsuario, product).subscribe(
        (respuesta) => {
          console.log('Bicicleta agregada correctamente:', respuesta);
        },
        (error) => {
          console.error('Error al agregar bicicleta:', error);
        }
      );

    }
  }
}
