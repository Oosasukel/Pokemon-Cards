export enum SuperType {
  ENERGY = 'Energy',
  POKÉMON = 'Pokémon',
  TRAINER = 'Trainer',
}

export interface Card {
  id: string;
  name: string;
  imageUrl: string;
  types?: string[];
  supertype: SuperType;
}

export interface ApiResponse {
  data: Array<{
    id: string;
    name: string;
    types?: string[];
    images: {
      small: string;
    };
    supertype: SuperType;
  }>;
  pageSize: number;
  page: number;
  count: number;
  totalCount: number;
}
