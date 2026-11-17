import { Search } from 'lucide-react'

interface UserSearchProps {
  value: string
  onChange: (value: string) => void
}

export function UserSearch({ value, onChange }: UserSearchProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="user-search" className="text-sm font-medium text-ink">
        Search users
      </label>
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
          strokeWidth={1.75}
        />
        <input
          id="user-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search by name"
          autoComplete="off"
          className="h-10 w-full rounded-lg border border-line-strong bg-surface pr-3 pl-9 text-base text-ink transition-colors placeholder:text-muted focus:border-accent"
        />
      </div>
    </div>
  )
}
