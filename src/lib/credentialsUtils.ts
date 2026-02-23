import type { Role } from '@/types';

/**
 * Extracts the first name from a full name
 * @param fullName - The full name of the person
 * @returns The first name in lowercase
 */
export function extractFirstName(fullName: string): string {
  const trimmed = fullName.trim();
  const firstName = trimmed.split(' ')[0];
  return firstName.toLowerCase();
}

/**
 * Generates an email address based on name and role
 * Formats: firstname@manager.com or firstname@employee.com
 * @param fullName - The full name of the person
 * @param role - The role of the user ('manager' or 'employee')
 * @returns Generated email address
 */
export function generateEmail(fullName: string, role: 'manager' | 'employee'): string {
  const firstName = extractFirstName(fullName);
  return `${firstName}@${role}.com`;
}

/**
 * Generates a password based on the person's name
 * Format: Firstname@123 (first letter capitalized)
 * @param fullName - The full name of the person
 * @returns Generated password
 */
export function generatePassword(fullName: string): string {
  const trimmed = fullName.trim();
  const firstName = trimmed.split(' ')[0];
  // Capitalize first letter
  const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  return `${capitalizedFirstName}@123`;
}

/**
 * Generates avatar initials from a full name
 * @param fullName - The full name of the person
 * @returns Two-letter avatar initials (e.g., "JD" for "John Doe")
 */
export function generateAvatar(fullName: string): string {
  const trimmed = fullName.trim();
  const parts = trimmed.split(' ');
  
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Generates a unique user ID based on role
 * @param role - The role of the user
 * @returns Generated user ID
 */
export function generateUserId(role: Role): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  const prefix = role === 'manager' ? 'mgr' : role === 'employee' ? 'emp' : role;
  return `${prefix}-${timestamp}-${random}`;
}
