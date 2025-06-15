export default function Loading() {
  return <div className="min-h-screen w-full p-8 flex items-center justify-center text-muted-foreground">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
    <span className="ml-4">Loading...</span>
  </div>;
}