import { DEALS, SUITS } from './game.js';

const SYMBOLS = ['♦', '♣', '♥', '♠'];
const RANKS = { 11: 'J', 12: 'Q', 13: 'K', 14: 'A', 15: '★' };
const $ = id => document.getElementById(id);
export function cardName(card) {
  return card.value === 15 ? `Joker ${card.id.endsWith('1') ? 'one' : 'two'}`
    : `${({ 11: 'Jack', 12: 'Queen', 13: 'King', 14: 'Ace' })[card.value] ?? card.value} of ${SUITS[card.suit]}`;
}

function cardElement(card, interactive = false) {
  const node = document.createElement(interactive ? 'button' : 'div');
  node.className = `card ${card.suit === 0 || card.suit === 2 ? 'red' : ''} ${card.value === 15 ? 'joker' : ''}`;
  node.setAttribute('aria-label', cardName(card));
  if (interactive) { node.type = 'button'; node.dataset.card = card.id; }
  const rank = RANKS[card.value] ?? card.value;
  const symbol = card.value === 15 ? '✦' : SYMBOLS[card.suit];
  node.innerHTML = `<span class="corner">${rank}<small>${card.value === 15 ? '' : symbol}</small></span><span class="card-symbol" aria-hidden="true">${symbol}</span><span class="card-bottom" aria-hidden="true">${card.value === 15 ? 'JOKER' : rank}</span>`;
  return node;
}

function button(label, data, value = '') {
  const node = document.createElement('button');
  node.type = 'button';
  node.textContent = label;
  node.dataset[data] = value;
  return node;
}

export function render(game) {
  const active = ['bidding', 'playing'].includes(game.phase);
  $('deal-label').textContent = game.phase === 'ready' ? 'Ready when you are' : `Deal ${game.dealIndex + 1} / ${DEALS.length} · ${game.dealt} ${game.dealt === 1 ? 'card' : 'cards'}`;
  $('trump-label').textContent = game.phase === 'ready' ? '24 deals · 3 opponents' : `Trump: ${game.trump === null ? 'None' : `${SYMBOLS[game.trump]} ${SUITS[game.trump]}`}`;
  $('trump-label').title = game.trumpCard ? `Turned up: ${cardName(game.trumpCard)}` : 'No undealt card';
  $('opponents').replaceChildren(...game.players.slice(1).map((p, i) => {
    const seat = document.createElement('div');
    seat.className = `opponent ${active && game.turn === i + 1 ? 'current' : ''}`;
    seat.innerHTML = `<span class="avatar" aria-hidden="true">${p.name[0]}</span><strong>${p.name}</strong><small>${p.hand.length} cards · call ${p.bid ?? '—'}</small>`;
    return seat;
  }));
  $('trick').replaceChildren(...game.trick.map(entry => {
    const slot = document.createElement('div');
    slot.className = `trick-slot ${game.lastWinner === entry.player && !active ? 'winner' : ''}`;
    const label = document.createElement('span');
    label.textContent = game.players[entry.player].name;
    slot.append(cardElement(entry.card), label);
    return slot;
  }));
  if (!game.trick.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-table';
    empty.textContent = game.phase === 'ready' ? 'Your seat is waiting.' : game.phase === 'bidding' ? 'Make your call.' : 'A new trick begins.';
    $('trick').append(empty);
  }
  const legal = new Set(game.legalCards(0).map(card => card.id));
  $('hand').replaceChildren(...game.players[0].hand.map((card, index) => {
    const node = cardElement(card, true);
    node.disabled = !legal.has(card.id);
    const key = document.createElement('span');
    key.className = 'key-hint';
    key.textContent = index + 1;
    key.setAttribute('aria-hidden', 'true');
    node.append(key);
    return node;
  }));
  $('hand-note').textContent = game.phase === 'playing' ? 'Highlighted cards are legal · keys 1–9' : game.phase === 'bidding' ? 'Call with keys 0–9 or the buttons below' : 'Take your time.';
  $('scores').innerHTML = game.players.map((p, i) => `<tr class="${i === 0 ? 'you' : ''}"><th scope="row">${p.name}${game.phase !== 'ready' && i === game.dealer ? '<small>Dealer</small>' : ''}</th><td>${p.bid ?? '—'}</td><td>${p.taken}</td><td>${p.score}</td></tr>`).join('');
  const actions = $('actions');
  actions.replaceChildren();
  let message;
  switch (game.phase) {
    case 'ready':
      message = 'Three opponents. One seat left. Yours.';
      actions.append(button('Take a seat →', 'continue'));
      break;
    case 'bidding': {
      message = `How many of these ${game.dealt} tricks will you take?`;
      const allowed = game.legalBids(0);
      for (let bid = 0; bid <= game.dealt; bid++) {
        const choice = button(String(bid), 'bid', String(bid));
        choice.setAttribute('aria-label', `Call ${bid}`);
        choice.disabled = !allowed.includes(bid);
        if (choice.disabled) choice.title = 'The dealer cannot make total calls equal tricks available.';
        actions.append(choice);
      }
      if (allowed.length < game.dealt + 1) message += ' As dealer, you cannot make total calls equal the tricks available.';
      break;
    }
    case 'playing': message = 'Your turn. Choose a highlighted card.'; break;
    case 'trick-end':
      message = `${game.players[game.lastWinner].name} ${game.lastWinner === 0 ? 'take' : 'takes'} the trick.`;
      actions.append(button(game.completedTricks === game.dealt ? 'See deal scores →' : 'Next trick →', 'continue'));
      break;
    case 'deal-end':
      message = 'Deal complete. Scores are in.';
      actions.append(button('Next deal →', 'continue'));
      break;
    case 'finished': {
      const high = Math.max(...game.players.map(p => p.score));
      const winners = game.players.filter(p => p.score === high).map(p => p.name);
      message = `Game complete. ${winners.join(' & ')} ${winners.length > 1 ? 'tie for first' : winners[0] === 'You' ? 'win' : 'wins'} with ${high} points!`;
      actions.append(button('Play again →', 'restart'));
      break;
    }
  }
  $('status').textContent = message;
  $('result').replaceChildren();
  if (['deal-end', 'finished'].includes(game.phase)) {
    const points = game.history.at(-1).players[0].points;
    $('result').textContent = `This deal: ${points > 0 ? '+' : ''}${points} for you`;
  }
  $('history-details').hidden = !game.history.length;
  $('history').replaceChildren(...game.history.map((deal, i) => {
    const item = document.createElement('li');
    item.textContent = `Deal ${i + 1}: ${deal.players.map((p, n) => `${game.players[n].name} ${p.points > 0 ? '+' : ''}${p.points}`).join(' · ')}`;
    return item;
  }));
}
