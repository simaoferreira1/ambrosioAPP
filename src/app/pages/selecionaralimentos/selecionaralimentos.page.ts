import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-selecionaralimentos',
  templateUrl: './selecionaralimentos.page.html',
  styleUrls: ['./selecionaralimentos.page.scss'],
  standalone: false,
})
export class SelecionaralimentosPage implements OnInit {

  alimentos = [
    { nome: 'Carne de vaca moída', imagem: 'assets/carne.jpg', selecionado: true },
    { nome: 'Alface', imagem: 'assets/alface.jpg', selecionado: true },
    { nome: 'Arroz', imagem: 'assets/arroz.jpg', selecionado: false },
    { nome: 'Feijão verde', imagem: 'assets/feijao.jpg', selecionado: false },
    { nome: 'Massa esparguete', imagem: 'assets/massa.jpg', selecionado: true },
    { nome: 'Laranjas', imagem: 'assets/laranja.jpg', selecionado: true },
    { nome: 'Bife de frango', imagem: 'assets/frango.jpg', selecionado: false },
    { nome: 'Queijo flamengo fatiado', imagem: 'assets/queijo.jpg', selecionado: false },
    { nome: 'Bróculos', imagem: 'assets/brocolos.jpg', selecionado: false },
    { nome: 'Costelas do cachaço', imagem: 'assets/costeletas.jpg', selecionado: false },
    { nome: 'Maçãs', imagem: 'assets/macas.jpg', selecionado: false },
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  irParaCarregamento() {
    this.router.navigate(['/carregamento']);
  }
}
