export function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-5">
        <div className="w-5 h-5 rounded-full border-2 border-t-neutral-500 animate-spin" />
        <div className="text-sm text-neutral-400 tracking-widest uppercase animate-pulse">
          Loading...
        </div>
      </div>
    </div>
  );
}
