import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import Button from "@components/ui/Button";

function AuthShowcase() {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      <Button
        variant="primary"
        type="button"
        className="rounded-full px-10 py-3 font-semibold text-white no-underline"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
    </div>
  );
}

const features = ["Upload songs", "Music player", "Playlists", "Favorites"];

const upcomingFeatures = [
  "Search for songs",
  "History",
  "Equalizer",
  "PWA",
  "Queue",
  "Edit own songs",
  "Increased accessibility on upload",
  "More responsive layout (audio player, playlists)",
];

function Home() {
  return (
    <>
      <Head>
        <title>Groovy js</title>
        <meta name="description" content="A music player" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Groovy.<span className="text-amber-300">js</span>
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <section className="space-y-2 rounded-xl border-accent-light bg-white/10 p-4">
            <h2 className="text-2xl font-bold">Features</h2>
            <ul className="list-inside list-disc text-lg">
              {features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>
          <section className="space-y-2 rounded-xl border-accent-light bg-white/10 p-4">
            <h2 className="text-2xl font-bold">Upcoming Features</h2>
            <ul className="list-inside list-disc text-lg">
              {upcomingFeatures.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>
        </div>
        <div className="mb-16 flex flex-col items-center gap-2">
          <AuthShowcase />
        </div>
      </div>
    </>
  );
}

export default Home;
