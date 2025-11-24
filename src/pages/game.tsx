import Head from 'next/head';
import Game from '@/components/Game';

export default function GamePage() {
  return (
    <>
      <Head>
        <title>Real Estate Tycoon - Property Investment Game</title>
        <meta name="description" content="Build your real estate empire! Buy properties, collect rent, and become a millionaire." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Game />
    </>
  );
}
