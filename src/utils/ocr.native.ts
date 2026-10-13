import { recognizeText } from 'expo-ocr-kit';

export async function readTextFromImage(uri: string): Promise<string> {
  const result = await recognizeText(uri);
  return result.text.trim();
}

export async function readTextFromPdf(_uri: string): Promise<string> {
  throw new Error('PDF_NOT_SUPPORTED_NATIVE');
}
