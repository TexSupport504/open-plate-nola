import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <header className="bg-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Open Plate NOLA</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Free food resources for New Orleans. No app, no signup, no ID required.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/"
              className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50"
            >
              Find Food Now
            </Link>
            <a
              href="#partner"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600"
            >
              Partner With Us
            </a>
          </div>
        </div>
      </header>

      {/* The Problem */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Problem</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            New Orleans has food resources scattered across the city — community fridges,
            hot meal programs, food pantries. But people who need them most often don&apos;t
            know where they are, when they&apos;re open, or what&apos;s required.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed mt-4">
            Someone sleeping rough shouldn&apos;t have to guess where to find their next meal.
          </p>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Solution</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Text &quot;FOOD&quot;</h3>
              <p className="text-gray-600">
                Text &quot;FOOD&quot; to our number and get back the nearest open resources
                with addresses and hours. Works on any phone — even flip phones.
              </p>
              <p className="text-sm text-blue-600 mt-2">(SMS coming soon)</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
              <p className="text-gray-600">
                See every food resource on a map. Filter by &quot;Open Now&quot; or
                &quot;No ID Required.&quot; Click for directions.
              </p>
              <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
                View the map →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* By The Numbers */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">By The Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-green-600">21</div>
              <div className="text-gray-600 mt-1">Resources Mapped</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">15</div>
              <div className="text-gray-600 mt-1">Community Fridges</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-600">3</div>
              <div className="text-gray-600 mt-1">Hot Meal Programs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600">3</div>
              <div className="text-gray-600 mt-1">Food Pantries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Core Principles
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🚫</div>
              <h3 className="font-semibold mb-2">Zero Barriers</h3>
              <p className="text-gray-600 text-sm">
                No app download. No signup. No ID. No questions asked.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📡</div>
              <h3 className="font-semibold mb-2">Real-Time Updates</h3>
              <p className="text-gray-600 text-sm">
                Community-maintained so information stays accurate.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">💚</div>
              <h3 className="font-semibold mb-2">Dignity First</h3>
              <p className="text-gray-600 text-sm">
                Designed with and for the people who need it most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner With Us */}
      <section id="partner" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Partner With Us
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">🍳 Restaurants & Hotels</h3>
              <p className="text-gray-600 mb-4">
                Have food that would otherwise go to waste? We&apos;ll add your drop-off
                schedule to our system so people can find it.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">💻 Tech Volunteers</h3>
              <p className="text-gray-600 mb-4">
                Help build the SMS system, improve the map, or maintain the database.
                Next.js, Supabase, Twilio stack.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">🏘️ Community Orgs</h3>
              <p className="text-gray-600 mb-4">
                Know about resources we&apos;re missing? Help us keep the data accurate
                and spread the word to those who need it.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">💰 Sponsors</h3>
              <p className="text-gray-600 mb-4">
                Support SMS costs, hosting, and fridge maintenance. Every dollar
                goes directly to keeping people fed.
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link
              href="/admin/contacts"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 inline-block"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Open Source Stack</h2>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-gray-800 px-4 py-2 rounded-full">Next.js</span>
            <span className="bg-gray-800 px-4 py-2 rounded-full">TypeScript</span>
            <span className="bg-gray-800 px-4 py-2 rounded-full">Supabase</span>
            <span className="bg-gray-800 px-4 py-2 rounded-full">Tailwind CSS</span>
            <span className="bg-gray-800 px-4 py-2 rounded-full">Leaflet</span>
            <span className="bg-gray-800 px-4 py-2 rounded-full">OpenStreetMap</span>
            <span className="bg-gray-800 px-4 py-2 rounded-full">Twilio (SMS)</span>
            <span className="bg-gray-800 px-4 py-2 rounded-full">Vercel</span>
          </div>
          <p className="text-center text-gray-400 mt-6">
            100% free and open source. Built for the community.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-green-700 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Find Food Now</h2>
          <p className="text-green-100 mb-8 text-lg">
            View all free food resources across New Orleans
          </p>
          <Link
            href="/"
            className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 inline-block"
          >
            Open the Map
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            Open Plate NOLA — Built with love for New Orleans
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <Link href="/" className="text-green-400 hover:text-green-300">
              Map
            </Link>
            <Link href="/admin" className="text-green-400 hover:text-green-300">
              Admin
            </Link>
            <Link href="/admin/contacts" className="text-green-400 hover:text-green-300">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
