export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <p className="text-2xl mt-4">Page Not Found</p>
        <a href="/" className="btn btn-primary mt-8">Back to Home</a>
      </div>
    </div>
  );
}