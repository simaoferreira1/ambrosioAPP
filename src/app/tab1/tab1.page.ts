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

  // Placeholders with fixed background (#C5E1A5 for 7 days, #FFEB99 for 5 days)
  private placeholders = [
    {
      img: 'assets/macas.jpg',
      title: 'Fresh apples',
      subtitle: 'Expires in 7 days',
      bgColor: '#C5E1A5'
    },
    {
      img: 'assets/laranja.jpg',
      title: 'Sweet oranges',
      subtitle: 'Expires in 5 days',
      bgColor: '#C5E1A5'
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
          .filter(item => item.diffDays <= 7); // include expired (<0) and up to 7 days

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

          // Determine background color:
          let bgColor: string;
          if (diffDays < 0) {
            // Expired
            bgColor = '#FF9595';
          } else if (diffDays <= 2) {
            // 0,1,2 days left → yellow
            bgColor = '#FFEB99';
          } else {
            // 3–7 days left → green
            bgColor = '#C5E1A5';
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
