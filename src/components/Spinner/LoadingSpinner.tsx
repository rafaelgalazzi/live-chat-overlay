export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <span className="w-[20px] h-[20px] border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
