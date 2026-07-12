"use client";

import { PayPalButtons } from "@paypal/react-paypal-js";
import { completeDonation } from "@/actions/donations";
import { toast } from "sonner";

interface PayPalDonationButtonsProps {
  finalAmount: number;
  donorName: string;
  donorEmail: string;
}

export function PayPalDonationButtons({
  finalAmount,
  donorName,
  donorEmail,
}: PayPalDonationButtonsProps) {
  return (
    <PayPalButtons
      style={{ layout: "vertical", color: "blue", shape: "rect", label: "paypal" }}
      disabled={finalAmount < 1}
      createOrder={async () => {
        const res = await fetch("/api/paypal/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: finalAmount,
            donorName: donorName || undefined,
            donorEmail: donorEmail || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.id) {
          throw new Error(data.error ?? "Impossible de créer la commande PayPal.");
        }
        return data.id as string;
      }}
      onApprove={async (data) => {
        try {
          await completeDonation(data.orderID);
          toast.success("Merci pour votre don !");
        } catch {
          toast.error("Erreur lors de la confirmation du paiement.");
        }
      }}
      onCancel={() => {
        toast.message("Paiement annulé.");
      }}
      onError={() => {
        toast.error("Erreur PayPal. Veuillez réessayer.");
      }}
    />
  );
}
