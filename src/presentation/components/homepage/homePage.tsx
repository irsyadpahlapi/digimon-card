'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import STARTER_PACK_ITEMS, { Cateogory } from '@/presentation/hooks/constant';
import StarterPack from '@components/staterpack/staterPack';
import useLocalStorage from '@hooks/useLocalStorage';
import { DetailDigimonRepository } from '@/core/repositories/myCardRepository';
import { ListMyCard } from '@/core/usecases/myCard';
import Card from '@components/listcard/card';
import CardDetailModal from '@components/listcard/CardDetailModal';
import { ProfileRepository } from '@/core/repositories/profile';
import { ListGatcha } from '@/core/usecases/listGatcha';

export default function HomePage() {
  const usecase = new ListMyCard();
  const [Profile, setProfile] = useLocalStorage<ProfileRepository>(
    'Profile',
    {} as ProfileRepository,
  );
  const [MyCards, setMyCards] = useLocalStorage<DetailDigimonRepository[]>('MyCard', []);
  const [ListMyCards, setListMyCards] = useState<DetailDigimonRepository[]>([]);
  const [displayedCards, setDisplayedCards] = useState<DetailDigimonRepository[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isDropdownCategory, setisDropdownCategory] = useState(false);
  const [isDropdownType, setisDropdownType] = useState(false);
  const [selectedCard, setSelectedCard] = useState<DetailDigimonRepository | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [indexSelected, setIndex] = useState(0);
  const [filterBy, setFilterBy] = useState({ none: 'Active', category: '', type: '' });
  const [isEvolving, setIsEvolving] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const CARDS_PER_PAGE = 20;

  useEffect(() => {
    fetchStarterpack();
  }, [MyCards, filterBy]);

  const fetchStarterpack = async () => {
    const groupedCards = await usecase.getListMyCard(MyCards, filterBy.category, filterBy.type);
    setListMyCards(groupedCards);

    // Reset pagination and load first batch
    setPage(1);
    const firstBatch = groupedCards.slice(0, CARDS_PER_PAGE);
    setDisplayedCards(firstBatch);
    setHasMore(groupedCards.length > CARDS_PER_PAGE);
  };

  const loadMoreCards = useCallback(() => {
    if (!hasMore || displayedCards.length >= ListMyCards.length) {
      setHasMore(false);
      return;
    }

    const startIndex = displayedCards.length;
    const endIndex = startIndex + CARDS_PER_PAGE;
    const newCards = ListMyCards.slice(startIndex, endIndex);

    if (newCards.length > 0) {
      setDisplayedCards((prev) => [...prev, ...newCards]);
      setHasMore(endIndex < ListMyCards.length);
    } else {
      setHasMore(false);
    }
  }, [displayedCards.length, ListMyCards, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreCards();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadMoreCards]);

  const handleCardClick = (item: DetailDigimonRepository, index: number) => {
    setSelectedCard(item);
    setIsModalOpen(true);
    setIndex(index);
  };

  const handleEvolve = async (id: number, nextEvolution: number) => {
    setIsEvolving(true);
    try {
      // Add delay for smooth loading experience
      await new Promise((resolve) => setTimeout(resolve, 800));

      let evoledCard = await usecase.digimonEvolution(MyCards, id, nextEvolution);
      setMyCards(evoledCard);

      // Success feedback with slight delay, then close modal
      setTimeout(() => {
        setIsEvolving(false);
        setIsModalOpen(false); // Close modal after evolution completes
      }, 300);
    } catch (error) {
      console.error('Evolution failed:', error);
      setIsEvolving(false);
    }
  };

  const handleSell = async (id: number, coin: number) => {
    setIsSelling(true);
    try {
      // Add delay for smooth loading experience
      await new Promise((resolve) => setTimeout(resolve, 600));

      let sellCard = usecase.sellDigimon(MyCards, id);
      setMyCards(sellCard);
      setProfile({
        ...Profile,
        coin: Profile.coin + coin,
      });

      // Success feedback with slight delay, then close modal
      setTimeout(() => {
        setIsSelling(false);
        setIsModalOpen(false); // Close modal after sell completes
      }, 300);
    } catch (error) {
      console.error('Sell failed:', error);
      setIsSelling(false);
    }
  };

  const handleBuyPack = async (pack: (typeof STARTER_PACK_ITEMS)[0]) => {
    // Check if user has enough coins
    const currentCoins = Profile?.coin || 0;

    if (currentCoins < pack.price) {
      alert(`Not enough coins! You need ${pack.price} coins but only have ${currentCoins} coins.`);
      return;
    }

    const data = await new ListGatcha().getListGacha(pack.type);
    await setMyCards([...MyCards, ...data]);

    // Deduct coins
    const newCoins = currentCoins - pack.price;
    setProfile({ ...Profile, coin: newCoins });
  };

  const handleFilterBy = (key: string, value: string) => {
    if (key !== 'none') {
      setFilterBy({
        ...filterBy,
        [key]: value,
        none: '',
      });
    } else {
      setFilterBy({
        ...filterBy,
        [key]: value,
        category: '',
        type: '',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#443c70] via-[#a76050] to-[#f1ba63] relative overflow-hidden">
      {/* Animated Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#fbf39b] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-40 right-10 w-64 h-64 bg-[#d1c9bc] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-[#643c30] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      {/* Content wrapper with backdrop */}
      <div className="relative z-10 p-6 md:p-12">
        {/* Header with glass effect */}
        <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-6 mb-8 shadow-xl border border-white/20">
          <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#443c70] to-[#a76050] bg-clip-text text-transparent flex justify-end mb-4 mr-2">
            Hi, {Profile.name}
          </div>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#443c70] to-[#a76050] bg-clip-text text-transparent">
              Starter Packs
            </h1>
            <div className="flex items-center gap-2 bg-gradient-to-r from-[#f1ba63] to-[#fbf39b] px-4 py-2 rounded-full shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#643c30]"
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
              <h2 className="text-xl md:text-2xl font-bold text-[#643c30]">{Profile.coin} Coins</h2>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {STARTER_PACK_ITEMS.map((item) => (
            <StarterPack key={item.id} item={item} onBuy={handleBuyPack} />
          ))}
        </div>
        <div className="mt-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">My Cards</h1>
          <div className="flex justify-between flex-wrap mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Filter By</h2>
            <div className="flex items-baseline gap-4">
              <button
                type="button"
                onClick={() => handleFilterBy('none', 'Active')}
                className={`text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800  ${filterBy.none ? 'bg-blue-700 text-white hover:bg-blue-800' : 'bg-white'}`}
              >
                None
              </button>

              <div className="relative inline-block">
                <button
                  onClick={() => setisDropdownCategory(!isDropdownCategory)}
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
                      {Cateogory.map((category) => (
                        <li key={category}>
                          <button
                            onClick={() => {
                              handleFilterBy('category', category);
                              setisDropdownCategory(false);
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
              <div className="relative inline-block">
                <button
                  onClick={() => setisDropdownType(!isDropdownType)}
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
                      <li>
                        <button
                          onClick={() => {
                            // Handle category selection
                            setisDropdownType(false);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          All Categories
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            // Handle category selection
                            handleFilterBy('type', 'Rookie');
                            setisDropdownType(false);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Rookie
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            // Handle category selection
                            setisDropdownType(false);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Champion
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            // Handle category selection
                            setisDropdownType(false);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Ultimate
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedCards.map((item, index) => (
            <Card key={item.id} item={item} onClick={() => handleCardClick(item, index)} />
          ))}
        </div>

        {/* Loading indicator & Observer target */}
        {hasMore && (
          <div ref={observerTarget} className="flex justify-center items-center py-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-4 border-[#443c70] border-t-transparent rounded-full animate-spin" />
              <p className="text-lg font-medium text-white/90">Loading more cards...</p>
            </div>
          </div>
        )}

        {!hasMore && displayedCards.length > 0 && (
          <div className="text-center py-8">
            <p className="text-lg font-medium text-white/90">
              All cards loaded ({displayedCards.length} total)
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <CardDetailModal
        item={selectedCard}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEvolve={handleEvolve}
        onSell={handleSell}
        index={indexSelected}
        isEvolving={isEvolving}
        isSelling={isSelling}
      />
    </div>
  );
}
