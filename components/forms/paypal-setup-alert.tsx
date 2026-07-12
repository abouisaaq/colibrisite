import Link from "next/link";
import type { PayPalSetupStatus } from "@/lib/paypal-types";

interface PayPalSetupAlertProps {
  status: PayPalSetupStatus;
}

export function PayPalSetupAlert({ status }: PayPalSetupAlertProps) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
      <p className="font-semibold">Configuration PayPal à corriger</p>
      <p className="mt-2 leading-relaxed text-amber-900/90">
        Le bouton de paiement ne peut pas se charger tant que les identifiants ne sont pas
        valides. Mode actuel : <strong>{status.environment}</strong>.
      </p>

      <ul className="mt-3 list-inside list-disc space-y-1.5 text-amber-900/85">
        {status.issues.map((issue) => (
          <li key={issue}>{issue}</li>
        ))}
      </ul>

      <div className="mt-4 space-y-2 rounded-lg bg-white/70 p-3 text-amber-950/90">
        <p className="font-medium">Étapes recommandées</p>
        <ol className="list-inside list-decimal space-y-1 text-[13px] leading-relaxed">
          <li>
            Ouvrez le{" "}
            <Link
              href="https://developer.paypal.com/dashboard/applications/sandbox"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-2"
            >
              tableau de bord PayPal Developer (Sandbox)
            </Link>
          </li>
          <li>Créez une nouvelle application ou ouvrez l&apos;application « coli »</li>
          <li>Copiez le Client ID et le Secret dans votre fichier <code>.env</code></li>
          <li>Copiez le Client ID et le Secret dans <code>.env</code> ou dans Admin → Paramètres → PayPal</li>
          <li>Redémarrez le serveur : <code>npm run dev</code></li>
        </ol>
      </div>
    </div>
  );
}
