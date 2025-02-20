import AnimeListPage from '../components/AnimeListPage';
import { fetchCurrWatchingAnime } from '../store/thunks/animeThunks';

function Watching() {
  return (
    <AnimeListPage 
      title="Currently Watching"
      fetchAnimeAction={fetchCurrWatchingAnime}
      animeSelector={(state) => state.anime.currWatchingAnime}
    />
  );
}

export default Watching;