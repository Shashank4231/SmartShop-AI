import Button from "./Button";

function Drawer({
  isOpen,
  title,
  children,
  onClose,
  width = "max-w-xl",
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-screen w-full ${width}
        bg-white shadow-2xl transform transition-transform duration-300
        ${
          isOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-2xl font-bold">
            {title}
          </h2>

          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            ✕
          </Button>
        </div>

        <div className="h-[calc(100vh-88px)] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </>
  );
}

export default Drawer;