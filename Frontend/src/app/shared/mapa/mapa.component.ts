import { Ubicacion } from './../../interfaces/ubicacion';
import { Component, Input, OnInit } from '@angular/core';
import { PlacesService } from '../../services/places.service';
import { icon, Map, marker, tileLayer } from 'leaflet';
import {CommonModule } from '@angular/common';
import { LatLngExpression } from 'leaflet';
import { UbicacionService } from 'src/app/services/ubicacion.service';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css',
})
export class MapaComponent implements OnInit{
  listUbicacion: Ubicacion[] = [];
  geo: any;
  map: any;
  ubic: any;
  contaddor: number = 0;

  constructor(private PlaceSvc: PlacesService,private _ubicacionService: UbicacionService) {}

  localStorage: Storage = window.localStorage;

  ngOnInit() {
    setTimeout(() => {
      if(this.ubic==undefined){
      this.geo = this.PlaceSvc.useLocation;
      this.localStorage.setItem('geolocalizar', JSON.stringify(this.geo));
      }else{
        this.localStorage.removeItem('geolocalizar');
        this.ubic = this.localStorage.getItem('geolocalizar');
      }

    }, 2000);
    this.getUbicacions();

    console.log(this.listUbicacion);
  }

  ngAfterViewInit() {

    setTimeout(() => {
      this.ubic = this.localStorage.getItem('geolocalizar');
      this.map = new Map('map').setView(JSON.parse(this.ubic), 13);

      tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
    }, 2000);
  }


  marcadores() {
    setTimeout(() => {
      for (let i = 0; i < this.listUbicacion.length; i++) {
        const nombre = this.listUbicacion[i].NombreUbicacion;
        const direccion = this.listUbicacion[i].Direccion;
        const latitude = this.listUbicacion[i].Latitud;
        const longitude = this.listUbicacion[i].Longitud;
        if (latitude !== undefined && longitude !== undefined) {
          const latLng: LatLngExpression = [latitude, longitude];
          const myIcon = icon({ iconUrl: './assets/img/pinblue.png', iconSize: [34, 42] });
          marker(latLng,{icon:myIcon}).addTo(this.map).bindPopup("<b>"+'Lugar : '+nombre+"<br>"+'Dirección : '+direccion+"</b>").openPopup;
        }
      }
    }, 2000);
  }

  ubicar() {
    this.ubic = this.localStorage.getItem('geolocalizar');

    const myIcon = icon({ iconUrl: './assets/img/pin.png', iconSize: [34, 42] });
    const myubic = marker(JSON.parse(this.ubic),{icon:myIcon}).addTo(this.map).bindPopup("<strong>Esta es mi ubicación</strong>");
    let newubicacion = myubic.setLatLng(JSON.parse(this.ubic));
    console.log(newubicacion);

  }
  recargar() {
    location.reload();
  }

  getUbicacions() {
    this._ubicacionService.getUbicacion().subscribe(data => {
      console.log('Datos recibidos de ubicacion:', data);
      this.listUbicacion = data;
    });
  }

}
