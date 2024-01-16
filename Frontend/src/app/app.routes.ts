import { Routes } from '@angular/router';
import { LoginComponent } from './shared/login/login.component';
import { DashboardComponent } from './shared/lamding/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './shared/forgot-password/forgot-password.component';
import { RegisterComponent } from './shared/register/register.component';
import { NewpasswordComponent } from './shared/forgot-password/newpassword/newpassword.component';
import { CatalogoComponent } from './shared/renta/catalogo/catalogo.component';
import { AlquilarBicicletaComponent } from './shared/renta/alquilar-bicicleta/alquilar-bicicleta.component';
import { authGuard } from './utils/auth.guard';
import { CarritoComponent } from './shared/renta/carrito/carrito.component';
import { MapaComponent } from './shared/mapa/mapa.component';
import { SectionComponent } from './shared/lamding/section/section.component';



export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'section', component: SectionComponent},
  { path: 'inicio#tarifas', redirectTo: '/inicio#tarifas', pathMatch: 'full'},
  { path: 'inicio#nosotros', redirectTo: '/inicio#nosotros', pathMatch: 'full'},
  { path: 'inicio#preguntas', redirectTo: '/inicio#preguntas', pathMatch: 'full'},
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'forgot-password', redirectTo: '/forgot-password', pathMatch: 'full' },
  { path: 'reset-password', component: NewpasswordComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register', redirectTo: '/register', pathMatch: 'full' },
  { path: 'catalogo', component: CatalogoComponent, canActivate: [authGuard] },
  { path: 'carrito', component: CarritoComponent, canActivate: [authGuard] },
  {path:'mapa',component:MapaComponent, canActivate: [authGuard]},
  { path: 'agregar-bicicleta', component: AlquilarBicicletaComponent, canActivate: [authGuard] },
  {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
  { path: '**', redirectTo: '/inicio', pathMatch: 'full' }
];

