import { Container } from "../components/Container";

export default function Home() {
  return (
    <>
      {/* Header is global */}
      <main className="pb-16">
        <Container className="pt-6 sm:pt-8">
          {/* Hero */}
          <section className="mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
              Welcome to the Naturverse™
            </h1>
            <p className="mt-3 max-w-2xl text-base sm:text-lg text-gray-700">
              A playful world of kingdoms, characters, and quests that teach wellness, creativity, and kindness.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              {/* buttons unchanged */}
            </div>
          </section>

          {/* 3-column feature tiles -> stack on mobile */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Play */}
            <div className="rounded-xl border p-5">
              <h2 className="text-xl font-semibold">Play</h2>
              <p className="mt-2 text-gray-700">Mini-games, stories, and map adventures across 14 kingdoms.</p>
            </div>
            {/* Learn */}
            <div className="rounded-xl border p-5">
              <h2 className="text-xl font-semibold">Learn</h2>
              <p className="mt-2 text-gray-700">Naturversity lessons in languages, art, music, wellness, and more.</p>
            </div>
            {/* Earn */}
            <div className="rounded-xl border p-5">
              <h2 className="text-xl font-semibold">Earn</h2>
              <p className="mt-2 text-gray-700">Collect badges, save favorites, build your Navatar card.</p>
            </div>
          </section>

          {/* Mini-quests (if shown) should also use responsive grids */}
          {/* <MiniQuestsGrid /> */}
        </Container>
      </main>
      {/* Footer is global */}
    </>
  );
}

