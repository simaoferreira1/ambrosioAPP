import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // <-- IMPORTA O ROUTER

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone:false,
})
export class InicioPage implements OnInit {

  constructor(private router: Router) {} // <-- INJETAR O ROUTER

  ngOnInit() {
    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 2000);
  }
}
