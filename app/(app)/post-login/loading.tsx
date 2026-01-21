export default function Loading() {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F4F4F0]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
          <p className="text-sm text-gray-600">Logging you in…</p>
        </div>
      </div>
    );
  }