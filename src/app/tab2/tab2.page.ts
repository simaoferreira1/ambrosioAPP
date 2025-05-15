import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone:false
})
export class Tab2Page {

  alimentos = [
    { nome: 'Maçãs', imagem: 'assets/macas.jpg' },
    { nome: 'Carne de vaca moída', imagem: 'assets/carne.jpg' },
    { nome: 'Alface', imagem: 'assets/alface.jpg' },
    { nome: 'Arroz', imagem: 'assets/arroz.jpg' },
    { nome: 'Feijão verde', imagem: 'assets/feijao.jpg' },
    { nome: 'Massa esparguete', imagem: 'assets/massa.jpg' },
    { nome: 'Laranjas', imagem: 'assets/laranja.jpg' },
    { nome: 'Bife frango', imagem: 'assets/frango.jpg' },
    { nome: 'Queijo flamengo fatiado', imagem: 'assets/queijo.jpg' },
    { nome: 'Bróculos', imagem: 'assets/brocolos.jpg' },
    { nome: 'Costeletas do cachaço', imagem: 'assets/costeletas.jpg' }
  ];

}
