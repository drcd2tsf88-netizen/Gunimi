"use client";

import { useState, useEffect, useCallback } from "react";
import { savePushSubscription } from "@/server/actions/push/savePushSubscription";
import { deletePushSubscription } from "@/server/actions/push/deletePushSubscription";

export type PushStatus = "unsupported" | "loading" | "default" | "granted" | "denied";

export function usePushNotifications() {
  const [status, setStatus] = useState<PushStatus>("loading");
  const [endpoint, setEndpoint] = useState<string | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window;

  useEffect(() => {
    if (!isSupported) {
      setStatus("unsupported");
      return;
    }

    const permission = Notification.permission;
    if (permission === "denied") { setStatus("denied"); return; }
    if (permission === "default") { setStatus("default"); return; }

    // Already granted — check if we have an active subscription
    navigator.serviceWorker.ready.then(async (reg) => {
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        setEndpoint(sub.endpoint);
        setStatus("granted");
      } else {
        setStatus("default");
      }
    });
  }, [isSupported]);

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        return false;
      }

      const reg = await navigator.serviceWorker.ready;
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) return false;

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const json = sub.toJSON();
      const p256dh = json.keys?.p256dh;
      const auth = json.keys?.auth;
      if (!p256dh || !auth) return false;

      const ok = await savePushSubscription({ endpoint: sub.endpoint, p256dh, auth });
      if (ok) {
        setEndpoint(sub.endpoint);
        setStatus("granted");
      }
      return ok;
    } catch {
      return false;
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported || !endpoint) return false;

    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) await sub.unsubscribe();

      await deletePushSubscription(endpoint);
      setEndpoint(null);
      setStatus("default");
      return true;
    } catch {
      return false;
    }
  }, [isSupported, endpoint]);

  return { status, subscribe, unsubscribe };
}

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const buf = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    buf[i] = rawData.charCodeAt(i);
  }
  return buf;
}
