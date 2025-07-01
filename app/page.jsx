// pages/index.js
import Head from 'next/head';
import SunsetList from './components/SunsetList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-orange-100">
      <Head>
        <title>Sunset Locator - Pôr do Sol em Tempo Real</title>
        <meta name="description" content="Descubra onde o sol está se pondo agora no mundo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <SunsetList />
      </main>
    </div>
  );
  }