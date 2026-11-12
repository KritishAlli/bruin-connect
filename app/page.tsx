const categories = ["🍽️ Food", "🏋️ Fitness", "📚 Study", "🎉 Social", "⚽ Sports"];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-8 px-4 py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Bruin <span className="text-ucla-blue dark:text-ucla-gold">Connect</span>
      </h1>
      <p className="text-foreground/70 text-lg">
        See what&apos;s happening around campus and find people to do it with.
      </p>
      <ul className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <li
            key={category}
            className="border-foreground/15 rounded-full border px-4 py-1.5 text-sm"
          >
            {category}
          </li>
        ))}
      </ul>
      <p className="text-foreground/50 text-sm">
        🚧 Under construction. Check the README and GitHub Issues to start contributing.
      </p>
    </main>
  );
}
