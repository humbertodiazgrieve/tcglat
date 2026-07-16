import { useState, useMemo } from 'react';
import type { Card } from './types';
import { GAMES } from './types';
import { getMockCards } from './mockData';
import { useDeck } from './useDeck';

type Lang = 'es' | 'en';

interface Props {
  lang?: Lang;
}

const TRANSLATIONS = {
  es: {
    title: 'Deck Builder',
    subtitle: 'Construye y guarda mazos para juegos de cartas',
    selectGame: 'Juego',
    selectDeck: 'Seleccionar mazo...',
    deckNamePlaceholder: 'Nombre del mazo',
    newDeck: 'Nuevo',
    createFirstDeck: 'Crear mi primer mazo',
    noDeckSelected: 'No tienes un mazo seleccionado. Crea uno nuevo para empezar.',
    searchPlaceholder: 'Buscar cartas...',
    filterAll: 'Todas',
    filterPokemon: 'Pokémon',
    filterTrainer: 'Entrenadores',
    filterEnergy: 'Energías',
    inDeck: 'En mazo',
    add: 'Agregar',
    yourDeck: 'Tu mazo',
    delete: 'Eliminar',
    cards: 'Cartas',
    overMax: 'Excedes el máximo de cartas',
    emptyDeck: 'Agrega cartas desde el buscador',
    export: 'Exportar mazo',
    stats: 'Estadísticas',
    pokemon: 'Pokémon',
    trainer: 'Entrenadores',
    energy: 'Energías',
    energyByType: 'Energías por tipo',
    exportTitle: 'Exportar mazo',
    close: 'Cerrar',
    copyClipboard: 'Copiar al portapapeles',
  },
  en: {
    title: 'Deck Builder',
    subtitle: 'Build and save decks for trading card games',
    selectGame: 'Game',
    selectDeck: 'Select deck...',
    deckNamePlaceholder: 'Deck name',
    newDeck: 'New',
    createFirstDeck: 'Create my first deck',
    noDeckSelected: 'You have no selected deck. Create a new one to get started.',
    searchPlaceholder: 'Search cards...',
    filterAll: 'All',
    filterPokemon: 'Pokémon',
    filterTrainer: 'Trainers',
    filterEnergy: 'Energy',
    inDeck: 'In deck',
    add: 'Add',
    yourDeck: 'Your deck',
    delete: 'Delete',
    cards: 'Cards',
    overMax: 'You exceed the maximum number of cards',
    emptyDeck: 'Add cards from the search panel',
    export: 'Export deck',
    stats: 'Statistics',
    pokemon: 'Pokémon',
    trainer: 'Trainers',
    energy: 'Energy',
    energyByType: 'Energy by type',
    exportTitle: 'Export deck',
    close: 'Close',
    copyClipboard: 'Copy to clipboard',
  },
};

const TYPE_LABELS: Record<Lang, Record<string, string>> = {
  es: {
    pokemon: 'Pokémon',
    trainer: 'Entrenador',
    energy: 'Energía',
  },
  en: {
    pokemon: 'Pokémon',
    trainer: 'Trainer',
    energy: 'Energy',
  },
};

const ENERGY_LABELS: Record<Lang, Record<string, string>> = {
  es: {
    lightning: 'Rayo',
    fire: 'Fuego',
    water: 'Agua',
    grass: 'Planta',
    psychic: 'Psíquico',
    fighting: 'Lucha',
    darkness: 'Oscuridad',
    metal: 'Metal',
    fairy: 'Hada',
    dragon: 'Dragón',
    colorless: 'Incoloro',
  },
  en: {
    lightning: 'Lightning',
    fire: 'Fire',
    water: 'Water',
    grass: 'Grass',
    psychic: 'Psychic',
    fighting: 'Fighting',
    darkness: 'Darkness',
    metal: 'Metal',
    fairy: 'Fairy',
    dragon: 'Dragon',
    colorless: 'Colorless',
  },
};

