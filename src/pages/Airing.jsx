import AnimeDiscoveryPage from '../components/AnimeDiscoveryPage';
import { fetchAiringAnime } from '../store/thunks/animeThunks';

function Airing() {
  return (
    <AnimeDiscoveryPage 
      title="Airing Anime"
      fetchAnimeAction={fetchAiringAnime}
      animeSelector={(state) => state.anime.airingAnime}
    />
  );
}

export default Airing;