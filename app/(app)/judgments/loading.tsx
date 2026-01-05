// app/(app)/judgments/loading.tsx
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-8 shadow-2xl">
        <div className="relative h-12 w-12">
          <div className="absolute h-12 w-12 animate-spin rounded-full border-4 border-slate-100 border-t-blue-600" />
        </div>
        <div className="text-sm font-semibold text-slate-700 animate-pulse">
          กำลังค้นหา...
        </div>
      </div>
    </div>
  );
}
