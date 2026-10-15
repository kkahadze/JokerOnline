// The original project's simplified Joker variant. Card IDs are stable values,
// independent of object identity or the position of a card in the UI.
export const SUITS = ['Diamonds', 'Clubs', 'Hearts', 'Spades'];
export const DEALS = Object.freeze([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9, 9,
  8, 7, 6, 5, 4, 3, 2, 1, 9, 9, 9, 9,
]);

export function createDeck() {
  const cards = [];
  for (let suit = 0; suit < 4; suit++) {
    for (let value = 7; value <= 14; value++) {
      cards.push({ id: `${suit}-${value}`, suit, value });
    }
  }
  cards.push({ id: '0-6', suit: 0, value: 6 }, { id: '2-6', suit: 2, value: 6 });
  cards.push({ id: 'joker-1', suit: null, value: 15 }, { id: 'joker-2', suit: null, value: 15 });
  return cards;
}

export function shuffle(cards, random = Math.random) {
  const result = [...cards];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function legalCards(hand, trick, trump) {
  if (trick.length === 0) return [...hand];
  const leadSuit = trick[0].card.suit;
  const following = hand.filter(card => card.value !== 15 && card.suit === leadSuit);
  const trumps = hand.filter(card => card.value !== 15 && card.suit === trump);
  const required = following.length ? following : trumps;
  return required.length ? [...required, ...hand.filter(card => card.value === 15)] : [...hand];
}

function cardWeight(card, leadSuit, trump) {
  if (card.value === 15) return 1000;
  return card.value + (card.suit === trump ? 200 : card.suit === leadSuit ? 100 : 0);
}

// Entries stay in play order and carry their player IDs. The later Joker wins.
export function trickWinner(trick, trump) {
  if (!trick.length) throw new Error('Cannot score an empty trick.');
  const leadSuit = trick[0].card.suit;
  return trick.reduce((best, entry) =>
    cardWeight(entry.card, leadSuit, trump) >= cardWeight(best.card, leadSuit, trump)
      ? entry : best).player;
}

export function scoreHand(bid, taken, dealt) {
  if (taken === 0 && bid > 0) return -200;
  if (taken !== bid) return taken * 10;
  return taken === dealt ? taken * 100 : taken * 50 + 50;
}

export class Game {
  constructor({ random = Math.random, dealer = Math.floor(random() * 4) } = {}) {
    if (!Number.isInteger(dealer) || dealer < 0 || dealer > 3) throw new Error('Invalid dealer.');
    this.random = random;
    this.dealer = dealer;
    this.players = ['You', 'Nino', 'Giorgi', 'Tamar'].map(name => ({ name, hand: [], bid: null, taken: 0, score: 0 }));
    this.dealIndex = -1;
    this.phase = 'ready';
    this.trick = [];
    this.history = [];
  }

  startDeal() {
    if (!['ready', 'deal-end'].includes(this.phase)) throw new Error('Finish this deal first.');
    this.dealIndex++;
    this.dealer = (this.dealer + 1) % 4;
    this.dealt = DEALS[this.dealIndex];
    const deck = shuffle(createDeck(), this.random);
    for (const player of this.players) {
      player.hand = deck.splice(0, this.dealt);
      player.bid = null;
      player.taken = 0;
    }
    this.trumpCard = deck[0] ?? null;
    this.trump = this.trumpCard && this.trumpCard.value !== 15 ? this.trumpCard.suit : null;
    this.turn = (this.dealer + 1) % 4;
    this.trick = [];
    this.completedTricks = 0;
    this.lastWinner = null;
    this.phase = 'bidding';
  }

  legalBids(player) {
    if (this.phase !== 'bidding' || this.turn !== player) return [];
    const previous = this.players.filter(p => p.bid !== null);
    const forbidden = previous.length === 3 ? this.dealt - previous.reduce((sum, p) => sum + p.bid, 0) : -1;
    return Array.from({ length: this.dealt + 1 }, (_, i) => i).filter(bid => bid !== forbidden);
  }

  bid(player, value) {
    if (!this.legalBids(player).includes(value)) throw new Error('That bid is not allowed.');
    this.players[player].bid = value;
    if (this.players.every(p => p.bid !== null)) {
      this.phase = 'playing';
      this.turn = (this.dealer + 1) % 4;
    } else {
      this.turn = (this.turn + 1) % 4;
    }
  }

  legalCards(player) {
    if (this.phase !== 'playing' || this.turn !== player) return [];
    return legalCards(this.players[player].hand, this.trick, this.trump);
  }

  play(player, cardId) {
    const card = this.legalCards(player).find(c => c.id === cardId);
    if (!card) throw new Error('That card cannot be played now.');
    this.players[player].hand = this.players[player].hand.filter(c => c.id !== cardId);
    this.trick.push({ player, card });
    if (this.trick.length < 4) {
      this.turn = (this.turn + 1) % 4;
      return;
    }
    this.lastWinner = trickWinner(this.trick, this.trump);
    this.players[this.lastWinner].taken++;
    this.completedTricks++;
    this.phase = 'trick-end';
  }

  continue() {
    if (this.phase === 'ready' || this.phase === 'deal-end') {
      this.startDeal();
      return;
    }
    if (this.phase !== 'trick-end') throw new Error('There is nothing to continue yet.');
    if (this.completedTricks === this.dealt) {
      const changes = this.players.map(player => {
        const points = scoreHand(player.bid, player.taken, this.dealt);
        player.score += points;
        return { bid: player.bid, taken: player.taken, points, score: player.score };
      });
      this.history.push({ dealt: this.dealt, players: changes });
      this.phase = this.dealIndex === DEALS.length - 1 ? 'finished' : 'deal-end';
    } else {
      this.trick = [];
      this.turn = this.lastWinner;
      this.phase = 'playing';
    }
  }
}
