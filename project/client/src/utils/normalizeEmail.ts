export const normalizeEmail = (email: string): string => {
  const [localPart, domain] = email.toLowerCase().trim().split("@");
  
  if (domain === "gmail.com" || domain === "googlemail.com") {
    const normalizedLocal = localPart.replace(/\./g, "");
    return `${normalizedLocal}@${domain}`;
  }
  
  return email.toLowerCase().trim();
};