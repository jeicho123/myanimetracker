import * as React from "react"
import MovieCard from "./MovieCard"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination"

export default function MovieList({ movies, onAddMovie, onDeleteMovie, onSwitchMovie, uid }) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const moviesPerPage = 10
  const indexOfLastMovie = currentPage * moviesPerPage
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie)
  const totalPages = Math.ceil(movies.length / moviesPerPage)

  React.useEffect(() => {
    setCurrentPage(1);
  }, [movies]);

  if (movies.length === 0) {
    return <p className="text-center text-black mt-4">No movies found.</p>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {currentMovies.map((movie) => (
          <MovieCard 
            key={`${movie.id}-${movie.title}`}
            movie={movie} 
            onAddMovie={onAddMovie} 
            onSwitchMovie={onSwitchMovie}
            onDeleteMovie={onDeleteMovie} 
            uid={uid} 
          />
        ))}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index + 1}>
              <PaginationLink
                onClick={() => setCurrentPage(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
