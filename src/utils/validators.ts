/**
 * Utilitários de validação e formatação de entradas de formulário.
 */

/**
 * Valida se um e-mail possui formato e domínio válidos (nome@dominio.extensao).
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  // Regex para formato e domínio válido com TLD de pelo menos 2 caracteres
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(trimmed);
}

/**
 * Formata uma string numérica no formato de telefone brasileiro: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX.
 */
export function formatPhone(value: string): string {
  if (!value) return '';
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 2) {
    return digits.length > 0 ? `(${digits}` : '';
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

/**
 * Valida se o telefone tem quantidade de dígitos suficiente (10 para fixo ou 11 para celular).
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11;
}

/**
 * Valida se um campo obrigatório está preenchido.
 */
export function validateRequired(value: string): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}
