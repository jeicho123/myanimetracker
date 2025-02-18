import { Input } from "@/components/ui/input"

export default function SearchBar({ onSearch, value }) {
  return (
    <div className="max-w-md">
      <Input
        type="text"
        placeholder="Search movies..."
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full border-foreground/25 focus:border-foreground/50"
      />
    </div>
  )
}