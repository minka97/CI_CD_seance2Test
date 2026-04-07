/** @format */

export function isValidEmail(email: string | null): boolean {
  if (!email) return false;

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
type PasswordValidationResult = {
  valid: boolean;
  errors: string[];
};

export function isValidPassword(
  password: string | null,
): PasswordValidationResult {
  const errors: string[] = [];

  if (!password) {
    return {
      valid: false,
      errors: [
        "Minimum 8 caracteres",
        "Au moins 1 majuscule",
        "Au moins 1 minuscule",
        "Au moins 1 chiffre",
        "Au moins 1 caractere special",
      ],
    };
  }

  if (password.length < 8) {
    errors.push("Minimum 8 caracteres");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Au moins 1 majuscule");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Au moins 1 minuscule");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Au moins 1 chiffre");
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Au moins 1 caractere special");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
export function isValidAge(age: unknown): boolean {
  if (typeof age !== "number") return false;

  if (!Number.isInteger(age)) return false;

  return age >= 0 && age <= 150;
}
