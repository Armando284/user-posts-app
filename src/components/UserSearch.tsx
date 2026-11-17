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
      <input
        id="user-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by name"
        autoComplete="off"
        className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-base text-ink transition-colors placeholder:text-muted focus:border-accent"
      />
    </div>
  )
}
