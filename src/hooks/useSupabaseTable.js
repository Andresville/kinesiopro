import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

/**
 * Fetches all rows of a Supabase table once, centralizing the
 * loading/error/data pattern that was duplicated across views.
 * `notNull` (optional) excludes rows where that column is null.
 */
export function useSupabaseTable(table, { notNull } = {}) {
  const [state, setState] = useState({ data: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;

    let query = supabase.from(table).select('*');
    if (notNull) query = query.not(notNull, 'is', null);

    query.then(({ data, error }) => {
      if (cancelled) return;
      setState({ data: error ? [] : data, loading: false, error: error ?? null });
    });

    return () => {
      cancelled = true;
    };
  }, [table, notNull]);

  return state;
}
