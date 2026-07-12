import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { SiteLogo } from "@/components/brand/site-logo";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/icons/social-icons";
import { getContactPhones, phoneHref } from "@/lib/contact-phones";

interface SiteFooterProps {
  settings?: Record<string, string>;
  logoUrl?: string;
}

const SOCIAL_LINKS = [
  { key: "facebook_url", label: "Facebook", Icon: FacebookIcon },
  { key: "instagram_url", label: "Instagram", Icon: InstagramIcon },
  { key: "youtube_url", label: "YouTube", Icon: YoutubeIcon },
] as const;

export function SiteFooter({ settings = {}, logoUrl }: SiteFooterProps) {
  const email = settings.contact_email ?? "contact@colibris-espoir.org";
  const phones = getContactPhones(settings);
  const address = settings.contact_address ?? "12 Rue de l'Espoir, 75011 Paris";
  const logo = logoUrl ?? settings.site_logo;

  return (
    <footer className="bg-[#111827] text-white">
      <div className="site-container pt-16 pb-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-5">
              <SiteLogo logoUrl={logo} height={48} maxWidth={180} />
            </div>
            <p className="mt-0 text-sm leading-relaxed text-white/65">
              {settings.footer_tagline?.trim() ||
                "Association caritative dédiée à l'accompagnement des familles en difficulté."}
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Navigation</h3>
            <ul className="space-y-2 text-sm text-white/65">
              <li><Link href="/a-propos" className="transition-colors hover:text-[#42D7C8]">À propos</Link></li>
              <li><Link href="/#nos-actions" className="transition-colors hover:text-[#42D7C8]">Nos actions</Link></li>
              <li><Link href="/actualites" className="transition-colors hover:text-[#42D7C8]">Actualités</Link></li>
              <li><Link href="/evenements" className="transition-colors hover:text-[#42D7C8]">Événements</Link></li>
              <li><Link href="/benevole" className="transition-colors hover:text-[#42D7C8]">Devenir bénévole</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Contact</h3>
            <ul className="space-y-3 text-sm text-white/65">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#42D7C8]" />
                <a href={`mailto:${email}`} className="break-all hover:text-[#42D7C8]">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#42D7C8]" />
                <div className="space-y-1">
                  {phones.length > 0 ? (
                    phones.map((phone) => (
                      <div key={phone.label} className="flex items-center gap-2 text-sm">
                        <span className="text-base leading-none" aria-hidden>
                          {phone.flag}
                        </span>
                        <a href={phoneHref(phone.value)} className="hover:text-[#42D7C8]" aria-label={`${phone.label} : ${phone.value}`}>
                          {phone.value}
                        </a>
                      </div>
                    ))
                  ) : (
                    <span>—</span>
                  )}
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#42D7C8]" />
                <span>{address}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Suivez-nous</h3>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ key, label, Icon }) => {
                const url = settings[key]?.trim();
                const iconClass = "h-5 w-5";
                const wrapperClass =
                  "inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors";

                if (url) {
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${wrapperClass} hover:bg-[#42D7C8] hover:text-white`}
                      aria-label={label}
                      title={label}
                    >
                      <Icon className={iconClass} />
                    </a>
                  );
                }

                return (
                  <span
                    key={key}
                    className={`${wrapperClass} opacity-40`}
                    title={`${label} — ajoutez le lien dans Paramètres`}
                    aria-label={`${label} (lien non configuré)`}
                  >
                    <Icon className={iconClass} />
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-5 text-sm text-white/45 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Les Colibris Porteurs d&apos;Espoir. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link href="/faire-un-don" className="hover:text-[#42D7C8]">Faire un don</Link>
            <Link href="/contact" className="hover:text-[#42D7C8]">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
