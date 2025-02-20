import AnimeDiscoveryPage from '../components/AnimeDiscoveryPage';
import { fetchPopularAnime } from '../store/thunks/animeThunks';

function Popular() {
  return (
    <AnimeDiscoveryPage 
      title="Popular Anime"
      fetchAnimeAction={fetchPopularAnime}
      animeSelector={(state) => state.anime.popularAnime}
    />
  );
}

export default Popular;