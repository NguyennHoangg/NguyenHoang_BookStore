export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-surface-container-low ${className || ""}`}
    />
  );
}