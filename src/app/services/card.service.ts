import { Injectable } from '@angular/core';
import { Pagination } from '../types/pagination.types';
import { ApiResponse, Card } from './card.service.types';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private readonly baseUrl = 'https://api.pokemontcg.io';

  async searchCards({
    page,
    size,
    name,
  }: {
    page: number;
    size: number;
    name: string;
  }): Promise<Pagination<Card>> {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      pageSize: size.toString(),
      q: `name:*${name}*`,
    }).toString();

    const url = `${this.baseUrl}/v2/cards?${searchParams}`;

    const response: ApiResponse = await fetch(url).then((response) =>
      response.json()
    );

    return {
      data: response.data.map((card) => ({
        id: card.id,
        name: card.name,
        types: card.types,
        imageUrl: card.images.small,
        supertype: card.supertype,
      })),
      count: response.count,
      page: response.page,
      pageSize: response.pageSize,
      totalCount: response.totalCount,
      totalPages: Math.ceil(response.totalCount / response.pageSize),
    };
  }
}
