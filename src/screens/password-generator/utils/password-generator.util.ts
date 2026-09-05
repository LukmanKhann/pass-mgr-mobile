export interface IPasswordOptions {
  lowerCase: boolean;
  upperCase: boolean;
  numbers: boolean;
  symbols: boolean;
}

export function generatePassword(passwordLength: number, options: IPasswordOptions): string {
  const { lowerCase, upperCase, numbers, symbols } = options;
  let characterList = '';

  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const digitsChars = '0123456789';

  if (upperCase) characterList += uppercaseChars;
  if (lowerCase) characterList += lowercaseChars;
  if (numbers) characterList += digitsChars;
  if (symbols) characterList += specialChars;

  if (characterList === '') {
    throw new Error('Please select at least one character type');
  }

  return createPassword(characterList, passwordLength);
}

function createPassword(characters: string, passwordLength: number): string {
  let result = '';
  for (let i =  0; i < passwordLength; i++) {
    const characterIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(characterIndex);
  }
  return result;
}

export function calculatePasswordStrength(password: string): string {
  let score =  0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score < 3) return 'Weak';
  if (score < 5) return 'Medium';
  return 'Strong';
}

/**
 * Maps a `calculatePasswordStrength` label to a 0–3 meter level for the
 * shared StrengthMeter widget.
 */
export function getPasswordStrengthLevel(strength: string): number {
  if (strength === 'Weak') return 1;
  if (strength === 'Medium') return 2;
  if (strength === 'Strong') return 3;
  return 0;
}
