import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  slides = [
    {
      img: 'assets/macas.jpg',
      title: 'Maçãs frescas',
      subtitle: 'Expira em 7 dias',
    },
    {
      img: 'assets/laranja.jpg',
      title: 'Laranjas doces',
      subtitle: 'Expira em 5 dias',
    },
  // Add more items as needed
  ];


}
