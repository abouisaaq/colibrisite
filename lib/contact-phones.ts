export interface ContactPhone {
  label: string;
  flag: string;
  value: string;
}

export function getContactPhones(settings: Record<string, string>): ContactPhone[] {
  const phones: ContactPhone[] = [];

  const france = settings.contact_phone_fr?.trim() || settings.contact_phone?.trim();
  const morocco = settings.contact_phone_ma?.trim();

  if (france) phones.push({ label: "France", flag: "🇫🇷", value: france });
  if (morocco) phones.push({ label: "Maroc", flag: "🇲🇦", value: morocco });

  return phones;
}

export function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
