import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';

export const useAnimeSearch = (animeList) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(animeList);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    setSearchResults(animeList);
  }, [animeList]);

  useEffect(() => {
    if (debouncedSearchQuery) {
      const results = animeList.filter((anime) => 
        anime.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults(animeList);
    }
  }, [debouncedSearchQuery, animeList]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return {
    searchQuery,
    searchResults,
    handleSearch
  };
}; 