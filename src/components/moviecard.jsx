import { Button } from "@/components/ui/button"

// type Movie = {
//   id: number
//   title: string
//   year: number
//   poster: string
// }

// type MovieCardProps = {
//   movie: Movie
//   onAddMovie?: (movie: Movie) => void
// }

export default function MovieCard({ movie, onAddMovie, onDeleteMovie, uid }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-[250px] flex flex-col">
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-[300px] object-cover"
      />
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-semibold text-lg mb-2">{movie.title}</h3>
          <p className="text-gray-600">{movie.year}</p>
        </div>
        <div className="mt-4">
          {onAddMovie && (
            <Button onClick={() => onAddMovie(movie)} className="w-full">
              Add to Watched
            </Button>
          )}
          {onDeleteMovie && (
            <Button variant="destructive" onClick={() => onDeleteMovie(movie.docId)} className="w-full">
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

