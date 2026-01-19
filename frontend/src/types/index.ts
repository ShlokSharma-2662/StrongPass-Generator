/**
 * Password generation options
 */
export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
  customCharacterSet?: string;
  pattern?: string;
}

export interface BatchPasswordOptions {
  count: number;
  options: PasswordOptions;
}

export interface PassphraseOptions {
  wordCount: number;
  separator: string;
  capitalize: boolean;
  includeNumber: boolean;
}

export interface AnalyzePasswordRequest {
  password: string;
}

export interface PasswordResponse {
  password: string;
  strength: number;
  strengthLabel: string;
  estimatedCrackTime: string;
  entropy: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors: string[] | null;
}
