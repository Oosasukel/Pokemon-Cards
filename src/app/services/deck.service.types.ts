import { Card } from './card.service.types';

export interface CreateDeckPayload {
  name: string;
  cards: Card[];
}
export interface UpdateDeckPayload extends CreateDeckPayload {}
