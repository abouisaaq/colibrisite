export type CountryDialCode = {
  iso: string;
  name: string;
  dial: string;
  flag: string;
};

/** Pays affichés en premier dans le sélecteur WhatsApp */
const PRIORITY_ISOS = ["FR", "MA", "BE", "CH", "CA", "DZ", "TN", "SN", "CI", "LU"];

const ALL_COUNTRIES: CountryDialCode[] = [
  { iso: "AF", name: "Afghanistan", dial: "+93", flag: "🇦🇫" },
  { iso: "ZA", name: "Afrique du Sud", dial: "+27", flag: "🇿🇦" },
  { iso: "AL", name: "Albanie", dial: "+355", flag: "🇦🇱" },
  { iso: "DZ", name: "Algérie", dial: "+213", flag: "🇩🇿" },
  { iso: "DE", name: "Allemagne", dial: "+49", flag: "🇩🇪" },
  { iso: "AD", name: "Andorre", dial: "+376", flag: "🇦🇩" },
  { iso: "AO", name: "Angola", dial: "+244", flag: "🇦🇴" },
  { iso: "SA", name: "Arabie saoudite", dial: "+966", flag: "🇸🇦" },
  { iso: "AR", name: "Argentine", dial: "+54", flag: "🇦🇷" },
  { iso: "AM", name: "Arménie", dial: "+374", flag: "🇦🇲" },
  { iso: "AU", name: "Australie", dial: "+61", flag: "🇦🇺" },
  { iso: "AT", name: "Autriche", dial: "+43", flag: "🇦🇹" },
  { iso: "AZ", name: "Azerbaïdjan", dial: "+994", flag: "🇦🇿" },
  { iso: "BH", name: "Bahreïn", dial: "+973", flag: "🇧🇭" },
  { iso: "BD", name: "Bangladesh", dial: "+880", flag: "🇧🇩" },
  { iso: "BE", name: "Belgique", dial: "+32", flag: "🇧🇪" },
  { iso: "BJ", name: "Bénin", dial: "+229", flag: "🇧🇯" },
  { iso: "BO", name: "Bolivie", dial: "+591", flag: "🇧🇴" },
  { iso: "BA", name: "Bosnie-Herzégovine", dial: "+387", flag: "🇧🇦" },
  { iso: "BR", name: "Brésil", dial: "+55", flag: "🇧🇷" },
  { iso: "BG", name: "Bulgarie", dial: "+359", flag: "🇧🇬" },
  { iso: "BF", name: "Burkina Faso", dial: "+226", flag: "🇧🇫" },
  { iso: "BI", name: "Burundi", dial: "+257", flag: "🇧🇮" },
  { iso: "KH", name: "Cambodge", dial: "+855", flag: "🇰🇭" },
  { iso: "CM", name: "Cameroun", dial: "+237", flag: "🇨🇲" },
  { iso: "CA", name: "Canada", dial: "+1", flag: "🇨🇦" },
  { iso: "CV", name: "Cap-Vert", dial: "+238", flag: "🇨🇻" },
  { iso: "CL", name: "Chili", dial: "+56", flag: "🇨🇱" },
  { iso: "CN", name: "Chine", dial: "+86", flag: "🇨🇳" },
  { iso: "CY", name: "Chypre", dial: "+357", flag: "🇨🇾" },
  { iso: "CO", name: "Colombie", dial: "+57", flag: "🇨🇴" },
  { iso: "KR", name: "Corée du Sud", dial: "+82", flag: "🇰🇷" },
  { iso: "CR", name: "Costa Rica", dial: "+506", flag: "🇨🇷" },
  { iso: "CI", name: "Côte d'Ivoire", dial: "+225", flag: "🇨🇮" },
  { iso: "HR", name: "Croatie", dial: "+385", flag: "🇭🇷" },
  { iso: "DK", name: "Danemark", dial: "+45", flag: "🇩🇰" },
  { iso: "EG", name: "Égypte", dial: "+20", flag: "🇪🇬" },
  { iso: "AE", name: "Émirats arabes unis", dial: "+971", flag: "🇦🇪" },
  { iso: "EC", name: "Équateur", dial: "+593", flag: "🇪🇨" },
  { iso: "ES", name: "Espagne", dial: "+34", flag: "🇪🇸" },
  { iso: "EE", name: "Estonie", dial: "+372", flag: "🇪🇪" },
  { iso: "US", name: "États-Unis", dial: "+1", flag: "🇺🇸" },
  { iso: "ET", name: "Éthiopie", dial: "+251", flag: "🇪🇹" },
  { iso: "FI", name: "Finlande", dial: "+358", flag: "🇫🇮" },
  { iso: "FR", name: "France", dial: "+33", flag: "🇫🇷" },
  { iso: "GA", name: "Gabon", dial: "+241", flag: "🇬🇦" },
  { iso: "GM", name: "Gambie", dial: "+220", flag: "🇬🇲" },
  { iso: "GE", name: "Géorgie", dial: "+995", flag: "🇬🇪" },
  { iso: "GH", name: "Ghana", dial: "+233", flag: "🇬🇭" },
  { iso: "GR", name: "Grèce", dial: "+30", flag: "🇬🇷" },
  { iso: "GN", name: "Guinée", dial: "+224", flag: "🇬🇳" },
  { iso: "GQ", name: "Guinée équatoriale", dial: "+240", flag: "🇬🇶" },
  { iso: "GW", name: "Guinée-Bissau", dial: "+245", flag: "🇬🇼" },
  { iso: "HT", name: "Haïti", dial: "+509", flag: "🇭🇹" },
  { iso: "HN", name: "Honduras", dial: "+504", flag: "🇭🇳" },
  { iso: "HU", name: "Hongrie", dial: "+36", flag: "🇭🇺" },
  { iso: "IN", name: "Inde", dial: "+91", flag: "🇮🇳" },
  { iso: "ID", name: "Indonésie", dial: "+62", flag: "🇮🇩" },
  { iso: "IQ", name: "Irak", dial: "+964", flag: "🇮🇶" },
  { iso: "IE", name: "Irlande", dial: "+353", flag: "🇮🇪" },
  { iso: "IS", name: "Islande", dial: "+354", flag: "🇮🇸" },
  { iso: "IL", name: "Israël", dial: "+972", flag: "🇮🇱" },
  { iso: "IT", name: "Italie", dial: "+39", flag: "🇮🇹" },
  { iso: "JM", name: "Jamaïque", dial: "+1876", flag: "🇯🇲" },
  { iso: "JP", name: "Japon", dial: "+81", flag: "🇯🇵" },
  { iso: "JO", name: "Jordanie", dial: "+962", flag: "🇯🇴" },
  { iso: "KZ", name: "Kazakhstan", dial: "+7", flag: "🇰🇿" },
  { iso: "KE", name: "Kenya", dial: "+254", flag: "🇰🇪" },
  { iso: "KW", name: "Koweït", dial: "+965", flag: "🇰🇼" },
  { iso: "LA", name: "Laos", dial: "+856", flag: "🇱🇦" },
  { iso: "LV", name: "Lettonie", dial: "+371", flag: "🇱🇻" },
  { iso: "LB", name: "Liban", dial: "+961", flag: "🇱🇧" },
  { iso: "LY", name: "Libye", dial: "+218", flag: "🇱🇾" },
  { iso: "LT", name: "Lituanie", dial: "+370", flag: "🇱🇹" },
  { iso: "LU", name: "Luxembourg", dial: "+352", flag: "🇱🇺" },
  { iso: "MK", name: "Macédoine du Nord", dial: "+389", flag: "🇲🇰" },
  { iso: "MG", name: "Madagascar", dial: "+261", flag: "🇲🇬" },
  { iso: "MY", name: "Malaisie", dial: "+60", flag: "🇲🇾" },
  { iso: "MW", name: "Malawi", dial: "+265", flag: "🇲🇼" },
  { iso: "ML", name: "Mali", dial: "+223", flag: "🇲🇱" },
  { iso: "MT", name: "Malte", dial: "+356", flag: "🇲🇹" },
  { iso: "MA", name: "Maroc", dial: "+212", flag: "🇲🇦" },
  { iso: "MU", name: "Maurice", dial: "+230", flag: "🇲🇺" },
  { iso: "MR", name: "Mauritanie", dial: "+222", flag: "🇲🇷" },
  { iso: "MX", name: "Mexique", dial: "+52", flag: "🇲🇽" },
  { iso: "MD", name: "Moldavie", dial: "+373", flag: "🇲🇩" },
  { iso: "MC", name: "Monaco", dial: "+377", flag: "🇲🇨" },
  { iso: "MN", name: "Mongolie", dial: "+976", flag: "🇲🇳" },
  { iso: "ME", name: "Monténégro", dial: "+382", flag: "🇲🇪" },
  { iso: "MZ", name: "Mozambique", dial: "+258", flag: "🇲🇿" },
  { iso: "NA", name: "Namibie", dial: "+264", flag: "🇳🇦" },
  { iso: "NP", name: "Népal", dial: "+977", flag: "🇳🇵" },
  { iso: "NI", name: "Nicaragua", dial: "+505", flag: "🇳🇮" },
  { iso: "NE", name: "Niger", dial: "+227", flag: "🇳🇪" },
  { iso: "NG", name: "Nigéria", dial: "+234", flag: "🇳🇬" },
  { iso: "NO", name: "Norvège", dial: "+47", flag: "🇳🇴" },
  { iso: "NZ", name: "Nouvelle-Zélande", dial: "+64", flag: "🇳🇿" },
  { iso: "OM", name: "Oman", dial: "+968", flag: "🇴🇲" },
  { iso: "UG", name: "Ouganda", dial: "+256", flag: "🇺🇬" },
  { iso: "UZ", name: "Ouzbékistan", dial: "+998", flag: "🇺🇿" },
  { iso: "PK", name: "Pakistan", dial: "+92", flag: "🇵🇰" },
  { iso: "PA", name: "Panama", dial: "+507", flag: "🇵🇦" },
  { iso: "PY", name: "Paraguay", dial: "+595", flag: "🇵🇾" },
  { iso: "NL", name: "Pays-Bas", dial: "+31", flag: "🇳🇱" },
  { iso: "PE", name: "Pérou", dial: "+51", flag: "🇵🇪" },
  { iso: "PH", name: "Philippines", dial: "+63", flag: "🇵🇭" },
  { iso: "PL", name: "Pologne", dial: "+48", flag: "🇵🇱" },
  { iso: "PT", name: "Portugal", dial: "+351", flag: "🇵🇹" },
  { iso: "QA", name: "Qatar", dial: "+974", flag: "🇶🇦" },
  { iso: "CF", name: "République centrafricaine", dial: "+236", flag: "🇨🇫" },
  { iso: "CD", name: "République démocratique du Congo", dial: "+243", flag: "🇨🇩" },
  { iso: "DO", name: "République dominicaine", dial: "+1809", flag: "🇩🇴" },
  { iso: "CG", name: "République du Congo", dial: "+242", flag: "🇨🇬" },
  { iso: "CZ", name: "République tchèque", dial: "+420", flag: "🇨🇿" },
  { iso: "RO", name: "Roumanie", dial: "+40", flag: "🇷🇴" },
  { iso: "GB", name: "Royaume-Uni", dial: "+44", flag: "🇬🇧" },
  { iso: "RU", name: "Russie", dial: "+7", flag: "🇷🇺" },
  { iso: "RW", name: "Rwanda", dial: "+250", flag: "🇷🇼" },
  { iso: "SN", name: "Sénégal", dial: "+221", flag: "🇸🇳" },
  { iso: "RS", name: "Serbie", dial: "+381", flag: "🇷🇸" },
  { iso: "SG", name: "Singapour", dial: "+65", flag: "🇸🇬" },
  { iso: "SK", name: "Slovaquie", dial: "+421", flag: "🇸🇰" },
  { iso: "SI", name: "Slovénie", dial: "+386", flag: "🇸🇮" },
  { iso: "SO", name: "Somalie", dial: "+252", flag: "🇸🇴" },
  { iso: "SD", name: "Soudan", dial: "+249", flag: "🇸🇩" },
  { iso: "LK", name: "Sri Lanka", dial: "+94", flag: "🇱🇰" },
  { iso: "SE", name: "Suède", dial: "+46", flag: "🇸🇪" },
  { iso: "CH", name: "Suisse", dial: "+41", flag: "🇨🇭" },
  { iso: "SY", name: "Syrie", dial: "+963", flag: "🇸🇾" },
  { iso: "TZ", name: "Tanzanie", dial: "+255", flag: "🇹🇿" },
  { iso: "TD", name: "Tchad", dial: "+235", flag: "🇹🇩" },
  { iso: "TH", name: "Thaïlande", dial: "+66", flag: "🇹🇭" },
  { iso: "TG", name: "Togo", dial: "+228", flag: "🇹🇬" },
  { iso: "TN", name: "Tunisie", dial: "+216", flag: "🇹🇳" },
  { iso: "TR", name: "Turquie", dial: "+90", flag: "🇹🇷" },
  { iso: "UA", name: "Ukraine", dial: "+380", flag: "🇺🇦" },
  { iso: "UY", name: "Uruguay", dial: "+598", flag: "🇺🇾" },
  { iso: "VE", name: "Venezuela", dial: "+58", flag: "🇻🇪" },
  { iso: "VN", name: "Vietnam", dial: "+84", flag: "🇻🇳" },
  { iso: "YE", name: "Yémen", dial: "+967", flag: "🇾🇪" },
  { iso: "ZM", name: "Zambie", dial: "+260", flag: "🇿🇲" },
  { iso: "ZW", name: "Zimbabwe", dial: "+263", flag: "🇿🇼" },
];

