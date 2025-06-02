import React, { useEffect, useMemo, useRef, useState } from 'react';

interface Props {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  error?: string;
}

interface MapboxFeature {
  place_name: string;
  center: [number, number];
}

export const AddressAutocomplete: React.FC<Props> = ({
  value,
  onChange,
  placeholder = 'Address',
  error,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
    let handle: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<T>) => {
      if (handle) clearTimeout(handle);
      handle = setTimeout(() => fn(...args), delay);
    };
  }

  const fetchSuggestions = useMemo(() => {
    return debounce((query: string) => {
      if (!MAPBOX_TOKEN) {
        console.error('Missing VITE_MAPBOX_TOKEN');
        return;
      }
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const encoded = encodeURIComponent(query);
      const url =
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?` +
        `access_token=${MAPBOX_TOKEN}` +
        `&types=address&limit=5&language=en`;

      fetch(url, { signal: controller.signal })
        .then(async res => {
          if (!res.ok) throw new Error(res.statusText);
          const data = (await res.json()) as { features: MapboxFeature[] };
          const names = data.features.map(f => f.place_name);
          setSuggestions(Array.from(new Set(names)));
        })
        .catch(err => {
          if (err.name !== 'AbortError') console.error('Mapbox error:', err);
        });
    }, 300);
  }, [MAPBOX_TOKEN]);

  useEffect(() => {
    const q = value.trim();
    if (q.length >= 3) {
      fetchSuggestions(q);
    } else {
      setSuggestions([]);
      if (abortRef.current) abortRef.current.abort();
    }
  }, [value, fetchSuggestions]);

  return (
    <div className='relative'>
      <input
        type='text'
        value={value}
        onChange={e => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          setTimeout(() => setIsOpen(false), 200);
        }}
        placeholder={placeholder}
        className={`border px-3 py-2 w-full rounded ${
          error ? 'border-red-500' : 'border-gray-300'
        } focus:ring-indigo-300`}
      />
      {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}

      {isOpen && suggestions.length > 0 && (
        <ul className='absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto'>
          {suggestions.map(place => (
            <li
              key={place}
              onClick={() => {
                onChange(place);
                setSuggestions([]);
                setIsOpen(false);
              }}
              className='px-2 py-1 hover:bg-gray-100 cursor-pointer'>
              {place}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
