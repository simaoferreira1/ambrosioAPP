// src/app/pages/tab1/tab1.page.ts

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

    try {
      // Use local storage only
      const foods: Food[] = await this.foodService.getLocalFoods(user.id);
      const today = new Date();

      const soonToExpire = foods
        .map(f => {
          const expDate = new Date(f.expirationDate);
          const diffMs = expDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
          return { f, diffDays };
        })
        .filter(item => item.diffDays <= 7);

      if (soonToExpire.length === 0) {
        this.slides = this.placeholders;
        return;
      }

      this.slides = soonToExpire.map(item => {
        const { f, diffDays } = item;

        let subtitle: string;
        if (diffDays < 0) {
          subtitle = `Expired for ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
        } else if (diffDays === 0) {
          subtitle = 'Expires today';
        } else if (diffDays === 1) {
          subtitle = '1 day until expiration';
        } else {
          subtitle = `${diffDays} days until expiration`;
        }

        let bgColor: string;
        if (diffDays <= 1) {
          bgColor = '#FF9595';
        } else if (diffDays <= 3) {
          bgColor = '#FFEB99';
        } else {
          bgColor = '#d9f3cf';
        }

        return {
          img: f.image?.url || 'assets/placeholder.png',
          title: f.name,
          subtitle,
          bgColor
        };
      });
    } catch (err: any) {
      console.error('Error loading local foods for slides:', err);
      this.slides = this.placeholders;
    }
  }
}
