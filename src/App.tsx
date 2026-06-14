// 旅スポ アプリ全体の画面構成と状態管理。
// 起動時に現在地を取得 → 観光・グルメ両方を自動検索 → 初期は観光タブ（FR-1,2,3 / D-16）。
import { useEffect, useRef, useState } from 'react';
import type { CategoryId } from './types/place';
import { CATEGORIES, DEFAULT_CATEGORY_ID, getCategory } from './config/categories';
import { DEFAULT_RADIUS_METERS } from './config/searchOptions';
import { useGeolocation } from './hooks/useGeolocation';
import { useNearbySearch } from './hooks/useNearbySearch';
import { useFavorites } from './hooks/useFavorites';
import { CategoryTabs, type ActiveView } from './components/CategoryTabs';
import { SubcategoryFilter } from './components/SubcategoryFilter';
import { RadiusSelector } from './components/RadiusSelector';
import { OpenNowToggle } from './components/OpenNowToggle';
import { LocationInput } from './components/LocationInput';
import { SpotList } from './components/SpotList';
import { FavoritesView } from './components/FavoritesView';
import { Loading } from './components/states/Loading';
import { EmptyState } from './components/states/EmptyState';
import { ErrorRetry } from './components/states/ErrorRetry';
import styles from './App.module.css';

type SubSelections = Record<CategoryId, string | null>;

export default function App() {
  const geo = useGeolocation();
  const { results, search } = useNearbySearch();
  const favorites = useFavorites();

  const [activeView, setActiveView] = useState<ActiveView>(DEFAULT_CATEGORY_ID);
  const [radiusMeters, setRadiusMeters] = useState(DEFAULT_RADIUS_METERS);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [subSelections, setSubSelections] = useState<SubSelections>({
    sightseeing: null,
    gourmet: null,
  });
  const [locationLabel, setLocationLabel] = useState<string | null>(null);

  // 細分類の最新値を、検索エフェクトから参照するための ref
  const subRef = useRef<SubSelections>(subSelections);
  subRef.current = subSelections;

  // 起動時に現在地を取得（FR-1）
  useEffect(() => {
    geo.requestLocation();
  }, [geo.requestLocation]);

  // 現在地確定 / 全体フィルタ（半径・営業中）変更時に、両カテゴリを再検索（FR-3 / FR-8 / FR-9）
  useEffect(() => {
    if (!geo.coords) return;
    for (const c of CATEGORIES) {
      search(geo.coords, c.id, {
        subcategoryId: subRef.current[c.id],
        radiusMeters,
        openNowOnly,
      });
    }
  }, [geo.coords, radiusMeters, openNowOnly, search]);

  function handleManualLocation(coords: { lat: number; lng: number }, label: string) {
    setLocationLabel(label);
    geo.setManualCoords(coords);
  }

  function handleSubcategoryChange(categoryId: CategoryId, subId: string | null) {
    setSubSelections((prev) => ({ ...prev, [categoryId]: subId }));
    if (geo.coords) {
      search(geo.coords, categoryId, { subcategoryId: subId, radiusMeters, openNowOnly });
    }
  }

  function handleRetry(categoryId: CategoryId) {
    if (geo.coords) {
      search(geo.coords, categoryId, {
        subcategoryId: subSelections[categoryId],
        radiusMeters,
        openNowOnly,
      });
    }
  }

  const showMain = geo.status === 'success' && geo.coords;

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.logo} aria-hidden="true">
            🧳
          </span>
          <div>
            <h1 className={styles.title}>旅スポ</h1>
            <p className={styles.subtitle}>旅先の「いま行ける」を、すぐ見つける</p>
          </div>
        </div>
        {showMain && (
          <p className={styles.location} data-testid="location-label">
            📍 {locationLabel ? `${locationLabel} 周辺` : '現在地周辺'}
            {' ・ '}
            <button
              type="button"
              className={styles.relocate}
              onClick={() => {
                setLocationLabel(null);
                geo.requestLocation();
              }}
            >
              現在地を再取得
            </button>
          </p>
        )}
      </header>

      <main className={styles.main}>
        {geo.status === 'idle' || geo.status === 'loading' ? (
          <Loading label="現在地を取得しています…" />
        ) : geo.status === 'error' ? (
          <div className={styles.section}>
            <LocationInput
              notice={`${geo.errorMessage ?? '現在地を取得できませんでした。'} 地名・住所を入力して探せます。`}
              onResolved={handleManualLocation}
            />
            <div className={styles.retryRow}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => geo.requestLocation()}
                data-testid="retry-location"
              >
                現在地の取得を再試行
              </button>
            </div>
          </div>
        ) : (
          <>
            <CategoryTabs
              active={activeView}
              favoritesCount={favorites.favorites.length}
              onChange={setActiveView}
            />

            {activeView === 'favorites' ? (
              <FavoritesView favorites={favorites.favorites} onRemove={favorites.remove} />
            ) : (
              <ActiveCategoryPanel
                categoryId={activeView}
                subSelections={subSelections}
                radiusMeters={radiusMeters}
                openNowOnly={openNowOnly}
                resultState={results[activeView]}
                onSubcategoryChange={handleSubcategoryChange}
                onRadiusChange={setRadiusMeters}
                onOpenNowChange={setOpenNowOnly}
                onRetry={() => handleRetry(activeView)}
                isFavorite={favorites.isFavorite}
                onToggleFavorite={favorites.toggle}
              />
            )}
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <span>データ提供: Google Places</span>
      </footer>
    </div>
  );
}

interface PanelProps {
  categoryId: CategoryId;
  subSelections: SubSelections;
  radiusMeters: number;
  openNowOnly: boolean;
  resultState: import('./types/place').CategoryResultState;
  onSubcategoryChange: (categoryId: CategoryId, subId: string | null) => void;
  onRadiusChange: (meters: number) => void;
  onOpenNowChange: (checked: boolean) => void;
  onRetry: () => void;
  isFavorite: (placeId: string) => boolean;
  onToggleFavorite: (spot: import('./types/place').Spot) => void;
}

function ActiveCategoryPanel({
  categoryId,
  subSelections,
  radiusMeters,
  openNowOnly,
  resultState,
  onSubcategoryChange,
  onRadiusChange,
  onOpenNowChange,
  onRetry,
  isFavorite,
  onToggleFavorite,
}: PanelProps) {
  const category = getCategory(categoryId);
  return (
    <section className={styles.section} aria-label={`${category.label}の検索結果`}>
      <SubcategoryFilter
        category={category}
        selectedId={subSelections[categoryId]}
        onSelect={(subId) => onSubcategoryChange(categoryId, subId)}
      />

      <div className={styles.controls}>
        <RadiusSelector value={radiusMeters} onChange={onRadiusChange} />
        <OpenNowToggle checked={openNowOnly} onChange={onOpenNowChange} />
      </div>

      {resultState.status === 'loading' && <Loading />}
      {resultState.status === 'empty' && (
        <EmptyState hint="検索範囲を広げる・絞り込みを「すべて」にすると見つかりやすくなります。" />
      )}
      {resultState.status === 'error' && (
        <ErrorRetry message={resultState.errorMessage} onRetry={onRetry} />
      )}
      {resultState.status === 'success' && (
        <SpotList
          spots={resultState.spots}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </section>
  );
}
