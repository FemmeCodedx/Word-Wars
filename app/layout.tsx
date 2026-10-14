import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Word Wars · Solve Puzzles. Rule the World.',description:'A live word-puzzle showdown for 1–10 players. Create a room, pick a team, and conquer the map.'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
