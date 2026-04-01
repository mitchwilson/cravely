import OpenAIChat from "./OpenAIChat";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans text-zinc-600">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center py-32 px-16 bg-white sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-purple-400">
            Cravely
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600">
            Find what you crave, wherever you are.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <OpenAIChat />
        </div>
      </main>
    </div>
  );
}
