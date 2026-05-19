export default function Loading() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-6xl items-center justify-center px-6">
      <div className="glass w-full max-w-xl rounded-3xl p-8">
        <div className="mb-4 h-6 w-56 rounded-lg shimmer" />
        <div className="mb-2 h-3 w-full rounded shimmer" />
        <div className="mb-2 h-3 w-5/6 rounded shimmer" />
        <div className="mb-6 h-3 w-4/6 rounded shimmer" />
        <div className="h-24 rounded-xl shimmer" />
        <p className="mt-5 animate-pulse text-sm text-white/60">Syncing your AI interview workspace...</p>
      </div>
    </main>
  );
}
