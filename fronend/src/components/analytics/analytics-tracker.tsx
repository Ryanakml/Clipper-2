"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { AnalyticsEventInput } from "~/lib/analytics";

const SESSION_STORAGE_KEY = "analytics:session_id";
const VISITOR_STORAGE_KEY = "analytics:visitor_id";
const SCROLL_MILESTONES = [25, 50, 75, 100] as const;

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getOrCreateStorageValue(storage: Storage, key: string) {
  const existingValue = storage.getItem(key);
  if (existingValue) return existingValue;

  const newValue = createId();
  storage.setItem(key, newValue);
  return newValue;
}

function getDeviceType(width: number) {
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

function getBrowserName(userAgent: string) {
  if (/edg/i.test(userAgent)) return "Edge";
  if (/chrome|crios/i.test(userAgent) && !/edg/i.test(userAgent)) {
    return "Chrome";
  }
  if (/safari/i.test(userAgent) && !/chrome|crios|android/i.test(userAgent)) {
    return "Safari";
  }
  if (/firefox|fxios/i.test(userAgent)) return "Firefox";
  if (/opr|opera/i.test(userAgent)) return "Opera";
  return "Unknown";
}

function getOsName(userAgent: string) {
  if (/windows/i.test(userAgent)) return "Windows";
  if (/iphone|ipad|ipod/i.test(userAgent)) return "iOS";
  if (/android/i.test(userAgent)) return "Android";
  if (/mac os x|macintosh/i.test(userAgent)) return "macOS";
  if (/linux/i.test(userAgent)) return "Linux";
  return "Unknown";
}

function buildBasePayload(): Omit<
  AnalyticsEventInput,
  "eventType" | "occurredAt" | "pagePath"
> | null {
  try {
    const sessionId = getOrCreateStorageValue(sessionStorage, SESSION_STORAGE_KEY);
    const visitorId = getOrCreateStorageValue(localStorage, VISITOR_STORAGE_KEY);
    const userAgent = navigator.userAgent;

    return {
      pageTitle: document.title || undefined,
      sessionId,
      visitorId,
      deviceType: getDeviceType(window.innerWidth),
      browserName: getBrowserName(userAgent),
      osName: getOsName(userAgent),
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      language: navigator.language || undefined,
      referrer: document.referrer || undefined,
      userAgent,
      metadata: undefined,
    };
  } catch {
    return null;
  }
}

function sendAnalyticsEvent(payload: AnalyticsEventInput) {
  const body = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon("/api/analytics", blob)) return;
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

function trackEvent(
  eventType: AnalyticsEventInput["eventType"],
  pagePath: string,
  partialPayload: Partial<AnalyticsEventInput> = {},
) {
  const basePayload = buildBasePayload();
  if (!basePayload) return;

  sendAnalyticsEvent({
    ...basePayload,
    ...partialPayload,
    eventType,
    pagePath,
    occurredAt: new Date().toISOString(),
  });
}

function getPagePath(pathname: string, searchParams: URLSearchParams) {
  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const trackedPageRef = useRef<string | null>(null);
  const trackedMilestonesRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const currentPagePath = getPagePath(pathname, searchParams);
    trackedMilestonesRef.current = new Set();

    if (trackedPageRef.current === currentPagePath) return;

    trackedPageRef.current = currentPagePath;

    const metadata = Object.fromEntries(
      Array.from(searchParams.entries()).filter(([key]) =>
        /^utm_|^gclid$|^fbclid$/i.test(key),
      ),
    );

    trackEvent("page_view", currentPagePath, {
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    });
  }, [pathname, searchParams]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const trackedElement = target.closest<HTMLElement>("[data-analytics], a, button");
      if (!trackedElement) return;

      const currentPagePath = getPagePath(pathname, searchParams);
      const href =
        trackedElement instanceof HTMLAnchorElement ? trackedElement.href : undefined;
      const analyticsLabel =
        trackedElement.dataset.analyticsLabel ??
        trackedElement.dataset.analytics ??
        trackedElement.getAttribute("aria-label") ??
        trackedElement.textContent?.trim() ??
        undefined;

      trackEvent("click", currentPagePath, {
        elementLabel: analyticsLabel?.slice(0, 512),
        elementTarget:
          trackedElement.dataset.analyticsTarget ??
          href ??
          undefined,
        elementType:
          trackedElement.dataset.analyticsType ??
          trackedElement.tagName.toLowerCase(),
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname, searchParams]);

  useEffect(() => {
    const onScroll = () => {
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (documentHeight <= 0) return;

      const currentPercent = Math.round((window.scrollY / documentHeight) * 100);
      const currentPagePath = getPagePath(pathname, searchParams);

      for (const milestone of SCROLL_MILESTONES) {
        if (
          currentPercent >= milestone &&
          !trackedMilestonesRef.current.has(milestone)
        ) {
          trackedMilestonesRef.current.add(milestone);
          trackEvent("scroll_depth", currentPagePath, {
            scrollPercent: milestone,
          });
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname, searchParams]);

  return null;
}
