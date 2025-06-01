// src/app/services/food.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Observable } from 'rxjs';

export interface Food {
  id: number;
  name: string;
  quantity: number;
  buyDate: string;        // ISO string returned by API
  expirationDate: string; // ISO string returned by API
  barcode?: string;
  userId: number;
  image?: {
    id: number;
    name: string;
    url: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  // ← Replace with your actual Vercel domain if different
  private apiBase = 'https://prisma-api-three.vercel.app/api/v1';

  private storageReady = false;

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) {
    this.storage.create().then(() => {
      this.storageReady = true;
    });
  }

  /**
   * POST /api/v1/foods
   */
  addFood(foodData: {
    name: string;
    quantity: number;
    buyDate: string;
    expirationDate: string;
    userId: number;
  }): Observable<Food> {
    const url = `${this.apiBase}/foods`;
    console.log('🔧 POST to:', url, 'payload:', foodData);
    return this.http.post<Food>(url, foodData);
  }

  /**
   * GET /api/v1/foods?userId=<userId>
   */
  getFoods(userId: number): Observable<Food[]> {
    const url = `${this.apiBase}/foods?userId=${userId}`;
    console.log('🔧 GET from:', url);
    return this.http.get<Food[]>(url);
  }

  /**
   * DELETE /api/v1/foods/:id
   */
  deleteFood(id: number): Observable<any> {
    const url = `${this.apiBase}/foods/${id}`;
    console.log('🔧 DELETE to:', url);
    return this.http.delete(url);
  }

  /**
   * Cache the new Food locally under "localFoods_user_<userId>".
   */
  async addLocalFood(userId: number, food: Food): Promise<void> {
    if (!this.storageReady) {
      await this.storage.create();
      this.storageReady = true;
    }
    const key = `localFoods_user_${userId}`;
    const existing: Food[] = (await this.storage.get(key)) || [];
    existing.push(food);
    await this.storage.set(key, existing);
  }

  /**
   * Remove a food from local cache under "localFoods_user_<userId>" by its id.
   */
  async removeLocalFood(userId: number, id: number): Promise<void> {
    if (!this.storageReady) {
      await this.storage.create();
      this.storageReady = true;
    }
    const key = `localFoods_user_${userId}`;
    const existing: Food[] = (await this.storage.get(key)) || [];
    const updated = existing.filter(f => f.id !== id);
    await this.storage.set(key, updated);
  }
}
