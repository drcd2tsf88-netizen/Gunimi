"use server";

// Signal Lifecycle Verification
// Authority: docs/blueprints/SIGNAL_ENGINE_BLUEPRINT.md
//
// Runs an end-to-end lifecycle test for a single signal:
//   produce → claim → dismiss → restore suppression → resolve → archive
//
// Uses a synthetic entity ID that cannot match any real business entity.
// The test signal is archived (not deleted) — a permanent record of the test run.
// Only callable by workspace owners/admins.

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import {
  produceSignal,
  claimSignal,
  dismissSignal,
  resolveSignal,
  expireSignals,
  restoreExpiredSuppressions,
} from "@/lib/signals/engine";
import type { SignalState } from "@/lib/signals/types";

type StepResult = {
  step: string;
  pass: boolean;
  expected: string;
  actual: string;
  durationMs: number;
};

export type LifecycleVerificationReport = {
  workspaceId: string;
  signalId: string | null;
  passed: boolean;
  steps: StepResult[];
  totalDurationMs: number;
  error?: string;
};

async function fetchSignalState(signalId: string): Promise<{
  state: SignalState | null;
  claimedBy: string | null;
  suppressedUntil: string | null;
  resolvedAt: string | null;
  evolutionHistory: unknown[];
}> {
  const { data } = await supabaseAdmin
    .from("workspace_signals")
    .select("state, claimed_by, suppressed_until, resolved_at, evolution_history")
    .eq("id", signalId)
    .maybeSingle();

  if (!data) return { state: null, claimedBy: null, suppressedUntil: null, resolvedAt: null, evolutionHistory: [] };

  return {
    state: data.state as SignalState,
    claimedBy: data.claimed_by as string | null,
    suppressedUntil: data.suppressed_until as string | null,
    resolvedAt: data.resolved_at as string | null,
    evolutionHistory: (data.evolution_history as unknown[]) ?? [],
  };
}

