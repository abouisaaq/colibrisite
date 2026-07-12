import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-colibri-blue mb-4">404</h1>
      <p className="text-muted-foreground mb-8">Page introuvable</p>
      <Button asChild className="bg-colibri-teal hover:bg-colibri-teal/90 rounded-full">
        <Link href="/">Retour à l&apos;accueil</Link>
      </Button>
    </div>
  );
}
