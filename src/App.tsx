import { NewNote } from './components/new-note'
import { Note } from './components/note'

export function App() {
  return (
    <div className="max-w-6xl mx-auto my-12 space-y-6">
      <h2 className="text-lg text-slate-700 font-semibold">Voice Notes</h2>

      <form className="w-full ">
        <input
          type="text"
          className="w-full bg-transparent text-3xl font-semibold tracking-tighter placeholder:text-slate-500 outline-none"
          placeholder="Busque suas notas..."
        />
      </form>
      <div className="h-px w-full bg-slate-700" />

      <div className="grid grid-cols-3 gap-6 auto-rows-[250px] w-full">
        <NewNote />
        {Array.from({ length: 4 }).map((_, i) => (
          <Note key={i} />
        ))}
      </div>
    </div>
  )
}
