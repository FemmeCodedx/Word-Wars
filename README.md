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

A host can start alone on either team. Capture 25 tiles within 10 rounds to win. Solo games end when round 10 finishes if the target is unmet; they do not enter sudden death. Friends can join a lobby individually with the room code and choose their team.

## Implemented

Room-code lobbies; name-only entry; chosen teams; host-selected themes; 1-v-1, 2-v-1, and 2-v-2 boards; simultaneous puzzles; 120-second rounds; fresh 30/60-second hints; automatic territory awards; shared third-win capture streaks; 7×7 map; 25-tile victory; 10-round limit; 60-second sudden death with a hint at 15 seconds; rematches; device refresh recovery.

Launch categories: Christmas songs, 2000s pop, Financial literacy, Animals. Add puzzle entries in `lib/puzzles.ts`; format is answer|hint one|hint two. Puzzle banks cycle during long sessions.

Rooms expire after 24 hours. An unanswered sudden-death puzzle restarts. If all tiles are owned, an ordinary win captures enemy territory. No sign-in is required within the game. Public Sites access must be enabled for guests to reach it.

## Validation

TypeScript check and production build passed. `node tests/game.mjs` verifies player allocation, streaks, territory, hints, and endings. With the local server running, `node tests/multiplayer.mjs` verifies independent sessions, exactly-once concurrent answer awards, synchronized territory, session checks, and capacity.

## Publication status

Source is maintained at https://github.com/FemmeCodedx/Word-Wars. TypeScript checks, production build, and game-rule tests pass. Hosting still needs to be configured before remote players can connect.

The included Azure workflow is an unconfigured template (its app name is still `your-app-name`). This application uses Cloudflare Workers and a D1 database; static GitHub Pages cannot run its shared rooms. Use Sites publishing, or configure a compatible Cloudflare deployment with the DB binding and included migration.
