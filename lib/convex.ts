import "server-only";

import { ConvexHttpClient } from "convex/browser";
import type {
  FunctionArgs,
  FunctionReference,
  FunctionReturnType,
} from "convex/server";

type BridgeArgs<T> = Omit<T, "bridgeSecret"> & { bridgeSecret?: never };

/**
 * Client Convex serveur uniquement.
 * Injecte CONVEX_BRIDGE_SECRET — les fonctions Convex refusent tout appel sans ce secret.
 */
export function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_CONVEX_URL manquant. Lancez `npx convex dev` puis copiez l'URL dans .env.local"
    );
  }

  const bridgeSecret = process.env.CONVEX_BRIDGE_SECRET;
  if (!bridgeSecret) {
    throw new Error(
      "CONVEX_BRIDGE_SECRET manquant. Ajoutez-le dans .env.local et dans Convex (`npx convex env set CONVEX_BRIDGE_SECRET …`)."
    );
  }

  const client = new ConvexHttpClient(url);

  return {
    query<Query extends FunctionReference<"query">>(
      queryRef: Query,
      args: BridgeArgs<FunctionArgs<Query>>
    ): Promise<FunctionReturnType<Query>> {
      return client.query(queryRef, {
        ...(args as object),
        bridgeSecret,
      } as FunctionArgs<Query>);
    },
    mutation<Mutation extends FunctionReference<"mutation">>(
      mutationRef: Mutation,
      args: BridgeArgs<FunctionArgs<Mutation>>
    ): Promise<FunctionReturnType<Mutation>> {
      return client.mutation(mutationRef, {
        ...(args as object),
        bridgeSecret,
      } as FunctionArgs<Mutation>);
    },
  };
}
