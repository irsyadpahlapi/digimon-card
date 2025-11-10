'use client';
import { DetailDigimonRepository } from '@/core/repositories/myCardRepository';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface CardDetailModalProps {
  item: DetailDigimonRepository | null;
  isOpen: boolean;
  onClose: () => void;
  onEvolve: (id: number, nextEvolution: number) => void;
  onSell: (index: number, coin: number) => void;
  isEvolving?: boolean;
  isSelling?: boolean;
}

export default function CardDetailModal({
  item,
  isOpen,
  onClose,
  onEvolve,
  onSell,
  isEvolving = false,
  isSelling = false,
}: Readonly<CardDetailModalProps>) {
  const [showEvolutionSection, setShowEvolutionSection] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      globalThis.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      globalThis.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset evolution section when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Use a timeout to avoid setting state during render
      const timer = setTimeout(() => {
        setShowEvolutionSection(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const imgSrc = item.images?.[0]?.href || 'https://via.placeholder.com/300x300?text=Digimon';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-[#443c70] via-[#a76050] to-[#f1ba63] p-6 rounded-t-2xl">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Image */}
            <div className="w-40 h-40 shrink-0 rounded-xl bg-white/90 backdrop-blur-sm p-4 shadow-lg">
              <Image
                src={imgSrc}
                alt={item.name}
                width={160}
                height={160}
                className="w-full h-full object-contain"
                priority
              />
            </div>

            {/* Name & Category */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">{item.name}</h2>
              <p className="text-lg text-white/90 mb-4">{item.category}</p>

              {/* Stats badges */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full border border-white/30">
                  Level: {item.level}
                </span>
                {item.attribute && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full border border-white/30">
                    {item.attribute}
                  </span>
                )}
                {item.type && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full border border-white/30">
                    {item.type}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          {item.description && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{item.description}</p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Evolution */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <p className="text-xs text-blue-600 font-medium mb-1">Evolution</p>
              <p className="text-2xl font-bold text-blue-900">{item.evolution}</p>
            </div>

            {/* Starter Pack */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
              <p className="text-xs text-amber-600 font-medium mb-1">Starter Pack</p>
              <p className="text-2xl font-bold text-amber-900">{item.starterPack}</p>
            </div>
          </div>

          {/* Attribute */}
          {item.attribute && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Attribute</h3>
              <div className="inline-block bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg px-4 py-2">
                <p className="text-purple-900 font-semibold">{item.attribute}</p>
              </div>
            </div>
          )}

          {/* Fields */}
          {item.fields && item.fields.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Fields</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {item.fields.map((field) => (
                  <div
                    key={`field-${field.id}-${field.field}`}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {field.image && (
                        <Image
                          src={field.image}
                          alt={field.field}
                          width={32}
                          height={32}
                          className="w-8 h-8 object-contain"
                          loading="lazy"
                        />
                      )}
                      <p className="text-sm font-medium text-gray-700">{field.field}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Type Info */}
          {item.type && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Type</h3>
              <div className="inline-block bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg px-4 py-2">
                <p className="text-indigo-900 font-semibold">{item.type}</p>
              </div>
            </div>
          )}

          {/* Next Evolution */}
          {showEvolutionSection && item.nextEvolutions && item.nextEvolutions.length > 0 && (
            <div className="animate-scaleIn">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">Choose Evolution</h3>
                <button
                  onClick={() => setShowEvolutionSection(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {item.nextEvolutions.map((evolution) => (
                  <div
                    key={evolution.id}
                    className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 p-4 hover:shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    {/* Evolution Image */}
                    <div className="w-20 h-20 mx-auto mb-3 rounded-lg bg-white/80 backdrop-blur-sm p-2 shadow-sm">
                      <Image
                        src={evolution.image}
                        alt={evolution.digimon}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>

                    {/* Evolution Info */}
                    <div className="text-center mb-3">
                      <h4 className="font-bold text-green-900 text-lg mb-1">{evolution.digimon}</h4>
                      {evolution.condition && (
                        <p className="text-xs text-green-700 bg-green-100 rounded-full px-2 py-1 inline-block">
                          {evolution.condition}
                        </p>
                      )}
                    </div>

                    {/* Evolve Button */}
                    <button
                      onClick={() => {
                        onEvolve(item.id, evolution.id);
                        // Don't close modal immediately, let loading state show
                      }}
                      disabled={isEvolving}
                      className={`w-full ${
                        isEvolving
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg transform hover:scale-105'
                      } text-white font-bold py-2.5 px-4 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2`}
                    >
                      {isEvolving ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <span className="text-sm">Evolving...</span>
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm">Evolve to {evolution.digimon}</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            {/* Always show evolve button if there are next evolutions */}
            {item.nextEvolutions &&
              item.nextEvolutions.length > 0 &&
              (() => {
                const isDisabled = isEvolving || item.total < 3;
                let buttonClass = '';
                if (showEvolutionSection) {
                  buttonClass = 'bg-gradient-to-r from-gray-500 to-gray-600';
                } else if (isDisabled) {
                  buttonClass = 'bg-gray-400 cursor-not-allowed';
                } else {
                  buttonClass =
                    'bg-gradient-to-r from-[#443c70] to-[#a76050] hover:shadow-xl transform hover:scale-105';
                }

                return (
                  <button
                    onClick={() => setShowEvolutionSection(!showEvolutionSection)}
                    disabled={isDisabled}
                    className={`flex-1 ${buttonClass} text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transition-transform duration-200 ${showEvolutionSection ? 'rotate-180' : ''}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      {showEvolutionSection
                        ? 'Hide Evolutions'
                        : `Evolve (${item.nextEvolutions.length} options)`}
                    </span>
                  </button>
                );
              })()}

            <button
              onClick={() => {
                onSell?.(item.id, item.sellingDigimon);
                // Don't close modal immediately, let loading state show
              }}
              disabled={isSelling}
              className={`${
                item.nextEvolutions && item.nextEvolutions.length > 0 ? 'flex-1' : 'w-full'
              } ${
                isSelling
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#f1ba63] to-[#fbf39b] hover:shadow-xl transform hover:scale-105'
              } text-[#643c30] font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2`}
            >
              {isSelling ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Selling...</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Sell ({item.sellingDigimon} coins)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
