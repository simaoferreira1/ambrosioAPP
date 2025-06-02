import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { AuthService, User } from '../services/auth.service';
import { FoodService, Food } from '../services/food.service';

register();

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {
  slides: Array<{ img: string; title: string; subtitle: string; bgColor: string }> = [];

  private placeholders = [
    {
      img: 'assets/macas.jpg',
      title: 'Fresh apples',
      subtitle: 'Expires in 7 days',
      bgColor: '#d9f3cf'
    },
    {
      img: 'assets/laranja.jpg',
      title: 'Sweet oranges',
      subtitle: 'Expires in 5 days',
      bgColor: '#d9f3cf'
    },
  ];

  constructor(
    private authService: AuthService,
    private foodService: FoodService
  ) {}

  async ionViewWillEnter() {
    const user: User | null = await this.authService.getCurrentUser();
    if (!user) {
      this.slides = this.placeholders;
      return;
    }

    this.foodService.getFoods(user.id).subscribe(
      (foods: Food[]) => {
        const today = new Date();

        const soonToExpire = foods
          .map(f => {
            const expDate = new Date(f.expirationDate);
            const diffMs = expDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            return { f, diffDays };
          })
          .filter(item => item.diffDays <= 7); // inclui expirados

        if (soonToExpire.length === 0) {
          this.slides = this.placeholders;
          return;
        }

        this.slides = soonToExpire.map(item => {
          const f = item.f;
          const diffDays = item.diffDays;

          let subtitle: string;
          if (diffDays < 0) {
            subtitle = `Expired for ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
          } else if (diffDays === 0) {
            subtitle = 'Expire today';
          } else if (diffDays === 1) {
            subtitle = '1 day until expire';
          } else {
            subtitle = `${diffDays} days until expiration`;
          }

          let bgColor: string;
          if (diffDays <= 1) {
            bgColor = '#FF9595'; // vermelho
          } else if (diffDays >= 2 && diffDays <= 3) {
            bgColor = '#FFEB99'; // amarelo
          } else {
            bgColor = '#d9f3cf'; // verde
          }

          return {
            img: f.image?.url || 'assets/placeholder.png',
            title: f.name,
            subtitle,
            bgColor
          };
        });
      },
      error => {
        console.error('Error fetching foods for slides:', error);
        this.slides = this.placeholders;
      }
    );
  }
}
