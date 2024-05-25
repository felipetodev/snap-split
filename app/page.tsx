"use client"

import * as React from 'react'
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { generate } from '@/lib/action';
import { readStreamableValue } from 'ai/rsc';
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';

registerPlugin(
  FilePondPluginImagePreview,
);

const label = `
  <div class="text-base">
    Arrastra y suelta tu imagen o <span class="cursor-pointer font-semibold text-emerald-500 underline underline-offset-2 hover:opacity-80">Haz click para buscar</span>
    <span class="block !text-xs mt-2">(PNG, JPEG, JPG)</span>
  </div>
`;

export default function Home() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [files, setFiles] = React.useState<any[]>([]);
  const [generation, setGeneration] = React.useState<string>('');
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  return (
    <main className='relative mx-auto max-w-7xl p-4'>
      <div className='flex flex-col'>
        <FilePond
          captureMethod="camera"
          files={files}
          imagePreviewMaxHeight={600}
          onupdatefiles={setFiles}
          acceptedFileTypes={["image/*"]}
          allowMultiple={false}
          name="files"
          labelIdle={label}
          credits={false}
        />
      </div>
      <div className='flex flex-col gap-y-4 md:w-max'>
        <div className='grid space-y-2'>
          <label htmlFor='message' className='text-sm'>
            Instrucciones adicionales (opcional):
          </label>
          <textarea
            ref={inputRef}
            id='message'
            placeholder='Ej: Dividir cuenta en 3 partes iguales.'
            className='border text-sm resize-none min-h-[100px] max-h-[300px] [field-sizing:content] md:w-[400px] rounded-lg p-1 focus-visible:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors'
          />
        </div>
        <button
          disabled={isLoading}
          className='font-semibold py-2 px-4 bg-emerald-500 text-white rounded-full hover:bg-emerald-500/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          onClick={async () => {
            if (!files[0]?.file) {
              return alert("Debes añadir una imagen")
            }
            setIsLoading(true);
            setGeneration('');
            const form = new FormData()
            form.append('file', files[0].file)
            form.append('message', inputRef.current?.value || '')
            const { output } = await generate(form);

            for await (const delta of readStreamableValue(output)) {
              setGeneration(currentGeneration => `${currentGeneration}${delta}`);
            }

            if (inputRef.current) {
              inputRef.current.value = '';
            }
            setIsLoading(false);
          }}
        >
          {isLoading ? 'Pensando...' : 'Generar resumen ✨'}
        </button>

        <Markdown className='prose prose-p:leading-relaxed prose-pre:p-0 mt-4' remarkPlugins={[remarkGfm]}>
          {generation}
        </Markdown>
        {(generation && !isLoading) && (
          <div className='mt-4'>
            <a
              className='text-xs bg-green-600 hover:bg-green-600/70 text-white p-2 rounded-full'
              target="_blank"
              href={`https://wa.me?text=${encodeURIComponent(generation)}`}
            >
              Compartir resumen en Whatsapp
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
