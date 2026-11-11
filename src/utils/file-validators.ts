/**
 * Utilitários para validação e manipulação de arquivos no app PEIA.
 */

export const MAX_IMAGE_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export interface FileMetadataInput {
  name?: string;
  size?: number;
  mimeType?: string;
  uri?: string;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  formattedSize: string;
}

/**
 * Formata o tamanho de arquivo em bytes para formato legível (B, KB, MB).
 */
export function formatFileSize(bytes?: number): string {
  if (bytes === undefined || bytes === null || isNaN(bytes)) {
    return 'Tamanho desconhecido';
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Valida um arquivo de imagem selecionado pelo usuário.
 * Verifica existência, extensão, tipo MIME e limites de tamanho.
 */
export function validateImageFile(file: FileMetadataInput): FileValidationResult {
  const formattedSize = formatFileSize(file.size);

  if (!file || (!file.uri && !file.name)) {
    return {
      valid: false,
      error: 'Nenhum arquivo válido foi selecionado.',
      formattedSize,
    };
  }

  // 1. Checagem de tamanho mínimo (> 0 bytes)
  if (file.size !== undefined && file.size <= 0) {
    return {
      valid: false,
      error: 'O arquivo selecionado está vazio ou corrompido.',
      formattedSize,
    };
  }

  // 2. Checagem de tamanho máximo (limite de 5MB)
  if (file.size !== undefined && file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `A imagem excede o tamanho máximo de 5MB (selecionado: ${formattedSize}). Escolha uma imagem mais leve.`,
      formattedSize,
    };
  }

  // 3. Checagem de extensão do nome do arquivo
  const fileName = (file.name || '').toLowerCase();
  const hasValidExtension = ALLOWED_IMAGE_EXTENSIONS.some((ext) =>
    fileName.endsWith(ext)
  );

  // 4. Checagem de MIME Type se presente
  const mime = (file.mimeType || '').toLowerCase();
  const isImageMime =
    mime.startsWith('image/') &&
    (ALLOWED_IMAGE_MIME_TYPES.includes(mime) || mime === 'image/*');

  // Se não tiver extensão válida e nem MIME válido
  if (file.name && !hasValidExtension && file.mimeType && !isImageMime) {
    return {
      valid: false,
      error: 'Formato não suportado. Utilize imagens JPG, PNG ou WEBP.',
      formattedSize,
    };
  }

  return {
    valid: true,
    formattedSize,
  };
}
