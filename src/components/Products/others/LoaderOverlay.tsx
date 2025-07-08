"use client";

export default function LoaderOverlay({ loading }: { loading: boolean }) {
  if (!loading) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
      <div className="animate-spin rounded-full h-[100px] w-[100px] border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}
