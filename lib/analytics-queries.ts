import "server-only";
import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convex";
import { DEVICE_LABELS, type DeviceType } from "@/lib/analytics";

export type VisitPeriod = 7 | 30 | 90;

export type VisitAnalytics = {
  period: VisitPeriod;
  totalVisits: number;
  uniqueVisitors: number;
  dailyVisits: { day: string; visits: number; visitors: number }[];
  devices: { device: DeviceType; label: string; count: number; percentage: number }[];
  countries: { country: string; countryCode: string | null; count: number; percentage: number }[];
  cities: { city: string; country: string | null; count: number; percentage: number }[];
  topPages: { path: string; count: number; percentage: number }[];
};

function getSinceMs(days: VisitPeriod): number {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (days - 1));
  return since.getTime();
}

function toDayKey(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

function buildDailySeries(
  days: VisitPeriod,
  visits: { createdAt: number; visitorId: string }[]
) {
  const buckets = new Map<string, { visits: number; visitors: Set<string> }>();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    buckets.set(date.toISOString().slice(0, 10), { visits: 0, visitors: new Set() });
  }

  for (const visit of visits) {
    const key = toDayKey(visit.createdAt);
    const bucket = buckets.get(key);
    if (!bucket) continue;
    bucket.visits += 1;
    bucket.visitors.add(visit.visitorId);
  }

  return Array.from(buckets.entries()).map(([day, data]) => ({
    day,
    visits: data.visits,
    visitors: data.visitors.size,
  }));
}

function withPercentages<T extends { count: number }>(items: T[], total: number) {
  return items.map((item) => ({
    ...item,
    percentage: total > 0 ? Math.round((item.count / total) * 100) : 0,
  }));
}

function emptyAnalytics(period: VisitPeriod): VisitAnalytics {
  return {
    period,
    totalVisits: 0,
    uniqueVisitors: 0,
    dailyVisits: [],
    devices: [],
    countries: [],
    cities: [],
    topPages: [],
  };
}

export async function getVisitAnalytics(period: VisitPeriod = 30): Promise<VisitAnalytics> {
  try {
    const client = getConvexClient();
    const visits = await client.query(api.siteVisits.listSince, {
      sinceMs: getSinceMs(period),
    });

    const totalVisits = visits.length;
    const uniqueVisitors = new Set(visits.map((visit) => visit.visitorId)).size;

    const deviceMap = new Map<DeviceType, number>();
    const countryMap = new Map<
      string,
      { country: string; countryCode: string | null; count: number }
    >();
    const cityMap = new Map<
      string,
      { city: string; country: string | null; count: number }
    >();
    const pageMap = new Map<string, number>();

    for (const visit of visits) {
      deviceMap.set(visit.deviceType, (deviceMap.get(visit.deviceType) ?? 0) + 1);

      if (visit.country) {
        const countryKey = visit.countryCode ?? visit.country;
        const existing = countryMap.get(countryKey);
        if (existing) existing.count += 1;
        else {
          countryMap.set(countryKey, {
            country: visit.country,
            countryCode: visit.countryCode ?? null,
            count: 1,
          });
        }
      }

      if (visit.city) {
        const cityKey = `${visit.city}|${visit.countryCode ?? visit.country ?? ""}`;
        const existing = cityMap.get(cityKey);
        if (existing) existing.count += 1;
        else {
          cityMap.set(cityKey, {
            city: visit.city,
            country: visit.country ?? null,
            count: 1,
          });
        }
      }

      pageMap.set(visit.path, (pageMap.get(visit.path) ?? 0) + 1);
    }

    const devices = withPercentages(
      Array.from(deviceMap.entries())
        .map(([device, count]) => ({
          device,
          label: DEVICE_LABELS[device],
          count,
        }))
        .sort((a, b) => b.count - a.count),
      totalVisits
    );

    const countries = withPercentages(
      Array.from(countryMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      totalVisits
    );

    const cities = withPercentages(
      Array.from(cityMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      totalVisits
    );

    const topPages = withPercentages(
      Array.from(pageMap.entries())
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8),
      totalVisits
    );

    return {
      period,
      totalVisits,
      uniqueVisitors,
      dailyVisits: buildDailySeries(period, visits),
      devices,
      countries,
      cities,
      topPages,
    };
  } catch {
    return emptyAnalytics(period);
  }
}