const prioritySet = new Set(PRIORITY_ISOS);

export const PRIORITY_COUNTRIES = PRIORITY_ISOS.map(
  (iso) => ALL_COUNTRIES.find((c) => c.iso === iso)!
).filter(Boolean);

export const OTHER_COUNTRIES = ALL_COUNTRIES.filter((c) => !prioritySet.has(c.iso)).sort((a, b) =>
  a.name.localeCompare(b.name, "fr")
);

export const COUNTRY_DIAL_CODES = [...PRIORITY_COUNTRIES, ...OTHER_COUNTRIES];

export const DEFAULT_COUNTRY_ISO = "FR";

export function getCountryByIso(iso: string): CountryDialCode | undefined {
  return ALL_COUNTRIES.find((c) => c.iso === iso);
}

export function getCountryByDial(dial: string): CountryDialCode | undefined {
  return ALL_COUNTRIES.find((c) => c.dial === dial);
}

export function buildInternationalPhone(dial: string, localNumber: string): string {
  const digits = localNumber.replace(/\D/g, "");
  const national = digits.startsWith("0") ? digits.slice(1) : digits;
  return `${dial}${national}`;
}

export function formatCountryOption(country: CountryDialCode): string {
  return `${country.flag} ${country.name} (${country.dial})`;
}