export async function verifySignalLifecycle(): Promise<LifecycleVerificationReport> {
  const totalStart = Date.now();
  const steps: StepResult[] = [];
  let signalId: string | null = null;

  try {
    const [user, workspace] = await Promise.all([getUser(), getCurrentWorkspace()]);
    if (!user || !workspace) {
      return {
        workspaceId: "unknown",
        signalId: null,
        passed: false,
        steps: [],
        totalDurationMs: Date.now() - totalStart,
        error: "Unauthorized or no workspace",
      };
    }

    // Verify caller is owner or admin
    const { data: membership } = await supabaseAdmin
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspace.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!membership || !["owner", "admin"].includes(membership.role as string)) {
      return {
        workspaceId: workspace.id,
        signalId: null,
        passed: false,
        steps: [],
        totalDurationMs: Date.now() - totalStart,
        error: "Insufficient permissions — owner or admin required",
      };
    }

    // Synthetic entity ID — cannot match any real entity (fixed prefix)
    const testEntityId = `00000000-0000-0000-0000-lifecycle-test`;
    const workspaceId = workspace.id;

    // ── STEP 1: Produce ──────────────────────────────────────────────────────

    let stepStart = Date.now();
    const produced = await produceSignal({
      workspaceId,
      entityType: "contact",
      entityId: testEntityId,
      type: "contact_stale",
      confidence: "high",
      evidenceData: { days: 99 },
      producedBy: "contact_resolver",
      origin: "lifecycle_test",
    });

    signalId = produced?.id ?? null;
    const step1State = signalId ? (await fetchSignalState(signalId)).state : null;
    const step1Pass = step1State === "active" && signalId !== null;

    steps.push({
      step: "1 — produce",
      pass: step1Pass,
      expected: "active",
      actual: step1State ?? "signal not created",
      durationMs: Date.now() - stepStart,
    });

    if (!signalId || !step1Pass) {
      return {
        workspaceId,
        signalId,
        passed: false,
        steps,
        totalDurationMs: Date.now() - totalStart,
        error: "Produce step failed — cannot continue lifecycle test",
      };
    }

    // ── STEP 2: Claim ────────────────────────────────────────────────────────

    stepStart = Date.now();
    await claimSignal(signalId, "today_focus");
    const step2Data = await fetchSignalState(signalId);
    const step2Pass = step2Data.state === "claimed" && step2Data.claimedBy === "today_focus";

    steps.push({
      step: "2 — claim",
      pass: step2Pass,
      expected: "claimed by today_focus",
      actual: `${step2Data.state ?? "null"} / claimedBy=${step2Data.claimedBy ?? "null"}`,
      durationMs: Date.now() - stepStart,
    });

    // ── STEP 3: Dismiss (snooze) ─────────────────────────────────────────────

    stepStart = Date.now();
    await dismissSignal(signalId, "not_urgent");
    const step3Data = await fetchSignalState(signalId);
    const step3Pass =
      step3Data.state === "suppressed" && step3Data.suppressedUntil !== null;

    steps.push({
      step: "3 — dismiss (not_urgent)",
      pass: step3Pass,
      expected: "suppressed with suppressedUntil set",
      actual: `${step3Data.state ?? "null"} / suppressedUntil=${step3Data.suppressedUntil ?? "null"}`,
      durationMs: Date.now() - stepStart,
    });

    // ── STEP 4: Simulate time passing — force suppressedUntil to the past ────

    stepStart = Date.now();
    const pastDate = new Date(Date.now() - 60 * 1000).toISOString(); // 1 minute ago
    await supabaseAdmin
      .from("workspace_signals")
      .update({ suppressed_until: pastDate })
      .eq("id", signalId);

    const step4Data = await fetchSignalState(signalId);
    const step4Pass = step4Data.suppressedUntil === pastDate;

    steps.push({
      step: "4 — force suppressedUntil to past (simulate time)",
      pass: step4Pass,
      expected: `suppressedUntil = ${pastDate}`,
      actual: `suppressedUntil = ${step4Data.suppressedUntil ?? "null"}`,
      durationMs: Date.now() - stepStart,
    });

    // ── STEP 5: Restore expired suppression ──────────────────────────────────

    stepStart = Date.now();
    const restored = await restoreExpiredSuppressions(workspaceId);
    const step5Data = await fetchSignalState(signalId);
    const step5Pass = step5Data.state === "active" && restored > 0;

    steps.push({
      step: "5 — restoreExpiredSuppressions",
      pass: step5Pass,
      expected: "active (suppression lifted)",
      actual: `${step5Data.state ?? "null"} / restored=${restored}`,
      durationMs: Date.now() - stepStart,
    });

    // ── STEP 6: Resolve ──────────────────────────────────────────────────────

    stepStart = Date.now();
    await resolveSignal(signalId, "lifecycle_test_complete");
    const step6Data = await fetchSignalState(signalId);
    const step6Pass = step6Data.state === "archived" && step6Data.resolvedAt !== null;

    steps.push({
      step: "6 — resolve",
      pass: step6Pass,
      expected: "archived with resolvedAt set",
      actual: `${step6Data.state ?? "null"} / resolvedAt=${step6Data.resolvedAt ?? "null"}`,
      durationMs: Date.now() - stepStart,
    });

    // ── STEP 7: Evolution history ─────────────────────────────────────────────

    stepStart = Date.now();
    const step7Pass = step6Data.evolutionHistory.length >= 2;

    steps.push({
      step: "7 — evolution history",
      pass: step7Pass,
      expected: "≥2 evolution events (initial + resolved)",
      actual: `${step6Data.evolutionHistory.length} event(s)`,
      durationMs: Date.now() - stepStart,
    });

    // ── STEP 8: TTL expiry sweep ─────────────────────────────────────────────
    // Produce a second test signal with an already-elapsed expiresAt,
    // then run expireSignals() and verify it gets archived.

    stepStart = Date.now();
    const pastExpiry = new Date(Date.now() - 5000).toISOString();
    const expiredSignal = await produceSignal({
      workspaceId,
      entityType: "contact",
      entityId: `${testEntityId}-ttl`,
      type: "contact_stale",
      confidence: "high",
      evidenceData: { days: 1 },
      producedBy: "contact_resolver",
      origin: "lifecycle_test_ttl",
      expiresAt: pastExpiry,
    });

    if (expiredSignal?.id) {
      const expiredCount = await expireSignals(workspaceId);
      const expiredData = await fetchSignalState(expiredSignal.id);
      const step8Pass = expiredData.state === "archived" && expiredCount > 0;

      steps.push({
        step: "8 — TTL expiry sweep",
        pass: step8Pass,
        expected: "archived by expireSignals()",
        actual: `${expiredData.state ?? "null"} / swept=${expiredCount}`,
        durationMs: Date.now() - stepStart,
      });
    } else {
      steps.push({
        step: "8 — TTL expiry sweep",
        pass: false,
        expected: "archived by expireSignals()",
        actual: "could not produce test signal",
        durationMs: Date.now() - stepStart,
      });
    }

    const passed = steps.every((s) => s.pass);

    return {
      workspaceId,
      signalId,
      passed,
      steps,
      totalDurationMs: Date.now() - totalStart,
    };
  } catch (err) {
    return {
      workspaceId: "unknown",
      signalId,
      passed: false,
      steps,
      totalDurationMs: Date.now() - totalStart,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}
