import AnimeDiscoveryPage from '../components/AnimeDiscoveryPage';
import { fetchAllAnime } from '../store/thunks/animeThunks';

function All() {
  return (
    <AnimeDiscoveryPage 
      title="All Anime"
      fetchAnimeAction={fetchAllAnime}
      animeSelector={(state) => state.anime.allAnime}
    />
  );
}

export default All;