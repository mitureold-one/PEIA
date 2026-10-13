import { createWorker } from 'tesseract.js';

export async function readTextFromImage(uri: string): Promise<string> {
  const isImageUrl = /^(data:|blob:|https?:\/\/)/i.test(uri);
  const image = isImageUrl ? uri : `data:image/jpeg;base64,${uri}`;
  const worker = await createWorker('por+eng');

  try {
    const result = await worker.recognize(image);
    return result.data.text.trim();
  } finally {
    await worker.terminate();
  }
}

export async function readTextFromPdf(uri: string): Promise<string> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

  const response = uri.startsWith('data:') ? null : await fetch(uri);
  const bytes = response
    ? new Uint8Array(await response.arrayBuffer())
    : Uint8Array.from(atob(uri.slice(uri.indexOf(',') + 1)), (character) => character.charCodeAt(0));
  const pdf = await pdfjs.getDocument({ data: bytes }).promise;

  if (pdf.numPages > 25) {
    await pdf.destroy();
    throw new Error('PDF_TOO_MANY_PAGES');
  }

  let ocrWorker: Awaited<ReturnType<typeof createWorker>> | null = null;
  const pages: string[] = [];

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const pageText = content.items
        .filter((item): item is typeof item & { str: string } => 'str' in item)
        .map((item) => item.str)
        .join(' ')
        .trim();

      if (pageText.length >= 30) {
        pages.push(pageText);
        continue;
      }

      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Não foi possível preparar a leitura do PDF.');

      await page.render({ canvas, canvasContext: context, viewport }).promise;
      ocrWorker ??= await createWorker('por+eng');
      const result = await ocrWorker.recognize(canvas);
      pages.push(result.data.text.trim() || pageText);
      canvas.width = 0;
      canvas.height = 0;
    }

    return pages.filter(Boolean).join('\n\n').trim();
  } finally {
    await ocrWorker?.terminate();
    await pdf.destroy();
  }
}
