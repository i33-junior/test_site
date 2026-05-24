import { useState, useEffect } from 'react';
import { api } from '../api';

export function useContent(section) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getContent(section).then(setData).catch(console.error).finally(() => setLoading(false));
  }, [section]);

  return { data, loading, setData };
}

export function useAllContent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAllContent().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
