import React from 'react';
import { FilterSectionProps } from '@entities/digimon.d';

export default function FilterSection({
  filterBy,
  isDropdownCategory,
  isDropdownType,
  categories,
  types,
  onFilterChange,
  onToggleCategory,
  onToggleType,
}: Readonly<FilterSectionProps>) {
  return (
    <div className="flex justify-between flex-wrap mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Filter By</h2>
      <div className="flex items-baseline gap-4">
        {/* None Filter Button */}
        <button
          type="button"
          onClick={() => onFilterChange('none', 'Active')}
          className={`text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 ${filterBy.none ? 'bg-blue-700 text-white hover:bg-blue-800' : 'bg-white'}`}
        >
          None
        </button>

        {/* Category Dropdown */}
        <div className="relative inline-block">
          <button
            onClick={onToggleCategory}
            className={`text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 text-center inline-flex items-center ${filterBy.category ? 'bg-blue-700 text-white hover:bg-blue-800' : 'bg-white'}`}
            type="button"
          >
            Categories
            <svg
              className="w-2.5 h-2.5 ms-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          {isDropdownCategory && (
            <div className="absolute right-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44">
              <ul className="py-2 text-sm text-gray-700">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => {
                        onFilterChange('category', category);
                        onToggleCategory();
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Type Dropdown */}
        <div className="relative inline-block">
          <button
            onClick={onToggleType}
            className={`text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 text-center inline-flex items-center ${filterBy.type ? 'bg-blue-700 text-white hover:bg-blue-800' : 'bg-white'}`}
            type="button"
          >
            Types
            <svg
              className="w-2.5 h-2.5 ms-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          {isDropdownType && (
            <div className="absolute right-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44">
              <ul className="py-2 text-sm text-gray-700">
                {types.map((type) => (
                  <li key={type}>
                    <button
                      onClick={() => {
                        onFilterChange('type', type);
                        onToggleType();
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      {type}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
