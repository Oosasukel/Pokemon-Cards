import { Injectable } from '@angular/core';
import { Card, SuperType } from './card.service.types';
import { CreateDeckPayload, UpdateDeckPayload } from './deck.service.types';

@Injectable({
  providedIn: 'root',
})
export class DeckService {
  private id = 0;
  private decks: Deck[] = [];

  getDecks() {
    return this.decks.map((deck) => this.copy(deck));
  }

  getDeck(id: number) {
    const deck = this.decks.find((item) => item.id === id);

    if (!deck) return undefined;

    return this.copy(deck);
  }

  createDeck({ cards, name }: CreateDeckPayload) {
    const newDeck = new Deck(++this.id, name, cards);

    if (!newDeck.name) {
      newDeck.name = `Baralho ${this.id}`;
    }

    this.decks.push(newDeck);
  }

  updateDeck(id: number, { cards, name }: UpdateDeckPayload) {
    const deck = this.decks.find((item) => item.id === id);
    if (!deck) return;

    deck.cards = cards;
    deck.name = name;
    if (!deck.name) {
      deck.name = `Baralho ${deck.id}`;
    }
  }

  deleteDeck(id: number) {
    this.decks = this.decks.filter((item) => item.id !== id);
  }

  getUniqueTypes(deck: Deck) {
    const typesSet = new Set<string>();
    deck.cards.forEach((card) => {
      card.types?.forEach((type) => {
        typesSet.add(type);
      });
    });

    return Array.from(typesSet);
  }

  private copy(deck: Deck) {
    return new Deck(deck.id, deck.name, deck.cards);
  }
}

export class Deck {
  constructor(
    public id: number | undefined,
    public name: string,
    public cards: Card[]
  ) {}

  get uniqueTypes() {
    const typesSet = new Set<string>();
    this.cards.forEach((card) => {
      card.types?.forEach((type) => {
        typesSet.add(type);
      });
    });

    return Array.from(typesSet);
  }

  get pokemonCount() {
    return this.cards.filter((card) => card.supertype === SuperType.POKÉMON)
      .length;
  }

  get trainerCount() {
    return this.cards.filter((card) => card.supertype === SuperType.TRAINER)
      .length;
  }

  get energyCount() {
    return this.cards.filter((card) => card.supertype === SuperType.ENERGY)
      .length;
  }
}
