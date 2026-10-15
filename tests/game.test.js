import test from 'node:test';
import assert from 'node:assert/strict';
import { createDeck, shuffle, legalCards, trickWinner, scoreHand, Game, DEALS } from '../src/game.js';
import { chooseBid, chooseCard, advanceBots } from '../src/bots.js';

const card = (suit, value) => ({ id: `${suit}-${value}`, suit, value });
const entry = (player, suit, value) => ({ player, card: card(suit, value) });
function seeded(seed) {
  return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2 ** 32; };
}

test('the deck has exactly the 36 distinct cards used by Joker', () => {
  const deck = createDeck();
  assert.equal(deck.length, 36);
  assert.equal(new Set(deck.map(c => c.id)).size, 36);
  assert.deepEqual(deck.filter(c => c.value === 6).map(c => c.suit), [0, 2]);
  assert.equal(deck.filter(c => c.value === 15).length, 2);
});

test('shuffle preserves the input and every permutation of three cards is reachable', () => {
  const source = [1, 2, 3];
  const outcomes = new Set();
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      const values = [(i + 0.5) / 3, (j + 0.5) / 2];
      outcomes.add(shuffle(source, () => values.shift()).join(','));
    }
  }
  assert.equal(outcomes.size, 6);
  assert.deepEqual(source, [1, 2, 3]);
});

test('follow suit before trump, with Jokers always available', () => {
  const hearts = card(2, 7), spades = card(3, 14), diamonds = card(0, 8), joker = card(null, 15);
  const trick = [entry(2, 2, 14)];
  assert.deepEqual(legalCards([hearts, spades, diamonds, joker], trick, 3), [hearts, joker]);
  assert.deepEqual(legalCards([spades, diamonds, joker], trick, 3), [spades, joker]);
  assert.deepEqual(legalCards([diamonds, joker], trick, 3), [diamonds, joker]);
  assert.deepEqual(legalCards([spades, diamonds], trick, null), [spades, diamonds]);
  assert.deepEqual(legalCards([hearts, spades], [], 3), [hearts, spades]);
});

test('Joker leads require trump when available in this house variant', () => {
  const trump = card(0, 7), other = card(1, 14);
  assert.deepEqual(legalCards([other, trump], [entry(3, null, 15)], 0), [trump]);
  assert.deepEqual(legalCards([other, trump], [entry(3, null, 15)], null), [other, trump]);
});

test('trump beats led suit, and off-suit aces cannot win without trump', () => {
  const trick = [entry(2, 1, 10), entry(3, 2, 14), entry(0, 1, 12), entry(1, 3, 7)];
  assert.equal(trickWinner(trick, 3), 1);
  assert.equal(trickWinner(trick, null), 0);
  assert.throws(() => trickWinner([], null));
});

test('the last Joker in actual play order wins for every starting seat', () => {
  for (let leader = 0; leader < 4; leader++) {
    const trick = [entry(leader, null, 15), entry((leader + 1) % 4, 0, 14), entry((leader + 2) % 4, null, 15), entry((leader + 3) % 4, 3, 14)];
    assert.equal(trickWinner(trick, 3), (leader + 2) % 4);
  }
});

test('all scoring outcomes preserve the original rules', () => {
  for (const [bid, taken, dealt, expected] of [[0, 0, 5, 50], [2, 2, 5, 150], [5, 5, 5, 500], [1, 0, 5, -200], [3, 2, 5, 20], [0, 3, 5, 30], [9, 9, 9, 900]]) {
    assert.equal(scoreHand(bid, taken, dealt), expected);
  }
});

test('last bidder restriction includes human calls in every seating position', () => {
  for (let dealer = 0; dealer < 4; dealer++) {
    const game = new Game({ dealer: (dealer + 3) % 4 });
    game.startDeal();
    for (let i = 0; i < 3; i++) game.bid(game.turn, 0);
    assert.equal(game.turn, dealer);
    assert.deepEqual(game.legalBids(dealer), [0]);
    assert.throws(() => game.bid(dealer, 1));
    game.bid(dealer, 0);
    assert.equal(game.phase, 'playing');
  }
});