export default function DeckBuilder({ lang = 'es' }: Props) {
  const t = TRANSLATIONS[lang];
  const labels = TYPE_LABELS[lang];
  const energyLabels = ENERGY_LABELS[lang];

  const [selectedGame, setSelectedGame] = useState('pokemon');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'pokemon' | 'trainer' | 'energy' | 'all'>('all');
  const [newDeckName, setNewDeckName] = useState('');
  const [showExport, setShowExport] = useState(false);

  const rules = useMemo(() => GAMES.find((g) => g.id === selectedGame)?.rules || GAMES[0].rules, [selectedGame]);
  const {
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
  } = useDeck(rules);

  const allCards = useMemo(() => getMockCards(selectedGame), [selectedGame]);

  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      const matchesSearch = card.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === 'all' || card.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [allCards, search, filterType]);

  const handleCreateDeck = () => {
    const defaultName = lang === 'es' ? `Mazo ${selectedGame} ${decks.length + 1}` : `${selectedGame} deck ${decks.length + 1}`;
    const name = newDeckName.trim() || defaultName;
    createDeck(name, selectedGame, 'standard');
    setNewDeckName('');
  };

  const deckName = activeDeck?.name || '';

  const copyExport = () => {
    const text = exportDeck();
    if (text) navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-sm text-gray-600">{t.subtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                {GAMES.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
              <select
                value={activeDeckId || ''}
                onChange={(e) => setActiveDeckId(e.target.value || null)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue min-w-[180px]"
              >
                <option value="">{t.selectDeck}</option>
                {decks.filter((d) => d.game === selectedGame).map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newDeckName}
                  onChange={(e) => setNewDeckName(e.target.value)}
                  placeholder={t.deckNamePlaceholder}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
                <button
                  onClick={handleCreateDeck}
                  className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  {t.newDeck}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {!activeDeck ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-600 mb-4">{t.noDeckSelected}</p>
            <button
              onClick={handleCreateDeck}
              className="px-6 py-3 bg-brand-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {t.createFirstDeck}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  >
                    <option value="all">{t.filterAll}</option>
                    <option value="pokemon">{t.filterPokemon}</option>
                    <option value="trainer">{t.filterTrainer}</option>
                    <option value="energy">{t.filterEnergy}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredCards.map((card) => {
                  const inDeck = activeDeck.cards.find((c) => c.id === card.id);
                  const currentQty = inDeck?.quantity || 0;
                  const max = card.type === 'energy' && rules.unlimitedEnergy ? 99 : rules.maxCopies;
                  const canAdd = totalCards < rules.maxCards && currentQty < max;

                  return (
                    <div
                      key={card.id}
                      className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col"
                    >
                      <div className="bg-gray-100 rounded-lg aspect-[2.5/3.5] mb-3 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">{card.name}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{card.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {labels[card.type]}
                          {card.subtype && ` · ${card.subtype}`}
                          {card.hp && ` · ${card.hp} HP`}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{card.expansion}</p>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xs font-medium text-gray-600">
                          {t.inDeck}: {currentQty}
                        </span>
                        <button
                          onClick={() => addCard(card)}
                          disabled={!canAdd}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            canAdd
                              ? 'bg-brand-blue text-white hover:bg-blue-700'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {t.add}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-gray-900">{t.yourDeck}</h2>
                  <button
                    onClick={() => activeDeckId && deleteDeck(activeDeckId)}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    {t.delete}
                  </button>
                </div>

                <input
                  type="text"
                  value={deckName}
                  onChange={(e) => activeDeckId && renameDeck(activeDeckId, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium mb-4 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">{t.cards}</span>
                    <span className={`font-semibold ${isValid ? 'text-green-600' : 'text-gray-900'}`}>
                      {totalCards} / {rules.maxCards}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-blue transition-all"
                      style={{ width: `${Math.min((totalCards / rules.maxCards) * 100, 100)}%` }}
                    />
                  </div>
                  {totalCards > rules.maxCards && (
                    <p className="text-xs text-red-600 mt-1">{t.overMax}</p>
                  )}
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {activeDeck.cards.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      {t.emptyDeck}
                    </p>
                  )}
                  {activeDeck.cards.map((card) => (
                    <div
                      key={card.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{card.name}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {labels[card.type]}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <button
                          onClick={() => removeCard(card.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={0}
                          value={card.quantity}
                          onChange={(e) => setCardQuantity(card.id, parseInt(e.target.value) || 0)}
                          className="w-12 px-1 py-1 text-center text-sm border border-gray-300 rounded-lg"
                        />
                        <button
                          onClick={() => addCard(card)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                    </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowExport(true)}
                  disabled={activeDeck.cards.length === 0}
                  className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t.export}
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-bold text-gray-900 mb-3">{t.stats}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t.pokemon}</span>
                    <span className="font-medium">{typeCounts.pokemon || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t.trainer}</span>
                    <span className="font-medium">{typeCounts.trainer || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t.energy}</span>
                    <span className="font-medium">{typeCounts.energy || 0}</span>
                  </div>
                </div>

                {Object.keys(energyCounts).length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mb-2">{t.energyByType}</p>
                    <div className="space-y-1">
                      {Object.entries(energyCounts).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{energyLabels[type] || type}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {showExport && activeDeck && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowExport(false)}
        >
          <div className="bg-white rounded-xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t.exportTitle}</h3>
            <textarea
              readOnly
              value={exportDeck()}
              className="w-full h-48 p-3 border border-gray-300 rounded-lg text-sm font-mono bg-gray-50 resize-none mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowExport(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
              >
                {t.close}
              </button>
              <button
                onClick={copyExport}
                className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                {t.copyClipboard}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
