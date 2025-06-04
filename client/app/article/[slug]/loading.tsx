// client/app/articles/[slug]/loading.tsx

export default function Loading() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-center text-slate-500 dark:text-slate-400">
      <p className="text-lg font-semibold animate-pulse">Loading article...</p>
    </main>
  );
}
