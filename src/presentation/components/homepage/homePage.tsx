'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import STARTER_PACK_ITEMS, { Cateogory, Type } from '@/presentation/hooks/constant';
import StarterPack from '@components/staterpack/staterPack';
import useLocalStorage from '@hooks/useLocalStorage';
import { DetailDigimonRepository } from '@/core/repositories/myCardRepository';
import { ListMyCard } from '@/core/usecases/myCard';
import Card from '@components/listcard/card';
import CardDetailModal from '@components/listcard/CardDetailModal';
import { ProfileRepository } from '@/core/repositories/profile';
import { ListGatcha } from '@/core/usecases/listGatcha';
import EmptyState from '@components/EmptyState';
import FilterSection from '@components/FilterSection';
import Header from '@components/Header';
import Toast from '@components/Toast';

export default function HomePage() {
  const usecase = useMemo(() => new ListMyCard(), []);
  const [Profile, setProfile] = useLocalStorage<ProfileRepository>(
    'Profile',
    {} as ProfileRepository,
  );
  const [MyCards, setMyCards] = useLocalStorage<DetailDigimonRepository[]>('MyCard', []);
  const [ListMyCards, setListMyCards] = useState<DetailDigimonRepository[]>([]);
  const [displayedCards, setDisplayedCards] = useState<DetailDigimonRepository[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isDropdownCategory, setisDropdownCategory] = useState(false);
  const [isDropdownType, setisDropdownType] = useState(false);
  const [selectedCard, setSelectedCard] = useState<DetailDigimonRepository | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [indexSelected, setIndex] = useState(0);
  const [filterBy, setFilterBy] = useState({ none: 'Active', category: '', type: '' });
  const [isEvolving, setIsEvolving] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  const [isBuying, setIsBuying] = useState<number | null>(null); // Track which pack is being bought
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [showToast, setShowToast] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const CARDS_PER_PAGE = 20;

  useEffect(() => {
    // Use setTimeout to avoid synchronous setState during effect
    const timer = setTimeout(async () => {
      const groupedCards = await usecase.getListMyCard(MyCards, filterBy.category, filterBy.type);
      setListMyCards(groupedCards);

      // Reset pagination and load first batch
      const firstBatch = groupedCards.slice(0, CARDS_PER_PAGE);
      setDisplayedCards(firstBatch);
      setHasMore(groupedCards.length > CARDS_PER_PAGE);
    }, 0);

    return () => clearTimeout(timer);
  }, [MyCards, filterBy.category, filterBy.type, usecase]);

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

      const evoledCard = await usecase.digimonEvolution(MyCards, id, nextEvolution);
      setMyCards(evoledCard);

      // Success feedback with slight delay, then close modal
      setTimeout(() => {
        setIsEvolving(false);
        setIsModalOpen(false); // Close modal after evolution completes
      }, 300);
    } catch (error) {
      // Evolution failed - reset loading state
      setIsEvolving(false);
    }
  };

  const handleSell = async (id: number, coin: number) => {
    setIsSelling(true);
    try {
      // Add delay for smooth loading experience
      await new Promise((resolve) => setTimeout(resolve, 600));

      const sellCard = usecase.sellDigimon(MyCards, id);
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
      // Sell failed - reset loading state
      setIsSelling(false);
    }
  };

  const handleBuyPack = async (pack: (typeof STARTER_PACK_ITEMS)[0]) => {
    // Check if user has enough coins
    const currentCoins = Profile?.coin || 0;

    if (currentCoins < pack.price) {
      setToastMessage(
        `Not enough coins! You need ${pack.price} coins but only have ${currentCoins} coins.`,
      );
      setToastType('error');
      setShowToast(true);
      return;
    }

    // Set loading state for this specific pack
    setIsBuying(pack.id);

    try {
      // Add 1 second delay for loading effect
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const data = await new ListGatcha().getListGacha(pack.type);
      await setMyCards([...MyCards, ...data]);

      // Deduct coins
      const newCoins = currentCoins - pack.price;
      setProfile({ ...Profile, coin: newCoins });

      // Success feedback with toast notification
      setToastMessage(
        `Successfully purchased ${pack.name}! You received ${data.length} new cards.`,
      );
      setToastType('success');
      setShowToast(true);

      // Reset loading state with slight delay
      setTimeout(() => {
        setIsBuying(null);
      }, 300);
    } catch (error) {
      // Buy pack failed - show error toast
      setToastMessage('Failed to purchase starter pack. Please try again.');
      setToastType('error');
      setShowToast(true);
      setIsBuying(null);
    }
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
      setisDropdownCategory(false);
      setisDropdownType(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#443c70] via-[#a76050] to-[#f1ba63] relative overflow-hidden">
      {/* Content wrapper with backdrop */}
      <div className="relative z-10 p-6 md:p-12">
        {/* Header with glass effect */}
        <Header
          userName={Profile?.name || 'User'}
          title="Starter Packs"
          coins={Profile?.coin || 0}
          showCoins={true}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-16">
          {STARTER_PACK_ITEMS.map((item) => (
            <StarterPack
              key={item.id}
              item={item}
              onBuy={handleBuyPack}
              isLoading={isBuying === item.id}
            />
          ))}
        </div>
        <div className="mt-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">My Cards</h1>
          <FilterSection
            filterBy={filterBy}
            isDropdownCategory={isDropdownCategory}
            isDropdownType={isDropdownType}
            categories={Cateogory}
            types={Type}
            onFilterChange={handleFilterBy}
            onToggleCategory={() => setisDropdownCategory(!isDropdownCategory)}
            onToggleType={() => setisDropdownType(!isDropdownType)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedCards.map((item, index) => (
            <Card key={item.id} item={item} onClick={() => handleCardClick(item, index)} />
          ))}
        </div>

        {/* Empty State */}
        {displayedCards.length === 0 && !hasMore && (
          <EmptyState
            title="No Cards Yet!"
            description="Your collection is empty. Start your Digimon journey by purchasing a starter pack above!"
            actionText="Scroll up to buy a pack"
            totalPacks={STARTER_PACK_ITEMS.length}
            cardsPerPack="5-10"
            userCoins={Profile?.coin || 0}
          />
        )}
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

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={3000}
      />
    </div>
  );
}
