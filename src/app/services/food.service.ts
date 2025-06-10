
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Observable, from, firstValueFrom } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

export interface Food {
  id: number;
  name: string;
  quantity: number;
  buyDate: string;
  expirationDate: string;
  barcode?: string;
  userId: number;
  image?: { id: number; name: string; url: string };
  unit?: string;  // LOCAL-ONLY
}

@Injectable({ providedIn: 'root' })
export class FoodService {
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

  addFood(data: {
    name: string;
    quantity: number;
    buyDate: string;
    expirationDate: string;
    userId: number;
    unit?: string;
  }): Observable<Food> {
    const url = `${this.apiBase}/foods`;

    // Add local temp
    const temp: Food = {
      id: Date.now(),
      name: data.name,
      quantity: data.quantity,
      buyDate: data.buyDate,
      expirationDate: data.expirationDate,
      userId: data.userId,
      unit: data.unit ?? 'un'
    };
    this.addLocal(data.userId, temp);

    // Call backend and replace
    return this.http.post<Food>(url, data).pipe(
      switchMap(created =>
        from(this.replaceLocal(data.userId, created, data.unit)).pipe(
          switchMap(() => [created])
        )
      )
    );
  }

  async getLocalFoods(userId: number): Promise<Food[]> {
    if (!this.storageReady) {
      await this.storage.create();
      this.storageReady = true;
    }
    const key = `localFoods_user_${userId}`;
    let list: Food[] = (await this.storage.get(key)) || [];
    if (list.length === 0) {
      try {
        const serverFoods = await firstValueFrom(
          this.http.get<Food[]>(`${this.apiBase}/foods?userId=${userId}`)
        );
        if (serverFoods) {
          list = serverFoods.map(f => ({ ...f, unit: f.unit ?? 'un' }));
          await this.storage.set(key, list);
        }
      } catch (e) {
        console.warn('Server sync failed, no local data', e);
      }
    }
    return list;
  }

  deleteFood(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBase}/foods/${id}`).pipe(
      tap(async () => {
        await this.removeLocal(id);
      })
    );
  }

  private async addLocal(userId: number, food: Food) {
    if (!this.storageReady) {
      await this.storage.create();
      this.storageReady = true;
    }
    const key = `localFoods_user_${userId}`;
    const arr: Food[] = (await this.storage.get(key)) || [];
    arr.push(food);
    await this.storage.set(key, arr);
  }

  private async replaceLocal(
    userId: number,
    realFood: Food,
    unit?: string
  ) {
    if (!this.storageReady) {
      await this.storage.create();
      this.storageReady = true;
    }
    const key = `localFoods_user_${userId}`;
    const arr: Food[] = (await this.storage.get(key)) || [];

    // preserve unit from temp
    const prevUnit = arr.find(item =>
      item.name === realFood.name &&
      item.buyDate === realFood.buyDate &&
      item.expirationDate === realFood.expirationDate &&
      item.quantity === realFood.quantity
    )?.unit;

    // remove temp entries
    const filtered = arr.filter(item =>
      !(item.name === realFood.name &&
        item.buyDate === realFood.buyDate &&
        item.expirationDate === realFood.expirationDate &&
        item.quantity === realFood.quantity)
    );

    filtered.push({
      ...realFood,
      unit: prevUnit ?? unit ?? 'un'
    });

    await this.storage.set(key, filtered);
  }

  private async removeLocal(foodId: number) {
    if (!this.storageReady) {
      await this.storage.create();
      this.storageReady = true;
    }
    const keys = await this.storage.keys();
    for (const key of keys) {
      if (key.startsWith('localFoods_user_')) {
        const arr: Food[] = (await this.storage.get(key)) || [];
        const filtered = arr.filter(f => f.id !== foodId);
        await this.storage.set(key, filtered);
      }
    }
  }
}