import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token'); // ou sessionStorage, depende do que usas
    localStorage.removeItem('user');

    // Redirecionar para o login
    this.router.navigate(['/login']);
  }
}
