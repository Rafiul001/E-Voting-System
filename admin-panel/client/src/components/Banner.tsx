import React from "react";

const Banner: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-r from-indigo-50 via-white to-teal-50 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium w-max">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M12 2v6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 11.5l7 7 7-7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Private Blockchain
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight text-gray-900">
              Secure, Private & Verifiable Voting
            </h1>

            <p className="text-gray-600 text-lg max-w-xl">
              A private blockchain–based voting system built for integrity and
              confidentiality. Immutable ledgers, permissioned access, and
              transparent audit trails — all tailored for organizations that
              require secure democratic processes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1 p-4 rounded-lg bg-white border border-gray-100 shadow-sm">
                <span className="text-xs text-gray-500">Integrity</span>
                <span className="font-semibold text-gray-900">
                  Immutable Ledger
                </span>
              </div>
              <div className="flex flex-col gap-1 p-4 rounded-lg bg-white border border-gray-100 shadow-sm">
                <span className="text-xs text-gray-500">Privacy</span>
                <span className="font-semibold text-gray-900">
                  Permissioned Access
                </span>
              </div>
              <div className="flex flex-col gap-1 p-4 rounded-lg bg-white border border-gray-100 shadow-sm">
                <span className="text-xs text-gray-500">Trust</span>
                <span className="font-semibold text-gray-900">
                  Verifiable Results
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-white font-medium shadow hover:bg-indigo-700 transition"
              >
                Get Started
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-white px-5 py-3 text-indigo-700 font-medium hover:bg-indigo-50 transition"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right: Illustration / Stats */}
          <div className="relative flex items-center justify-center">
            <div className="w-full max-w-md p-6 rounded-2xl bg-gradient-to-br from-white via-indigo-50 to-teal-50 border border-gray-100 shadow-lg">
              {/* network illustration */}
              <svg
                viewBox="0 0 400 260"
                className="w-full h-48 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
                <rect
                  x="0"
                  y="0"
                  width="400"
                  height="260"
                  rx="14"
                  fill="url(#g1)"
                  opacity="0.06"
                />
                {/* nodes */}
                <circle cx="80" cy="50" r="8" fill="#fff" opacity="0.95" />
                <circle cx="170" cy="30" r="8" fill="#fff" opacity="0.95" />
                <circle cx="260" cy="60" r="8" fill="#fff" opacity="0.95" />
                <circle cx="120" cy="120" r="8" fill="#fff" opacity="0.95" />
                <circle cx="210" cy="150" r="8" fill="#fff" opacity="0.95" />
                <circle cx="320" cy="110" r="8" fill="#fff" opacity="0.95" />
                {/* links */}
                <line
                  x1="80"
                  y1="50"
                  x2="170"
                  y2="30"
                  stroke="#0F172A"
                  strokeOpacity="0.08"
                  strokeWidth="2"
                />
                <line
                  x1="170"
                  y1="30"
                  x2="260"
                  y2="60"
                  stroke="#0F172A"
                  strokeOpacity="0.08"
                  strokeWidth="2"
                />
                <line
                  x1="80"
                  y1="50"
                  x2="120"
                  y2="120"
                  stroke="#0F172A"
                  strokeOpacity="0.08"
                  strokeWidth="2"
                />
                <line
                  x1="120"
                  y1="120"
                  x2="210"
                  y2="150"
                  stroke="#0F172A"
                  strokeOpacity="0.08"
                  strokeWidth="2"
                />
                <line
                  x1="260"
                  y1="60"
                  x2="320"
                  y2="110"
                  stroke="#0F172A"
                  strokeOpacity="0.08"
                  strokeWidth="2"
                />
                {/* ledger boxes */}
                <rect
                  x="18"
                  y="160"
                  width="110"
                  height="56"
                  rx="8"
                  fill="#fff"
                  opacity="0.98"
                />
                <rect
                  x="144"
                  y="160"
                  width="110"
                  height="56"
                  rx="8"
                  fill="#fff"
                  opacity="0.98"
                />
                <rect
                  x="270"
                  y="160"
                  width="110"
                  height="56"
                  rx="8"
                  fill="#fff"
                  opacity="0.98"
                />
                <text
                  x="74"
                  y="188"
                  textAnchor="middle"
                  className="text-xs"
                  fill="#0F172A"
                  fontSize="12"
                >
                  Block 001
                </text>
                <text
                  x="200"
                  y="188"
                  textAnchor="middle"
                  className="text-xs"
                  fill="#0F172A"
                  fontSize="12"
                >
                  Block 002
                </text>
                <text
                  x="326"
                  y="188"
                  textAnchor="middle"
                  className="text-xs"
                  fill="#0F172A"
                  fontSize="12"
                >
                  Block 003
                </text>
              </svg>

              {/* stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Elections</div>
                  <div className="text-lg font-semibold text-gray-900">12</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Audits</div>
                  <div className="text-lg font-semibold text-gray-900">
                    100%
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                Permissioned nodes, cryptographic signatures, and auditable
                records ensure each vote is confidential and tamper-proof.
              </div>
            </div>

            {/* subtle decorative badge */}
            <div className="absolute -right-6 -top-6 hidden md:block">
              <div className="rounded-full bg-white border border-indigo-100 p-3 shadow-lg">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M12 2v6"
                    stroke="#6366F1"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 11.5l7 7 7-7"
                    stroke="#14B8A6"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* footer note */}
        <div className="mt-8 text-center text-xs text-gray-500">
          Built on a permissioned (private) blockchain — configurable
          membership, non-public consensus, and enterprise-grade privacy.
        </div>
      </div>
    </section>
  );
};

export default Banner;
