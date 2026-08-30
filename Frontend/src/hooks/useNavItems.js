import { useEffect, useState } from 'react';
import { NAV_ITEMS } from '../data/navigation';
import { fetchNav } from '../utils/contentApi';

// DB-backed nav with the static NAV_ITEMS as the in-memory fallback if the
// fetch fails or returns nothing - nav must never go blank.
export default function useNavItems() {
  const [navItems, setNavItems] = useState(NAV_ITEMS);

  useEffect(() => {
    let cancelled = false;

    fetchNav()
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setNavItems(data);
        }
      })
      .catch(() => {
        // Keep the static fallback.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return navItems;
}
