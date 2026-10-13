// Metro selects ocr.web.ts or ocr.native.ts for platform builds.
// This fallback keeps TypeScript and static import resolvers satisfied.
export { readTextFromImage, readTextFromPdf } from './ocr.native';
