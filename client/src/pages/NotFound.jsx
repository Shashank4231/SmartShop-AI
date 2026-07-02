import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-extrabold text-slate-900">404</h1>

        <h2 className="mt-6 text-3xl font-bold text-slate-800">
          Page Not Found
        </h2>

        <p className="mx-auto mt-4 max-w-md text-slate-500">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <Link to="/" className="mt-8 inline-block">
          <Button>Go Back Home</Button>
        </Link>
      </div>
    </section>
  );
}

export default NotFound;