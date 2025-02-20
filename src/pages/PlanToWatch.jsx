import AnimeListPage from '../components/AnimeListPage';
import { fetchToWatchAnime } from '../store/thunks/animeThunks';

function PlanToWatch() {
  return (
    <AnimeListPage 
      title="Plan to Watch"
      fetchAnimeAction={fetchToWatchAnime}
      animeSelector={(state) => state.anime.toWatchAnime}
    />
  );
}

export default PlanToWatch;