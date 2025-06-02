// src/app/services/translate.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private endpoint = 'https://libretranslate.com/translate';

  constructor(private http: HttpClient) {}

  /**
   * Traduz texto do inglês para o português.
   */
  async translateText(text: string): Promise<string> {
    if (!text || !text.trim()) {
      return '';
    }
    const body = {
      q: text,
      source: 'en',
      target: 'pt',
      format: 'text'
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    try {
      const response = await firstValueFrom(
        this.http.post<{ translatedText: string }>(this.endpoint, body, { headers })
      );
      return response.translatedText;
    } catch (err) {
      console.error('Erro de tradução EN→PT:', err);
      return text;
    }
  }

  /**
   * Traduz texto do português para o inglês.
   */
  async translateToEnglish(text: string): Promise<string> {
    if (!text || !text.trim()) {
      return '';
    }
    const body = {
      q: text,
      source: 'pt',
      target: 'en',
      format: 'text'
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    try {
      const response = await firstValueFrom(
        this.http.post<{ translatedText: string }>(this.endpoint, body, { headers })
      );
      return response.translatedText;
    } catch (err) {
      console.error('Erro de tradução PT→EN:', err);
      return text;
    }
  }
}
