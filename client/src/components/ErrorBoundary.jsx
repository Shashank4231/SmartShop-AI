import React from "react";
import Button from "./ui/Button";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application Error:", error);
    console.error(errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <section className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-md text-center">
            <h1 className="text-5xl font-bold text-red-600">Oops!</h1>

            <p className="mt-5 text-lg text-slate-700">
              Something went wrong.
            </p>

            <p className="mt-2 text-slate-500">
              Please reload the page or return home.
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <Button onClick={this.handleReload}>
                Reload
              </Button>

              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
              >
                Go Home
              </Button>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;