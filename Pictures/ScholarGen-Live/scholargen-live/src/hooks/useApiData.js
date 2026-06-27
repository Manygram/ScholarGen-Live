// Tiny data-fetching hook with loading/error state and cleanup.
//
// Screens use this to pull live data from the API while keeping a local
// fallback, so the UI degrades gracefully when the user is offline or an
// endpoint returns no rows yet.
import { useEffect, useState } from 'react';

export function useApiData(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.resolve()
      .then(fetcher)
      .then((result) => {
        if (active) {
          setData(result);
          setError(null);
        }
      })
      .catch((e) => {
        if (active) setError(e);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
