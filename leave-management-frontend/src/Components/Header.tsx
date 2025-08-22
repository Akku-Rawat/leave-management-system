import React, { useMemo } from "react";

type Props = { name: string };

const Header: React.FC<Props> = ({ name }) => {
  const today = useMemo(
    () => new Intl.DateTimeFormat("en-GB", {
      weekday: "long", day: "2-digit", month: "long", year: "numeric",
    }).format(new Date()),
    []
  );

  return (
    <header className="bg-white rounded-2xl shadow-sm px-4 md:px-6 py-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">
            Good Morning, {name} <span className="ml-1">👋</span>
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">{today}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-full border border-gray-200 hover:bg-gray-50"
            aria-label="Notifications"
          >
            {/* bell icon */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="1.8" className="w-5 h-5 text-gray-600">
              <path d="M14 19a2 2 0 1 1-4 0" />
              <path d="M6 8a6 6 0 1 1 12 0c0 4 1.5 5 2 6H4c.5-1 2-2 2-6Z" />
            </svg>
          </button>

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-2 py-1">
            <img
              src="https://i.pravatar.cc/40?img=5"
              className="w-7 h-7 rounded-full"
              alt="avatar"
            />
            <span className="text-sm text-gray-700 hidden sm:block">Shivangi</span>
            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.17l3.71-2.94a.75.75 0 1 1 .94 1.16l-4.24 3.36a.75.75 0 0 1-.94 0L5.25 8.39a.75.75 0 0 1-.02-1.18z" clipRule="evenodd"/>
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
