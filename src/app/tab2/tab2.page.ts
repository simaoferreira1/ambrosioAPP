import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone:false
})
export class Tab2Page {

  alimentos = [
    { nome: 'Maçãs', imagem: 'assets/macas.jpg', quantidade: '5 unidades', dataCompra: '19-03-2025', dataValidade: '26-03-2025' },
    { nome: 'Carne de vaca moída', imagem: 'assets/carne.jpg', quantidade: '1 kg', dataCompra: '20-03-2025', dataValidade: '27-03-2025' },
    { nome: 'Alface', imagem: 'assets/alface.jpg', quantidade: '1 unidade', dataCompra: '21-03-2025', dataValidade: '28-03-2025' },
    { nome: 'Arroz', imagem: 'assets/arroz.jpg', quantidade: '2 kg', dataCompra: '22-03-2025', dataValidade: '29-03-2025' },
    { nome: 'Feijão verde', imagem: 'assets/feijao.jpg', quantidade: '500 g', dataCompra: '23-03-2025', dataValidade: '30-03-2025' },
    { nome: 'Massa esparguete', imagem: 'assets/massa.jpg', quantidade: '1 kg', dataCompra: '24-03-2025', dataValidade: '31-03-2025' },
    { nome: 'Laranjas', imagem: 'assets/laranja.jpg', quantidade: '6 unidades', dataCompra: '25-03-2025', dataValidade: '01-04-2025' },
    { nome: 'Bife frango', imagem: 'assets/frango.jpg', quantidade: '1 kg', dataCompra: '26-03-2025', dataValidade: '02-04-2025' },
    { nome: 'Queijo flamengo fatiado', imagem: 'assets/queijo.jpg', quantidade: '200 g', dataCompra: '27-03-2025', dataValidade: '03-04-2025' },
    { nome: 'Bróculos', imagem: 'assets/brocolos.jpg', quantidade: '300 g', dataCompra: '28-03-2025', dataValidade: '04-04-2025' },
    { nome: 'Costeletas do cachaço', imagem: 'assets/costeletas.jpg' , quantidade: '1 kg', dataCompra: '29-03-2025', dataValidade: '05-04-2025' },
  ];

}
