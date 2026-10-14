# Word Wars

A multiplayer team word game for 1–10 players, built for Sites.

## Run locally

Requires Node.js 22.13 or later.

1. Install packages with `npm install`.
2. Generate the production build with `npm run build`.
3. Apply the included migration using:
   `node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_normal_yellowjacket.sql`
4. Run `npm start` and open the printed local URL.

The Sites project identity is retained in `.openai/hosting.json`. Publishing needs an authorized source repository upload, then version saving and deployment through Sites.

## Solo play

A host can start alone on either team. Solve 12 puzzles within 10 rounds to win. Solo games end when round 10 finishes if the target is unmet; they do not enter sudden death. Friends can join a lobby individually with the room code and choose their team.

## Implemented

Room-code lobbies; name-only entry; chosen teams; host-selected themes; 1-v-1, 2-v-1, and 2-v-2 boards; simultaneous puzzles; 120-second rounds; first hint on request after 30 seconds and automatic second hint at 60 seconds; automatic territory awards; shared third-win capture streaks; 49 named-property board; 25-tile victory; 10-round limit; 60-second sudden death with a hint at 15 seconds; rematches; device refresh recovery.

Categories: Christmas songs, 2000s pop, Financial literacy, Animals, NBA teams, MLB teams, NFL teams, NHL teams, US states, 90s R&B, 90s Hip Hop, and 90s Pop. Add categories in `lib/categories.ts` and puzzle entries in `lib/puzzles.ts`; format is answer|hint one|hint two. Puzzle banks cycle during long sessions.

Rooms expire after 24 hours. An unanswered sudden-death puzzle restarts. If all tiles are owned, an ordinary win captures enemy territory. No sign-in is required within the game. Public Sites access must be enabled for guests to reach it.

## Validation

TypeScript check and production build passed. `node tests/game.mjs` verifies player allocation, streaks, territory, hints, and endings. With the local server running, `node tests/multiplayer.mjs` verifies independent sessions, exactly-once concurrent answer awards, synchronized territory, session checks, and capacity.

## Live game

Play at https://word-wars.niastewart24.workers.dev/

Cloudflare Workers builds and deploys the `main` branch. The production D1 database `word-wars-db` is bound as `DB`; its room table has been initialized using the included schema. The Worker name and database binding are configured in `vite.config.ts`.

Verified on the public URL: independent multiplayer sessions, room-code joining, exactly-once concurrent answer awards, synchronized territory, 10-player capacity, and solo play on either team.

The included Azure workflow is an unused template. The live game is hosted on Cloudflare.

## Named properties and hints

The property board has 48 perimeter properties and the central Crown Plaza. All 49 count toward the multiplayer 25-property majority. Ownership lists and the capture feed identify claimed and captured properties by name. Solo victory depends on 12 solved puzzles, not territory count.

Each player can request the first hint once per puzzle, starting at 30 seconds. Only that player sees the requested hint. The second hint remains automatic at 60 seconds. A new puzzle resets hint requests. Sudden death still has one automatic hint at 15 seconds.

Sports team names are checked against the official NBA, MLB, NFL, and NHL team directories (October 2026); music entries use titles and artist metadata without lyrics.
