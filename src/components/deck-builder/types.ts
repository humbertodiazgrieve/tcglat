export interface Card {
  id: string;
  name: string;
  type: 'pokemon' | 'trainer' | 'energy';
  subtype?: string;
  supertype?: string;
  hp?: number;
  energyTypes?: string[];
  rarity?: string;
  image?: string;
  expansion?: string;
  number?: string;
}

export interface DeckCard extends Card {
  quantity: number;
}

export interface Deck {
  id: string;
  name: string;
  game: string;
  format: string;
  cards: DeckCard[];
  createdAt: number;
  updatedAt: number;
}

export interface DeckRules {
  minCards: number;
  maxCards: number;
  maxCopies: number;
  unlimitedEnergy: boolean;
}

export const POKEMON_RULES: DeckRules = {
  minCards: 60,
  maxCards: 60,
  maxCopies: 4,
  unlimitedEnergy: true,
};

export const GAMES = [
  { id: 'pokemon', name: 'Pokémon TCG', rules: POKEMON_RULES },
  { id: 'yugioh', name: 'Yu-Gi-Oh!', rules: { minCards: 40, maxCards: 60, maxCopies: 3, unlimitedEnergy: false } },
  { id: 'magic', name: 'Magic: The Gathering', rules: { minCards: 60, maxCards: 60, maxCopies: 4, unlimitedEnergy: false } },
  { id: 'lorcana', name: 'Disney Lorcana', rules: { minCards: 60, maxCards: 60, maxCopies: 4, unlimitedEnergy: false } },
  { id: 'onepiece', name: 'One Piece Card Game', rules: { minCards: 50, maxCards: 50, maxCopies: 4, unlimitedEnergy: false } },
] as const;
