import React from "react";
import TurianHero from '../components/TurianHero';
import TurianTips from '../components/TurianTips';

export default function Home() {
  return (
    <main className="flex flex-col">
      <TurianHero />
      <TurianTips />
      <div className="mx-auto max-w-5xl w-full px-4 pb-12">
        <section className="mt-8">
          <article>
            <h2 className="text-2xl font-semibold mb-2">Explore Amazing Worlds</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><a href="/rainforest">Tropical Rainforest</a></li>
              <li><a href="/map#ocean">Ocean Adventures</a></li>
              <li><a href="/map#stories">Magical Stories</a></li>
              <li><a href="/map#quizzes">Brain Challenge</a></li>
            </ul>
          </article>
        </section>
      </div>
    </main>
  );
}

