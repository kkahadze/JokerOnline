# Joker Online

A playable browser version of the original project's **simplified Georgian Joker** variant: one human, three local rule-based bots, and a complete 24-deal game. No accounts, server, external assets, or runtime dependencies are required. Despite the historical name, this is **single-player**, not network multiplayer.

## Run locally

Use Node.js 22 or newer:

```sh
git clone https://github.com/kkahadze/JokerOnline.git
cd JokerOnline
npm ci
npm start
```

Open http://127.0.0.1:4173. Click **Take a seat**, call how many tricks you expect to win, then play highlighted cards. Number keys 0–9 select a bid; keys 1–9 play the corresponding card in your hand. You can also use Tab and Enter. After each trick, continue when you're ready. **New game** clears the current game and scores.

The bots use simple hand-strength and trick-winning heuristics. They are legal opponents, not trained AI.

## Rules implemented

- A 36-card deck: 7 through ace in all four suits, red sixes, and two distinct Jokers.
- The 24 deals are 1–8 cards each, four deals of 9, 8–1 cards, then four more deals of 9.
- The dealer rotates each deal. The next player bids and leads first; the dealer bids last.
- The last bidder cannot make the sum of all calls equal the available tricks. This restriction also applies when the human is last.
- Trump is the first undealt card's suit. A turned-up Joker means no trump. Nine-card deals use the entire deck and have no trump.
- Follow the led suit if possible; otherwise play trump if possible; otherwise any card. A Joker is always legal.
- Jokers always beat ordinary cards. If both are played, the later Joker in actual play order wins. A Joker lead has no suit: following players must play trump when possible, or any card when no trump is available.
- The trick winner leads the next trick. Highest total score after 24 deals wins; ties are shared.

Scoring preserves the original implementation:

| Result | Points |
| --- | --- |
| Exact call, but not every trick | 50 × tricks taken + 50 |
| Call and take every trick | 100 × tricks taken |
| Miss call, taking at least one trick | 10 × tricks taken |
| Call above zero and take no tricks | −200 |
| Call zero and take zero | 50 |

This is a house variant, **not a full implementation of every Georgian Joker rule**. Joker declarations (high/low or suit requests), choosing trump in nine-card deals, and section bonuses are not implemented. There is no saved-game persistence; refreshing starts a new game.

## Build and host

```sh
npm run build
npm run preview
```

The build copies only the HTML, stylesheet, browser modules, and `.nojekyll` to `dist/`. Upload that directory to any static host. All asset paths are relative, including module imports, so hosting at a repository subpath works.

GitHub Pages can also serve the repository root directly because it contains the same static entry point and modules. CI checks changes and produces a downloadable `joker-online-static-site` artifact; it does not change deployment settings or publish automatically.

## Tests

```sh
npm test
npx playwright install chromium
npm run check
```

`npm test` uses Node's built-in test runner. It checks the deck, Fisher–Yates permutations, bidding restrictions, following suit, Joker ordering, scoring, invalid actions, and 100 seeded complete games with card/trick conservation checks.

`npm run check` also builds and runs Playwright against the built site. Browser tests play all 24 deals, exercise keyboard controls (including bid 6), reset a game, and check a nine-card hand on a 375px-wide phone. To use an installed Chrome locally instead of downloading Chromium:

```sh
PW_CHANNEL=chrome npm run check
```

CI uses Node 22 and Playwright's Chromium. Playwright is a pinned development-only dependency.

## Layout

- `src/game.js`: pure rules and synchronous game state; no DOM access.
- `src/bots.js`: legal bot bids/moves and advancement to the next human decision.
- `src/view.js`: accessible cards, table, score history, and phase-specific controls.
- `src/main.js`: mouse/keyboard input and rendering coordination.
- `style.css`: responsive table and card styling; no third-party card images.
- `scripts/`: static build and localhost preview server.
- `tests/`: rules, complete-game simulation, and browser regression tests.

The engine uses explicit `ready`, `bidding`, `playing`, `trick-end`, `deal-end`, and `finished` phases. There are no polling loops or overlapping asynchronous game runs. Moves use stable card IDs, not DOM positions or object references.
