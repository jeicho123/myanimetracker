import AnimeListPage from '../components/AnimeListPage';
import { fetchWatchedAnime } from '../store/thunks/animeThunks';

function Watched() {
  return (
    <AnimeListPage 
      title="Watched"
      fetchAnimeAction={fetchWatchedAnime}
      animeSelector={(state) => state.anime.watchedAnime}
    />
  );
}

export default Watched;