function Home() {
  return (
    <section className="mx-auto grid min-h-[80vh] max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2">
      <div>
        <p className="mb-4 inline-block rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          AI-Powered Shopping Experience
        </p>

        <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
          Shop smarter with personalized AI recommendations.
        </h2>

        <p className="mt-6 max-w-xl text-lg text-slate-600">
          Discover products faster, compare better, and enjoy a seamless
          shopping experience powered by MERN stack and AI.
        </p>

        <div className="mt-8 flex gap-4">
          <a
            href="/products"
            className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-700"
          >
            Explore Products
          </a>

          <a
            href="/register"
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100"
          >
            Create Account
          </a>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-xl">
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-blue-700 p-8 text-white">
          <p className="text-sm uppercase tracking-widest text-blue-200">
            Smart Recommendation
          </p>
          <h3 className="mt-4 text-3xl font-bold">
            “Find me a laptop under ₹60,000 for coding”
          </h3>
          <p className="mt-4 text-blue-100">
            SmartShop AI understands user intent and recommends the best products.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Home;