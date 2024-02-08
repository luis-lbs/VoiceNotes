import { Toaster, toast } from 'sonner'
import { NewNote } from './components/new-note'
import { Note, INote } from './components/note'
import { ChangeEvent, useState } from 'react'

export function Home() {
  const [query, setQuery] = useState<string>('')
  const [notes, setNotes] = useState<Array<INote>>(() => {
    const notesOnStore = localStorage.getItem('notes')
    if (notesOnStore) return JSON.parse(notesOnStore)
    return []
  })

  function handleSaveNote(note: INote) {
    setNotes((prev) => {
      const notesArray = [note, ...prev]
      localStorage.setItem('notes', JSON.stringify(notesArray))
      return notesArray
    })
    toast.success('Nova nota adicionada!')
  }

  function handleDeleteNote(noteId: string) {
    setNotes((prev) => {
      const notesArray = prev.filter((note) => note.id !== noteId)
      localStorage.setItem('notes', JSON.stringify(notesArray))
      return notesArray
    })
    toast(
      <div className="font-semibold">
        Uma nota foi <span className="text-red-500">DELETADA</span>
      </div>
    )
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value)
  }

  const filteredNotes =
    query !== ''
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(query.toLocaleLowerCase())
        )
      : notes

  return (
    <>
      <Toaster richColors position="bottom-right" />
      <div className="max-w-6xl mx-auto my-12 space-y-6 px-5 md-px0">
        <h2 className="text-lg text-slate-700 font-semibold">Voice Notes</h2>

        <form className="w-full ">
          <input
            type="text"
            className="w-full bg-transparent text-3xl font-semibold tracking-tighter placeholder:text-slate-500 outline-none"
            placeholder="Busque suas notas..."
            onChange={handleSearch}
          />
        </form>
        <div className="h-px w-full bg-slate-700" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px] w-full">
          <NewNote createNote={handleSaveNote} />
          {notes.length > 0 &&
            filteredNotes.map((note) => (
              <Note
                handleDeleteNote={handleDeleteNote}
                note={note}
                key={note.id}
              />
            ))}
        </div>
      </div>
    </>
  )
}
