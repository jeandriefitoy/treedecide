interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = "Memproses...",
}: LoadingStateProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-gray-100 p-4 text-gray-600">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      <span>{message}</span>
    </div>
  );
}
