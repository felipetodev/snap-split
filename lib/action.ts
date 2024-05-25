"use server";

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createStreamableValue } from "ai/rsc";
import { z } from "zod";

const formSchema = z.object({
  file: z.instanceof(File),
  message: z.string().optional()
});

export async function generate(form: FormData) {
  'use server';

  const validatedForm = formSchema.safeParse(Object.fromEntries(form));

  if (!validatedForm.success) {
    console.error(validatedForm.error);
    return { output: 'Unauthorized' };
  }

  const { file, message } = validatedForm.data

  // transform file to base64
  const base64Image = await file.arrayBuffer()
    .then(buffer => Buffer.from(buffer).toString('base64'));

  const stream = createStreamableValue('');

  (async () => {
    const { textStream } = await streamText({
      model: openai('gpt-4o'),
      messages: [
        {
          role: 'system',
          content: `\
Eres un asistente que ayuda a generar tablas resumen de tickets o facturas de compra/consumo.
Utiliza la información de la imagen adjunta.
Si la imagen no corresponde a un ticket, boleta o factura, responde con un mensaje: "Imagen no corresponde a un ticket, boleta o factura."`
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: message ? `Entregando el detalle completo, ${message}:` : '',
            },
            {
              type: 'image',
              image: new URL(`data:image/jpeg;base64,{${base64Image}}`)
            },
          ],
        }
      ],
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}
