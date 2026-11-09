export async function readTextFromImage(_uri: string): Promise<string> {
  // Em ambiente Expo Go nativo, módulos binários de OCR não estão embutidos no APK padrão.
  // Retorna vazio de forma segura sem carregar binários inexistentes no Expo Go.
  return '';
}

export async function readTextFromPdf(_uri: string): Promise<string> {
  throw new Error('PDF_NOT_SUPPORTED_NATIVE');
}
