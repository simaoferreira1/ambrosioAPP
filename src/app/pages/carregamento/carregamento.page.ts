import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carregamento',
  templateUrl: './carregamento.page.html',
  styleUrls: ['./carregamento.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class CarregamentoPage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    // Redireciona para a página de receita após 3 segundos
    setTimeout(() => {
      this.router.navigate(['/receita']);
    }, 3000);
  }
}
