import React, { useEffect, useMemo, useState } from 'react';
import ProductCard from '../../components/marketplace/ProductCard';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/useToast';
import { addToCart } from '../../lib/cart';
import CategoryChips from '../../components/filters/CategoryChips';
import PriceRange from '../../components/filters/PriceRange';
import SortSelect from '../../components/filters/SortSelect';
import RecentCarousel from '../../components/RecentCarousel';
import { PRODUCTS } from '../../lib/products';
import Seo from '../../components/Seo';
import {
  applyFilters,
  slicePage,
  parseQuery,
  stringifyQuery,
  FilterState,
} from '../../lib/catalogFilter';
import { useLocation, useNavigate } from 'react-router-dom';
import { seedProducts } from '../../lib/search';

const allItems = PRODUCTS.map(p => ({
  id: p.id,
  name: p.name,
  price: p.baseNatur,
  category: p.category,
  createdAt: p.createdAt,
  img: p.img,
}));

const categories = Array.from(new Set(allItems.map(i => i.category)));

export default function MarketplacePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [state, setState] = useState<FilterState>(() => parseQuery(location.search));
  const [searchInput, setSearchInput] = useState(state.q);
  const [pageSize, setPageSize] = useState(() => (window.innerWidth < 640 ? 12 : 24));
  const toast = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedProducts();
  }, []);

  useEffect(() => {
    const onResize = () => setPageSize(window.innerWidth < 640 ? 12 : 24);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // sync URL
  useEffect(() => {
    const search = stringifyQuery(state);
    if (search !== location.search) navigate({ search }, { replace: true });
  }, [state, location.search, navigate]);

  // respond to back/forward
  useEffect(() => {
    const parsed = parseQuery(location.search);
    setState(prev => {
      const prevQ = stringifyQuery(prev);
      return prevQ === location.search ? prev : parsed;
    });
  }, [location.search]);

  // debounce search input to state
  useEffect(() => {
    const t = setTimeout(() => {
      setState(prev => ({ ...prev, q: searchInput, page: 1 }));
    }, 250);
    return () => clearTimeout(t);
  }, [searchInput]);

  // telemetry for filter changes
  useEffect(() => {
    const t = setTimeout(() => {
      const { q, cats, min, max, sort } = state;
      console.log('mp_filter_change', { q, cats, min, max, sort });
    }, 250);
    return () => clearTimeout(t);
  }, [state.q, state.cats, state.min, state.max, state.sort]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, [state]);

  const filtered = useMemo(() => {
    try {
      return applyFilters(allItems, state);
    } catch (e) {
      toast.error("We couldn't load products.");
      return [];
    }
  }, [state, toast]);

  useEffect(() => {
    console.log('mp_result_count', { count: filtered.length });
  }, [filtered.length]);

  const { pageItems, pages } = useMemo(
    () => slicePage(filtered, state.page, pageSize),
    [filtered, state.page, pageSize],
  );

  useEffect(() => {
    if (state.page > pages) setState(prev => ({ ...prev, page: pages }));
  }, [pages, state.page]);

  const handleUpdate = (next: Partial<FilterState>) => {
    setState(prev => ({ ...prev, ...next, page: 1 }));
  };

  const handlePage = (p: number) => {
    setState(prev => ({ ...prev, page: p }));
    console.log('mp_page_change', { page: p });
  };

  const reset = () => {
    const base = { q: '', cats: [], min: 0, max: Infinity, sort: 'relevance', page: 1 };
    setState(base);
    setSearchInput('');
  };

  return (
    <>
      <Seo title="Marketplace" description="Browse products on The Naturverse" />
      <div className="page-container">
      <div className="filters-bar">
        <input
          type="search"
          placeholder="Search Naturverse…"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
        <SortSelect value={state.sort} onChange={v => handleUpdate({ sort: v })} />
      </div>
      <div className="filters-side">
        <CategoryChips
          categories={categories}
          selected={state.cats}
          onChange={cats => handleUpdate({ cats })}
        />
        <PriceRange
          min={state.min}
          max={state.max}
          onChange={(min, max) => handleUpdate({ min, max })}
        />
      </div>
      <RecentCarousel />
      {loading ? (
        <div className="grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : pageItems.length ? (
        <>
          <p className="results-count">Showing {pageItems.length} of {filtered.length}</p>
          <div className="grid">
            {pageItems.map(item => (
              <div key={item.id} className="card">
                <ProductCard item={item} />
                <button
                  className="button"
                  style={{ marginTop: '8px' }}
                  onClick={() =>
                    addToCart({ id: item.id, name: item.name, price: item.price, image: item.img, qty: 1 })
                  }
                >
                  Add to cart
                </button>
              </div>
            ))}
          </div>
          <Pagination page={state.page} pages={pages} onChange={handlePage} />
        </>
      ) : (
        <div className="empty">
          <p>No matches. Try clearing filters.</p>
          <button onClick={reset}>Reset</button>
        </div>
      )}
      </div>
    </>
  );
}
