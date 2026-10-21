import webpush from "web-push";
import { getVapidKeys } from "./vapid";
import { logger } from "@/lib/logger";

export type PushPayload = {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: { href: string };
};

export type PushSubscriptionRecord = {
  endpoint: string;
  p256dh: string;
  auth_key: string;
};

export type SendResult = "ok" | "expired" | "error";

export async function sendPushNotification(
  subscription: PushSubscriptionRecord,
  payload: PushPayload,
): Promise<SendResult> {
  try {
    const { publicKey, privateKey, subject } = getVapidKeys();

    webpush.setVapidDetails(subject, publicKey, privateKey);

    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth_key,
        },
      },
      JSON.stringify({
        title: payload.title,
        body: payload.body,
        icon: payload.icon ?? "/icon-192.png",
        badge: payload.badge ?? "/icon-192.png",
        tag: payload.tag,
        data: payload.data ?? { href: "/dashboard" },
      }),
    );

    return "ok";
  } catch (err: unknown) {
    const status = (err as { statusCode?: number })?.statusCode;
    // 404 / 410 = subscription expired or unsubscribed
    if (status === 404 || status === 410) return "expired";
    logger.error("[Push] sendPushNotification failed", err);
    return "error";
  }
}
