export type PayPalEnvironment = "sandbox" | "production";

export type PayPalSetupStatus = {
  ready: boolean;
  environment: PayPalEnvironment;
  issues: string[];
};
