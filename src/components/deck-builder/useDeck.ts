import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Card, Deck, DeckCard, DeckRules } from './types';

const STORAGE_KEY = 'tcglat-decks';

export function useDeck(rules: DeckRules) {
  const [decks, setDecks] = useState<Deck[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);

  const activeDeck = useMemo(() => {
    return decks.find((d) => d.id === activeDeckId) || null;
  }, [decks, activeDeckId]);

  const saveDecks = useCallback((newDecks: Deck[]) => {
    setDecks(newDecks);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newDecks));
    }
  }, []);

  const createDeck = useCallback(
    (name: string, game: string, format: string) => {
      const deck: Deck = {
        id: crypto.randomUUID(),
        name,
        game,
        format,
        cards: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const newDecks = [...decks, deck];
      saveDecks(newDecks);
      setActiveDeckId(deck.id);
      return deck.id;
    },
    [decks, saveDecks]
  );

  const deleteDeck = useCallback(
    (id: string) => {
      const newDecks = decks.filter((d) => d.id !== id);
      saveDecks(newDecks);
      if (activeDeckId === id) {
        setActiveDeckId(newDecks.length > 0 ? newDecks[0].id : null);
      }
    },
    [decks, saveDecks, activeDeckId]
  );

  const renameDeck = useCallback(
    (id: string, name: string) => {
      const newDecks = decks.map((d) => (d.id === id ? { ...d, name, updatedAt: Date.now() } : d));
      saveDecks(newDecks);
    },
    [decks, saveDecks]
  );

  const updateDeckCards = useCallback(
    (id: string, cards: DeckCard[]) => {
      const newDecks = decks.map((d) => (d.id === id ? { ...d, cards, updatedAt: Date.now() } : d));
      saveDecks(newDecks);
    },
    [decks, saveDecks]
  );

  const addCard = useCallback(
    (card: Card) => {
      if (!activeDeck) return;
      const existing = activeDeck.cards.find((c) => c.id === card.id);
      const max = card.type === 'energy' && rules.unlimitedEnergy ? 99 : rules.maxCopies;

      if (existing) {
        if (existing.quantity >= max) return;
        const newCards = activeDeck.cards.map((c) =>
          c.id === card.id ? { ...c, quantity: c.quantity + 1 } : c
        );
        updateDeckCards(activeDeck.id, newCards);
      } else {
        updateDeckCards(activeDeck.id, [...activeDeck.cards, { ...card, quantity: 1 }]);
      }
    },
    [activeDeck, rules, updateDeckCards]
  );

  const removeCard = useCallback(
    (cardId: string) => {
      if (!activeDeck) return;
      const newCards = activeDeck.cards
        .map((c) => (c.id === cardId ? { ...c, quantity: c.quantity - 1 } : c))
        .filter((c) => c.quantity > 0);
      updateDeckCards(activeDeck.id, newCards);
    },
    [activeDeck, updateDeckCards]
  );

  const setCardQuantity = useCallback(
    (cardId: string, quantity: number) => {
      if (!activeDeck) return;
      if (quantity <= 0) {
        updateDeckCards(
          activeDeck.id,
          activeDeck.cards.filter((c) => c.id !== cardId)
        );
        return;
      }
      const card = activeDeck.cards.find((c) => c.id === cardId);
      const max = card?.type === 'energy' && rules.unlimitedEnergy ? 99 : rules.maxCopies;
      const clamped = Math.min(quantity, max);
      const newCards = activeDeck.cards.map((c) =>
        c.id === cardId ? { ...c, quantity: clamped } : c
      );
      updateDeckCards(activeDeck.id, newCards);
    },
    [activeDeck, rules, updateDeckCards]
  );

  const totalCards = useMemo(() => {
    return activeDeck?.cards.reduce((sum, c) => sum + c.quantity, 0) || 0;
  }, [activeDeck]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    activeDeck?.cards.forEach((c) => {
      const key = c.type;
      counts[key] = (counts[key] || 0) + c.quantity;
    });
    return counts;
  }, [activeDeck]);

  const energyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    activeDeck?.cards.forEach((c) => {
      if (c.energyTypes) {
        c.energyTypes.forEach((e) => {
          counts[e] = (counts[e] || 0) + c.quantity;
        });
      }
    });
    return counts;
  }, [activeDeck]);

  const isValid = useMemo(() => {
    return totalCards >= rules.minCards && totalCards <= rules.maxCards;
  }, [totalCards, rules]);

  const exportDeck = useCallback(() => {
    if (!activeDeck) return '';
    const lines = activeDeck.cards.map((c) => `${c.quantity} ${c.name}`);
    return lines.join('\n');
  }, [activeDeck]);

  return {
    decks,
    activeDeck,
    activeDeckId,
    setActiveDeckId,
    createDeck,
    deleteDeck,
    renameDeck,
    addCard,
    removeCard,
    setCardQuantity,
    totalCards,
    typeCounts,
    energyCounts,
    isValid,
    exportDeck,
  };
}
