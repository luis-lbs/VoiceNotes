import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, useState } from 'react'
import { INote } from './note'

interface NewNoteProps {
  createNote: (note: INote) => void
}

let speechRecognition: SpeechRecognition | null

export function NewNote({ createNote }: NewNoteProps) {
  const [showEditor, setShowEditor] = useState<boolean>(false)
  const [noteText, setNoteText] = useState<string>('')
  const [isRecording, setIsRecording] = useState<boolean>(false)

  function handleEditWithText() {
    setShowEditor(true)
  }
  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setNoteText(event.target.value)
    if (event.target.value === '') {
      setShowEditor(false)
    }
  }
  function handleSaveNote() {
    createNote({
      id: crypto.randomUUID(),
      date: new Date(),
      content: noteText,
    })
    setNoteText('')
  }

  function handleStartRecording() {
    const isSpeechRecognitionApiAvailable =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    if (!isSpeechRecognitionApiAvailable) {
      alert(
        'Infelizmente seu navegador não suporta a tecnologia de reconhecimento de voz'
      )
      return
    }
    setIsRecording(true)
    setShowEditor(true)

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI()

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setNoteText(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.error(event)
    }

    speechRecognition.start()
  }
  function handleStopRecording() {
    setIsRecording(false)
    if (speechRecognition !== null) {
      speechRecognition.stop()
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger
        onClick={() => setShowEditor(false)}
        className="flex flex-col text-left rounded-md bg-slate-700 p-5 gap-3 relative overflow-hidden hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none"
      >
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/50 to-black/0 pointer-events-none" />
      </Dialog.Trigger>

      <Dialog.DialogPortal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50">
          <Dialog.Content className="overflow-hidden fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:h-[60vh] md:max-w-[640px] w-full bg-slate-700 md:rounded-md flex flex-col outline-none">
            <Dialog.Close className="absolute right-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
              <X className="size-5" />
            </Dialog.Close>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-200">
                Adicionar nota
              </span>
              {!showEditor ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{' '}
                  <button
                    onClick={handleStartRecording}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    gravando uma nota
                  </button>{' '}
                  em áudio ou se preferir{' '}
                  <button
                    onClick={handleEditWithText}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    utilize apenas texto
                  </button>
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="text-small leading-6 bg-transparent resize-none flex-1 text-slate-400 outline-none"
                  onChange={handleContentChange}
                  value={noteText}
                />
              )}
            </div>
            {isRecording ? (
              <button
                onClick={handleStopRecording}
                type="button"
                className="flex items-center justify-center gap-2 w-full bg-slate-900 py-4 font-medium text-center text-sm text-slate-300 outline-none hover:text-slate-100"
              >
                <div className="size-3 bg-red-500 rounded-full animate-pulse" />
                {'Gravando! (clique p/ interromper)'}
              </button>
            ) : (
              <Dialog.Close
                onClick={handleSaveNote}
                type="button"
                className="w-full bg-lime-400 py-4 font-medium text-center text-sm text-lime-950 outline-none hover:bg-lime-500"
              >
                Salvar nota
              </Dialog.Close>
            )}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.DialogPortal>
    </Dialog.Root>
  )
}
