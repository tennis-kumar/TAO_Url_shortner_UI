// services/urlService.ts
import { Url, ApiResponse, UpdateUrlData } from './types';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

export class UrlService {
  private static getHeaders(token: string | null) {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  static async fetchUrls(token: string | null): Promise<Url[]> {
    const response = await fetch(`${API_BASE_URL}/user/urls`, {
      headers: this.getHeaders(token),
    });
    const data: ApiResponse = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch URLs');
    return data.urls || [];
  }

  static async createShortUrl(
    token: string | null,
    urlData: { longUrl: string; customAlias?: string; topic?: string }
  ): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/shorten`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(urlData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create short URL');
    return data.shortUrl;
  }

  static async updateUrl(
    token: string | null,
    shortUrl: string,
    updates: UpdateUrlData
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/shorten/${shortUrl}`, {
      method: 'PATCH',
      headers: this.getHeaders(token),
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update URL');
  }

  static async deleteUrl(token: string | null, shortUrl: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/shorten/${shortUrl}`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to delete URL');
  }
}