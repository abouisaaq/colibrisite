/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actionsContent from "../actionsContent.js";
import type * as articles from "../articles.js";
import type * as donations from "../donations.js";
import type * as events from "../events.js";
import type * as gallery from "../gallery.js";
import type * as home from "../home.js";
import type * as lib_bridgeAuth from "../lib/bridgeAuth.js";
import type * as media from "../media.js";
import type * as newsletter from "../newsletter.js";
import type * as partners from "../partners.js";
import type * as projects from "../projects.js";
import type * as publicForms from "../publicForms.js";
import type * as seed from "../seed.js";
import type * as settings from "../settings.js";
import type * as siteVisits from "../siteVisits.js";
import type * as testimonials from "../testimonials.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  actionsContent: typeof actionsContent;
  articles: typeof articles;
  donations: typeof donations;
  events: typeof events;
  gallery: typeof gallery;
  home: typeof home;
  "lib/bridgeAuth": typeof lib_bridgeAuth;
  media: typeof media;
  newsletter: typeof newsletter;
  partners: typeof partners;
  projects: typeof projects;
  publicForms: typeof publicForms;
  seed: typeof seed;
  settings: typeof settings;
  siteVisits: typeof siteVisits;
  testimonials: typeof testimonials;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
