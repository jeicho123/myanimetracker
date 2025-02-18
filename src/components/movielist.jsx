import * as React from "react"
import MovieCard from "./moviecard"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination"

// type Movie = {
//   id: number
//   title: string
//   year: number
//   poster: string
// }

// type MovieListProps = {
//   movies: Movie[]
//   onAddMovie?: (movie: Movie) => void
// }

export default function MovieList({ movies, onAddMovie, onDeleteMovie, uid }) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const moviesPerPage = 10
  
  if (movies.length === 0) {
    return <p className="text-center text-black mt-4">No movies found.</p>
  }

  const indexOfLastMovie = currentPage * moviesPerPage
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie)
  const totalPages = Math.ceil(movies.length / moviesPerPage)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {currentMovies.map((movie) => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            onAddMovie={onAddMovie} 
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
