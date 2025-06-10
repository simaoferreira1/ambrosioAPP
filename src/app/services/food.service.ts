import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Food {
  id: number;
  name: string;
  quantity: number;
  buyDate: string; 
  expirationDate: string; 
  barcode?: string;
  userId: number;
  image?: { id: number; name: string; url: string };
}

@Injectable({
  providedIn: 'root'
})
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

  /**
   * POST /api/v1/foods  → cria no servidor E retorna o Food criado
   * Nós continuamos fazendo a chamada HTTP normal, mas
   * ao mesmo tempo adicionamos o food à storage local imediatamente,
   * para que apareça na tela sem esperar a resposta do backend.
   */
  addFood(foodData: {
    name: string;
    quantity: number;
    buyDate: string;
    expirationDate: string;
    userId: number;
  }): Observable<Food> {
    const url = `${this.apiBase}/foods`;
    console.log('🔧 POST para:', url, 'payload:', foodData);

    // 1) Escreve na storage local antes mesmo de chamar o backend:
    this.addLocalFoodImmediate(foodData.userId, {
      // Criamos um “mock” de Food local. O ID será atualizado quando o backend responder.
      id: Date.now(),       // temporário; o backend vai gerar o real
      name: foodData.name,
      quantity: foodData.quantity,
      buyDate: foodData.buyDate,
      expirationDate: foodData.expirationDate,
      userId: foodData.userId,
      // sem image por enquanto (o backend preencherá)
    });

    // 2) Chamamos o backend e, quando ele retornar, sobrescrevemos a entrada local:
    return this.http.post<Food>(url, foodData).pipe(
      map(async (created: Food) => {
        // Atualiza a storage local substituindo o item temporário pelo criado real
        await this.replaceLocalFood(created.userId, created);
        return created;
      }) as any
    );
  }

  /**
   * GET /api/v1/foods?userId=<userId>
   */
  getFoods(userId: number): Observable<Food[]> {
    const url = `${this.apiBase}/foods?userId=${userId}`;
    console.log('🔧 GET de:', url);
    return this.http.get<Food[]>(url);
  }

  /**
   * Recupera apenas as “local foods” (sem chamar o backend).
   */
  async getLocalFoods(userId: number): Promise<Food[]> {
    if (!this.storageReady) {
      await this.storage.create();
      this.storageReady = true;
    }
    const key = `localFoods_user_${userId}`;
    const existing: Food[] = (await this.storage.get(key)) || [];
    return existing;
  }

  /**
   * Adiciona imediatamente à storage local sem esperar o backend:
   */
  private async addLocalFoodImmediate(userId: number, food: Food) {
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
   * Quando o backend responder com o registro “real” (com ID correto e image),
   * substituímos o item temporário local (o que tiver mesmo nome+dataCompra)
   * pelo objeto Food de volta do backend.
   */
  private async replaceLocalFood(userId: number, realFood: Food) {
    if (!this.storageReady) {
      await this.storage.create();
      this.storageReady = true;
    }
    const key = `localFoods_user_${userId}`;
    const existing: Food[] = (await this.storage.get(key)) || [];
    // Filtramos tudo que tenha o mesmo nome + buyDate + expirationDate + quantidade
    const filtered = existing.filter(item =>
      !(
        item.name === realFood.name &&
        item.buyDate === realFood.buyDate &&
        item.expirationDate === realFood.expirationDate &&
        item.quantity === realFood.quantity
      )
    );
    filtered.push(realFood);
    await this.storage.set(key, filtered);
  }
  /**
   * DELETE /api/v1/foods/:id
   * Remove o registro do servidor e também o remove de localStorage.
   */
  deleteFood(foodId: number): Observable<void> {
    const url = `${this.apiBase}/foods/${foodId}`;
    console.log('🔧 DELETE para:', url);

    return new Observable<void>(observer => {
      this.http.delete<void>(url).subscribe({
        next: async () => {
          // Remova também da storage local:
          await this.removeFromLocal(foodId);
          observer.next();
          observer.complete();
        },
        error: err => {
          observer.error(err);
        }
      });
    });
  }

  /**
   * Remove o Food com aquele ID de local storage (caso exista).
   */
  private async removeFromLocal(foodId: number) {
    if (!this.storageReady) {
      await this.storage.create();
      this.storageReady = true;
    }
    // Como não sabemos o userId aqui, vamos iterar por todas as keys que comecem com "localFoods_user_"
    const keys = await this.storage.keys();
    for (const key of keys) {
      if (key.startsWith('localFoods_user_')) {
        const list: Food[] = (await this.storage.get(key)) || [];
        const filtered = list.filter(f => f.id !== foodId);
        await this.storage.set(key, filtered);
      }
    }
  }
}
