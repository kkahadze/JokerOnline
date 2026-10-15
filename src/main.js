import { Game } from './game.js';
import { advanceBots } from './bots.js';
import { render } from './view.js';

let game = new Game();
render(game);

function update(action) {
  action();
  advanceBots(game);
  render(game);
  // Rendering replaces controls; keep keyboard focus on the next legal action.
  const next = document.querySelector('#actions button:not(:disabled), #hand button:not(:disabled)');
  next?.focus({ preventScroll: true });
}

function restart() {
  update(() => { game = new Game(); });
}

document.getElementById('restart').addEventListener('click', restart);
document.getElementById('actions').addEventListener('click', event => {
  const target = event.target.closest('button');
  if (!target || target.disabled) return;
  if ('bid' in target.dataset) update(() => game.bid(0, Number(target.dataset.bid)));
  else if ('continue' in target.dataset) update(() => game.continue());
  else if ('restart' in target.dataset) restart();
});
document.getElementById('hand').addEventListener('click', event => {
  const target = event.target.closest('button[data-card]');
  if (target && !target.disabled) update(() => game.play(0, target.dataset.card));
});
document.addEventListener('keydown', event => {
  if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || !/^[0-9]$/.test(event.key)) return;
  if (event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
  const value = Number(event.key);
  if (game.phase === 'bidding' && game.legalBids(0).includes(value)) {
    event.preventDefault();
    update(() => game.bid(0, value));
  } else if (game.phase === 'playing') {
    const card = game.players[0].hand[value - 1];
    if (card && game.legalCards(0).some(legal => legal.id === card.id)) {
      event.preventDefault();
      update(() => game.play(0, card.id));
    }
  }
});
