// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  name: string;
  email: string;
  // password is not stored in local storage
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiBase}/users`;  
  private storageReadyPromise: Promise<Storage>;

  constructor(
    private platform:   Platform,
    private httpNative: HTTP,
    private httpClient: HttpClient,
    private storage:    Storage
  ) {
    // Initialize Ionic Storage
    this.storageReadyPromise = this.storage.create();
  }

  private isHybrid(): boolean {
    return this.platform.is('hybrid');
  }

  /**
   * Save the logged‐in user object under "currentUser".
   */
  private async saveUser(user: User): Promise<void> {
    const storage = await this.storageReadyPromise;
    await storage.set('currentUser', user);
  }

  /**
   * Remove the stored user (logout).
   */
  private async clearUser(): Promise<void> {
    const storage = await this.storageReadyPromise;
    await storage.remove('currentUser');
  }

  /**
   * Retrieve the current user from storage, or null if none.
   */
  async getCurrentUser(): Promise<User | null> {
    const storage = await this.storageReadyPromise;
    return storage.get('currentUser');
  }

  /**
   * Register a new user. On success, save that user in storage.
   * Backend must respond with { id, name, email }, ignoring password.
   */
  async register(name: string, email: string, password: string): Promise<User> {
    let createdUser: User;

    if (this.isHybrid()) {
      // Native HTTP plugin
      const headers = {'Content-Type': 'application/json'};
      const response = await this.httpNative.post(
        this.baseUrl,
        { name, email, password },
        headers
      );
      createdUser = JSON.parse(response.data) as User;
    } else {
      // Browser
      createdUser = await firstValueFrom(
        this.httpClient.post<User>(this.baseUrl, { name, email, password })
      );
    }

    // Save in Ionic Storage
    await this.saveUser(createdUser);
    return createdUser;
  }

  /**
   * Login by fetching all users and matching email/password.
   * On success, save that user in storage.
   */
  async login(email: string, password: string): Promise<User> {
    let users: (User & { password?: string })[];

    if (this.isHybrid()) {
      // Native HTTP plugin
      const response = await this.httpNative.get(this.baseUrl, {}, {});
      users = JSON.parse(response.data) as (User & { password?: string })[];
    } else {
      users = await firstValueFrom(
        this.httpClient.get<(User & { password?: string })[]>(this.baseUrl)
      );
    }

    const found = users.find(u => u.email === email && u.password === password);
    if (!found) {
      throw new Error('Email ou senha inválidos');
    }

    // Save in Ionic Storage (omit password)
    const user: User = { id: found.id, name: found.name, email: found.email };
    await this.saveUser(user);
    return user;
  }

  /**
   * Logout: clear the stored user.
   */
  async logout(): Promise<void> {
    await this.clearUser();
  }
}
