# Word Wars

A multiplayer team word game for 2–10 players, built for Sites.

## Run locally

Requires Node.js 22.13 or later.

1. Install packages with `npm install`.
2. Generate the production build with `npm run build`.
3. Apply the included migration using:
   `node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_normal_yellowjacket.sql`
4. Run `npm start` and open the printed local URL.

The Sites project identity is retained in `.openai/hosting.json`. Publishing needs an authorized source repository upload, then version saving and deployment through Sites.

## Implemented

Room-code lobbies; name-only entry; chosen teams; host-selected themes; 1-v-1, 2-v-1, and 2-v-2 boards; simultaneous puzzles; 120-second rounds; fresh 30/60-second hints; automatic territory awards; shared third-win capture streaks; 7×7 map; 25-tile victory; 10-round limit; 60-second sudden death with a hint at 15 seconds; rematches; device refresh recovery.

Launch categories: Christmas songs, 2000s pop, Financial literacy, Animals. Add puzzle entries in `lib/puzzles.ts`; format is answer|hint one|hint two. Puzzle banks cycle during long sessions.

Rooms expire after 24 hours. An unanswered sudden-death puzzle restarts. If all tiles are owned, an ordinary win captures enemy territory. No sign-in is required within the game. Public Sites access must be enabled for guests to reach it.

## Validation

TypeScript check and production build passed. `node tests/game.mjs` verifies player allocation, streaks, territory, hints, and endings. With the local server running, `node tests/multiplayer.mjs` verifies independent sessions, exactly-once concurrent answer awards, synchronized territory, session checks, and capacity.

## Publication status

Built and tested locally. Publication is not complete: the environment rejects the Sites source helper’s credential-input step, even after permissions were granted. No live deployment URL has been verified.
