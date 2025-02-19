import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function MovieCard({ movie, onAddMovie, onDeleteMovie, uid }) {
  const [selectedStatus, setSelectedStatus] = useState(null);

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
            <>
              <select
                className="w-full p-2 mb-2 border rounded-md"
                onChange={(e) => setSelectedStatus(e.target.value)}
                value={selectedStatus || ""}
              >
                <option value="" disabled>Add to list...</option>
                <option value="watched">Watched</option>
                <option value="watching">Currently Watching</option>
                <option value="plantowatch">Want to Watch</option>
              </select>
              {selectedStatus && (
                <Button 
                  className="w-full mb-2" 
                  onClick={() => {
                    onAddMovie(movie, selectedStatus);
                    setSelectedStatus("");
                  }}
                >
                  Add to {selectedStatus}
                </Button>
              )}
            </>
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