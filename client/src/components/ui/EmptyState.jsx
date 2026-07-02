import { Link } from "react-router-dom";
import Button from "./Button";

function EmptyState({
  title,
  description,
  actionText,
  actionLink,
}) {
  return (
    <div className="rounded-2xl bg-white p-10 text-center shadow">
      <h3 className="text-2xl font-bold text-slate-900">
        {title}
      </h3>

      {description && (
        <p className="mx-auto mt-3 max-w-md text-slate-500">
          {description}
        </p>
      )}

      {actionText && actionLink && (
        <Link to={actionLink} className="mt-6 inline-block">
          <Button>{actionText}</Button>
        </Link>
      )}
    </div>
  );
}

export default EmptyState;