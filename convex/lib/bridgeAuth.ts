import { v } from "convex/values";
import {
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import { mutation, query } from "../_generated/server";

/**
 * Toutes les fonctions Convex du CMS passent par ce pont :
 * seul le serveur Next (qui détient CONVEX_BRIDGE_SECRET) peut les appeler.
 * Le navigateur / un tiers avec seulement NEXT_PUBLIC_CONVEX_URL est bloqué.
 */
function assertBridgeSecret(bridgeSecret: string) {
  const expected = process.env.CONVEX_BRIDGE_SECRET;
  if (!expected || bridgeSecret !== expected) {
    throw new Error("Unauthorized");
  }
}

export const bridgedQuery = customQuery(query, {
  args: { bridgeSecret: v.string() },
  input: async (ctx, { bridgeSecret }) => {
    assertBridgeSecret(bridgeSecret);
    return { ctx, args: {} };
  },
});

export const bridgedMutation = customMutation(mutation, {
  args: { bridgeSecret: v.string() },
  input: async (ctx, { bridgeSecret }) => {
    assertBridgeSecret(bridgeSecret);
    return { ctx, args: {} };
  },
});
