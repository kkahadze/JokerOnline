import { trickWinner } from './game.js';

export function chooseBid(game, player) {
  const estimate = Math.round(game.players[player].hand.reduce((sum, card) => sum + (
    card.value === 15 ? 1 : card.suit === game.trump ? 0.65 : card.value === 14 ? 0.5 : 0.1
  ), 0));
  return game.legalBids(player).reduce((best, bid) =>
    Math.abs(bid - estimate) < Math.abs(best - estimate) ? bid : best);
}

export function chooseCard(game, player) {
  const cards = game.legalCards(player).sort((a, b) => strength(a) - strength(b));
  function strength(card) {
    return card.value + (card.value === 15 ? 100 : card.suit === game.trump ? 20 : 0);
  }
  const wantsTrick = game.players[player].taken < game.players[player].bid;
  if (!game.trick.length) return wantsTrick ? cards.at(-1) : cards[0];
  const winners = cards.filter(card => trickWinner([...game.trick, { player, card }], game.trump) === player);
  const losers = cards.filter(card => !winners.includes(card));
  return wantsTrick ? (winners[0] ?? cards[0]) : (losers[0] ?? cards[0]);
}

export function advanceBots(game) {
  while (['bidding', 'playing'].includes(game.phase) && game.turn !== 0) {
    const player = game.turn;
    if (game.phase === 'bidding') game.bid(player, chooseBid(game, player));
    else game.play(player, chooseCard(game, player).id);
  }
}