test('invalid actions and stale card IDs cannot mutate a game', () => {
  const game = new Game({ dealer: 2, random: seeded(1) });
  assert.throws(() => game.play(0, '0-7'));
  game.startDeal();
  const before = JSON.stringify(game);
  for (const value of [-1, 2, 0.5, NaN, '1']) assert.throws(() => game.bid(game.turn, value));
  assert.throws(() => game.bid((game.turn + 1) % 4, 0));
  assert.throws(() => game.play(game.turn, game.players[game.turn].hand[0].id));
  assert.throws(() => game.startDeal());
  assert.equal(JSON.stringify(game), before);
  while (game.phase === 'bidding') game.bid(game.turn, game.legalBids(game.turn)[0]);
  const player = game.turn, id = game.players[player].hand[0].id;
  game.play(player, id);
  assert.throws(() => game.play(player, id));
});

test('engine rejects a card that fails the follow-suit rule', () => {
  const game = new Game();
  game.phase = 'playing'; game.turn = 0; game.trump = 3;
  game.trick = [entry(3, 2, 8)];
  game.players[0].hand = [card(2, 7), card(3, 14)];
  assert.throws(() => game.play(0, '3-14'));
  assert.equal(game.players[0].hand.length, 2);
  game.play(0, '2-7');
  assert.equal(game.players[0].hand[0].id, '3-14');
});

test('bot advancement pauses for the human and completed tricks', () => {
  const game = new Game({ dealer: 2, random: seeded(10) });
  game.continue(); advanceBots(game);
  assert.equal(game.turn, 0); assert.equal(game.phase, 'bidding');
  game.bid(0, game.legalBids(0)[0]); advanceBots(game);
  assert.equal(game.turn, 0); assert.equal(game.phase, 'playing');
  game.play(0, game.legalCards(0)[0].id); advanceBots(game);
  assert.equal(game.phase, 'trick-end');
  assert.equal(game.trick.length, 4);
});

test('100 seeded complete games conserve cards, tricks, scores, and deal order', () => {
  for (let seed = 0; seed < 100; seed++) {
    const game = new Game({ random: seeded(seed) });
    let actions = 0;
    const seen = new Set();
    while (game.phase !== 'finished') {
      assert.ok(actions++ < 2000, 'game must terminate');
      if (['ready', 'deal-end'].includes(game.phase)) {
        game.continue(); seen.clear();
        const hands = game.players.flatMap(p => p.hand);
        assert.equal(hands.length, game.dealt * 4);
        assert.equal(new Set(hands.map(c => c.id)).size, hands.length);
        if (game.trumpCard) assert.ok(!hands.some(c => c.id === game.trumpCard.id));
        if (game.dealt === 9) assert.equal(game.trump, null);
      } else if (game.phase === 'bidding') {
        game.bid(game.turn, chooseBid(game, game.turn));
        if (game.phase === 'playing') assert.notEqual(game.players.reduce((s, p) => s + p.bid, 0), game.dealt);
      } else if (game.phase === 'playing') {
        const card = chooseCard(game, game.turn);
        assert.ok(!seen.has(card.id), 'a card cannot be played twice');
        seen.add(card.id); game.play(game.turn, card.id);
      } else {
        const winner = game.lastWinner;
        assert.equal(game.players.reduce((s, p) => s + p.taken, 0), game.completedTricks);
        game.continue();
        if (game.phase === 'playing') assert.equal(game.turn, winner);
        else {
          assert.equal(seen.size, game.dealt * 4);
          assert.ok(game.players.every(p => p.hand.length === 0));
        }
      }
    }
    assert.deepEqual(game.history.map(h => h.dealt), DEALS);
    game.players.forEach((p, i) => assert.equal(p.score, game.history.reduce((sum, h) => sum + h.players[i].points, 0)));
    assert.throws(() => game.continue());
    assert.throws(() => game.startDeal());
  }
});
