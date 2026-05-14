export default function DashboardLoading() {

  return (
    <main className="min-h-screen bg-black p-10 text-white">

      <div className="animate-pulse">

        {/* Header */}
        <div className="h-12 w-72 rounded-xl bg-zinc-800" />

        <div className="mt-4 h-6 w-96 rounded-xl bg-zinc-900" />

        {/* Stats */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-40 rounded-2xl bg-zinc-900"
            />
          ))}

        </div>

        {/* Content */}
        <div className="mt-10 grid gap-6">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-48 rounded-3xl bg-zinc-900"
            />
          ))}

        </div>

      </div>

    </main>
  );
}