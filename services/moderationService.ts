
export const VIOLATION_MESSAGE = "Off-app communication and payments are not allowed. Only purchases completed inside the app include Refreshed Verification & Buyer Protection.";

// Regex patterns to block
const PATTERNS = {
  PHONE: /(\b\d{10}\b|\b\d{3}[-.]?\d{3}[-.]?\d{4}\b)/,
  EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
  SOCIAL: /(@[a-zA-Z0-9_.]+)/, // Blocks @handles
  URL: /(https?:\/\/[^\s]+)|(www\.[^\s]+)/,
  PAYMENT: /\b(upi|paytm|gpay|phonepe|cash|google pay)\b/i
};

export const sanitizeContent = (text: string): { cleanedText: string; hasViolation: boolean; warning?: string } => {
  let hasViolation = false;
  let cleanedText = text;

  // Check Phone
  if (PATTERNS.PHONE.test(text)) {
    hasViolation = true;
    cleanedText = cleanedText.replace(PATTERNS.PHONE, '[contact removed]');
  }

  // Check Email
  if (PATTERNS.EMAIL.test(text)) {
    hasViolation = true;
    cleanedText = cleanedText.replace(PATTERNS.EMAIL, '[contact removed]');
  }

  // Check Social Handles
  if (PATTERNS.SOCIAL.test(text)) {
    hasViolation = true;
    cleanedText = cleanedText.replace(PATTERNS.SOCIAL, '[contact removed]');
  }

  // Check URLs
  if (PATTERNS.URL.test(text)) {
    hasViolation = true;
    cleanedText = cleanedText.replace(PATTERNS.URL, '[link removed]');
  }
  
  // Check Payment Keywords
  if (PATTERNS.PAYMENT.test(text)) {
      hasViolation = true;
      cleanedText = cleanedText.replace(PATTERNS.PAYMENT, '[payment info removed]');
  }

  return {
    cleanedText,
    hasViolation,
    warning: hasViolation ? VIOLATION_MESSAGE : undefined
  };
};
