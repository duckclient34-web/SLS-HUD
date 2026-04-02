"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

type Category = "script" | "fflags" | "desync" | "async";
type Media = { type: "image"; src: string; alt: string };

type ScriptItem = {
  slug: string;
  name: string;
  description: string;
  category: Category;
  tags: string[];
  updated: string;
  script?: string;
  repoUrl?: string;
  media?: Media;
};

const SCRIPTS: ScriptItem[] = [
  {
    slug: "duck-client",
    name: "Duck Client",
    description: "Script loader.",
    category: "script",
    tags: ["loader"],
    updated: "2026-04-02",
    script:
      'loadstring(game:HttpGet("https://project-fq58s.vercel.app/api/script?token=DuckClient2026"))()',
    media: { type: "image", src: "/scripts/duck-client.webp", alt: "Duck Client preview" },
  },
  {
    slug: "lock-in",
    name: "Lock In",
    description:
      "Lock in script is a script for FSS/SLS which allows defenders and gks with poop prediction lock in by locking onto the ball itself.",
    category: "script",
    tags: ["fss", "sls", "gk", "defender"],
    updated: "2026-04-02",
    script:
      'loadstring(game:HttpGet("https://raw.githubusercontent.com/Cortzalno666/NectoVerse-Industries-Data/refs/heads/master/Scripts%20Folder/Lock%20in.lol"))()',
    repoUrl: "https://github.com/Cortzalno666/NectoVerse-Industries-Data",
  },

  {
    slug: "async-updated-physics",
    name: "Async updated (Physics).",
    description: "FastFlags preset (Physics).",
    category: "fflags",
    tags: ["physics", "async"],
    updated: "2026-04-02",
    script: `{
  "FFlagUGCValidationFixResetPhysicsError": true,
  "DFIntS2PhysicsSenderRate": 35200,
  "DFIntPhysicsReceiveNumParallelTasks": 12,
  "DFIntPhysicsAnalyticsHighFrequencyIntervalSec": 20,
  "DFFlagSimEnableStepPhysicsSelective": false,
  "DFFlagSimEnableStepPhysics": false,
  "DFFlagSimClearNetworkPhysicsDataForAssembly": true,
  "DFFlagPreventReturnOfElevatedPhysicsFPS": false,
  "DFFlagPhysicsMechanismCacheOptimizeAlloc": true,
  "DFFlagDebugReportElevatedPhysicsFPSTOGA": false
}`,
  },
  {
    slug: "no-reach-fastflag-better-with-async",
    name: "No reach fastflag (Better effect with async)",
    description: "FastFlags preset (no reach).",
    category: "fflags",
    tags: ["network", "async"],
    updated: "2026-04-02",
    script: `{
  "FStringCoreScriptBacktraceErrorUploadToken": "null",
  "FStringInGameMenuChromeForcedUserIds": "1353919681",
  "FLogNetwork": "7",
  "FIntLmsClientRollout2": "0",
  "FIntTerrainArraySliceSize": "0",
  "FIntRenderShadowIntensity": "0",
  "FIntDefaultMeshCacheSizeMB": "256",
  "FIntRakNetResendBufferArrayLength": "1024",
  "FIntUGCValidationTorsoThresholdSide": "200",
  "FIntUGCValidationTorsoThresholdBack": "200",
  "FIntNetworkPhysicsLagCompensationMs": "120",
  "FIntUGCValidationTorsoThresholdFront": "200",
  "FIntUGCValidationLeftLegThresholdSide": "36",
  "FIntUGCValidationLeftLegThresholdBack": "40",
  "FIntUGCValidationLeftArmThresholdSide": "40",
  "FIntUGCValidationLeftArmThresholdBack": "23",
  "FIntUGCValidationRightLegThresholdSide": "76",
  "FIntUGCValidationRightLegThresholdBack": "80",
  "FIntUGCValidationRightArmThresholdSide": "80",
  "FIntUGCValidationRightArmThresholdBack": "46",
  "FIntUGCValidationLeftLegThresholdFront": "40",
  "FIntUGCValidationLeftArmThresholdFront": "27",
  "FIntUGCValidationRightLegThresholdFront": "80",
  "FIntUGCValidationRightArmThresholdFront": "50",
  "FIntRakNetDatagramMessageIdArrayLength": "1024",
  "FIntMeshContentProviderForceCacheSize": "268435456",
  "FIntEmotesAnimationsPerPlayerCacheSize": "16777216",
  "FFlagBatchAssetApi": "True",
  "FFlagTerrainEnable": "True",
  "FFlagDisablePostFx": "True",
  "FFlagOptimizeNetwork": "True",
  "FFlagPreloadAllFonts": "True",
  "FFlagLuaAppSystemBar": "False",
  "FFlagDontCreatePingJob": "True",
  "FFlagAdServiceEnabled": "False",
  "FFlagReconnectDisabled": "True",
  "FFlagTopBarUseNewBadge": "True",
  "FFlagLuaAppExitModal2": "False",
  "FFlagEnableInGameMenuV3": "True",
  "FFlagDisableNewIGMinDUA": "True",
  "FFlagEnableV3MenuABTest3": "True",
  "FFlagGpuGeometryManager7": "True",
  "FFlagRenderDisableShadows": "False",
  "FFlagOptimizeServerTickRate": "True",
  "FFlagOptimizeNetworkRouting": "True",
  "FFlagLuaAppExitModalDoNotShow": "True",
  "FFlagOptimizeNetworkTransport": "True",
  "FFlagEnableInGameMenuControls": "False",
  "FFlagEnableMenuControlsABTest": "False",
  "FFlagCoreGuiTypeSelfViewPresent": "False",
  "FFlagAnimationClipMemCacheEnabled": "True",
  "FFlagEnableInGameMenuModernization": "False",
  "FFlagEnableMenuModernizationABTest": "False",
  "FFlagEnableInGameMenuChromeABTest2": "False",
  "FFlagDebugForceFutureIsBrightPhase2": "True",
  "FFlagDebugForceFutureIsBrightPhase3": "True",
  "FFlagEnableMenuModernizationABTest2": "False",
  "FFlagInGameMenuV1FullScreenTitleBar": "False",
  "FFlagHandleAltEnterFullscreenManually": "False",
  "FFlagEnableReportAbuseMenuRoactABTest2": "False",
  "FFlagTaskSchedulerLimitTargetFpsTo2402": "False",
  "DFStringRobloxAnalyticsURL": "null",
  "DFStringHttpPointsReporterUrl": "null",
  "DFStringAltHttpPointsReporterUrl": "null",
  "DFStringTelegrafHTTPTransportUrl": "null",
  "DFStringAltTelegrafHTTPTransportUrl": "null",
  "DFStringCrashUploadToBacktraceBaseUrl": "null",
  "DFStringAnalyticsEventStreamUrlEndpoint": "null",
  "DFStringCrashUploadToBacktraceMacPlayerToken": "null",
  "DFStringCrashUploadToBacktraceWindowsPlayerToken": "null",
  "DFIntRakNetLoopMs": "1",
  "DFIntServerTickRate": "60",
  "DFIntRaycastMaxDistance": "5",
  "DFIntWarpFactor": "2147483648",
  "DFIntNetworkPrediction": "115",
  "DFIntConnectionMTUSize": "900",
  "DFIntS2PhysicsSenderRate": "300",
  "DFIntWorldStepMax": "2147483648",
  "DFIntOptimizePingThreshold": "50",
  "DFIntNetworkLatencyTolerance": "1",
  "DFIntRakNetResendRttMultiple": "1",
  "DFIntCanHideGuiGroupId": "32380007",
  "DFIntPlayerNetworkUpdateRate": "60",
  "DFIntRakNetMtuValue3InBytes": "1200",
  "DFIntRakNetMtuValue2InBytes": "1240",
  "DFIntRakNetMtuValue1InBytes": "1280",
  "DFIntCodecMaxIncomingPackets": "100",
  "DFIntWaitOnRecvFromLoopEndedMS": "100",
  "DFIntPlayerNetworkUpdateQueueSize": "20",
  "DFIntWorldStepsOffsetAdjustRate": "-20000",
  "DFIntMaxProcessPacketsJobScaling": "10000",
  "DFIntLargePacketQueueSizeCutoffMB": "1000",
  "DFIntTaskSchedulerTargetFps": "2147483647",
  "DFIntUserIdPlayerNameCacheSize": "33554432",
  "DFIntWaitOnUpdateNetworkLoopEndedMS": "100",
  "DFIntMaxProcessPacketsStepsAccumulated": "0",
  "DFIntMaxProcessPacketsStepsPerCyclic": "5000",
  "DFIntGoogleAnalyticsLoadPlayerHundredth": "0",
  "DFIntHttpCurlConnectionCacheSize": "134217728",
  "DFIntUserIdPlayerNameLifetimeSeconds": "86400",
  "DFIntRaknetBandwidthPingSendEveryXSeconds": "1",
  "DFIntMaxMissedWorldStepsRemembered": "2147483648",
  "DFIntReportOutputDeviceInfoRateHundredthsPercentage": "0",
  "DFIntRaknetBandwidthInfluxHundredthsPercentageV2": "10000",
  "DFIntReportRecordingDeviceInfoRateHundredthsPercentage": "0",
  "DFFlagDebugPerfMode": "True",
  "DFFlagDisableDPIScale": "True",
  "DFFlagSimReportCPUInfo": "False",
  "DFFlagDebugPauseVoxelizer": "True",
  "DFFlagRakNetUseSlidingWindow4": "True",
  "DFFlagQueueDataPingFromSendData": "True",
  "DFFlagDebugAnalyticsSendUserId": "False",
  "DFFlagBatchAssetApiNoFallbackOnFail": "False",
  "DFFlagDebugRenderForceTechnologyVoxel": "True",
  "DFFlagPlayerHumanoidPropertyUpdateRestrict": "False",
  "DFFlagPhysicsSkipNonRealTimeHumanoidForceCalc2": "False"
}`,
  },
  {
    slug: "aerial-fastflags-new-physics",
    name: "Aerial fastflags (with new physics).",
    description:
      "these are not as good as the one mentioned before but you can use them together if you want.",
    category: "fflags",
    tags: ["physics", "aerial"],
    updated: "2026-04-02",
    script: `{
  "FFlagDebugPhysicsSenderDoesNotShrinkSimRadius": "true",
  "FFlagPhysicsRadiusMinAreaGrowth": "250",
  "FFlagPhysicsGrowRadiusWithMinArea": "true",
  "FFlagUseNewPhysicsSmoothingFactor2": "true",
  "FFlagPhysicsEMAInverseSmoothingFactor": "0",
  "FFlagPhysicsEMAInverseSmoothingFactorThrottling": "0",
  "FFlagPhysicsImprovedCyclicExecutivePredictiveThrottlingStepsAhead": "10",
  "FFlagSimStepPhysicsUseRootBodyForBodyFilter": "true",
  "FFlagPhysicsStepsPerSecond": "120",
  "FFlagSimStepPhysicsSupportSelectiveAnimation": "true",
  "FFlagSimSolverFixStepPhysicsForHumanoidTC": "true",
  "FFlagDebugHumanoidNewPhysicsEnabled": "true"
}`,
  },
  {
    slug: "phase-shot-fastflags",
    name: "Phase shot FastFlags",
    description:
      "(not guaranteed but still works sometimes)\nAlso makes it easier to softtap over tackles",
    category: "fflags",
    tags: ["touch", "phase-shot"],
    updated: "2026-04-02",
    script: `{
  "DFIntTouchSenderMaxBandwidthBps": "-2",
  "DFIntTouchSenderMaxBandwidthBpsScaling": "2000"
}`,
  },
];

function formatDate(iso: string) {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
}

const CATEGORY_ORDER: Category[] = ["script", "fflags", "desync", "async"];

async function copyText(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  ta.style.top = "-9999px";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  return (
    <button
      type="button"
      className="btn btnPrimary"
      onClick={async () => {
        try {
          await copyText(text);
          setState("copied");
          window.setTimeout(() => setState("idle"), 1200);
        } catch {
          setState("error");
          window.setTimeout(() => setState("idle"), 1500);
        }
      }}
      aria-label="Copy to clipboard"
      style={{ cursor: "pointer" }}
    >
      {state === "copied" ? "Copied" : state === "error" ? "Copy failed" : "Copy"}
    </button>
  );
}

function MediaPreview({ media, title }: { media: Media; title: string }) {
  return (
    <div
      style={{
        margin: "0 0 12px",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.14)",
        overflow: "hidden",
        background: "rgba(0,0,0,0.20)",
      }}
    >
      <Image
        src={media.src}
        alt={media.alt || title}
        width={1200}
        height={675}
        style={{ width: "100%", height: "auto", display: "block" }}
        priority={false}
      />
    </div>
  );
}

export default function Page() {
  const { data: session, status } = useSession();

  const byCategory = useMemo(() => {
    return Object.fromEntries(
      CATEGORY_ORDER.map((c) => [c, SCRIPTS.filter((s) => s.category === c)])
    ) as Record<Category, ScriptItem[]>;
  }, []);

  return (
    <main>
      <section className="hero">
        <h1 className="h1">Fuck SLS HUD</h1>

        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 12 }}>
          {status === "authenticated" ? (
            <>
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>
                Logged in as {session?.user?.name}
              </span>
              <button className="btn" onClick={() => signOut()}>
                Logout
              </button>
            </>
          ) : (
            <button className="btn btnPrimary" onClick={() => signIn("discord")}>
              Login with Discord
            </button>
          )}
        </div>

        <div className="badges">
          <span className="badge">script</span>
          <span className="badge">fflags</span>
          <span className="badge">desync</span>
          <span className="badge">async</span>
        </div>
      </section>

      <section id="scripts" className="section">
        <h2 className="sectionTitle">Scripts</h2>

        {CATEGORY_ORDER.map((cat) => (
          <div key={cat} className="section" style={{ marginTop: 14 }}>
            <h3
              className="sectionTitle"
              style={{ textTransform: "uppercase", letterSpacing: 1 }}
            >
              {cat} ({byCategory[cat].length})
            </h3>

            <div className="grid">
              {byCategory[cat].map((s) => (
                <article key={s.slug} className="card">
                  <div className="cardTop">
                    <h3 className="cardTitle">{s.name}</h3>
                    <span className="pill">{s.category}</span>
                  </div>

                  <p className="cardDesc">{s.description}</p>

                  {s.media && <MediaPreview media={s.media} title={s.name} />}

                  {s.script && (
                    <div style={{ margin: "0 0 12px" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <CopyButton text={s.script} />
                      </div>

                      <pre
                        style={{
                          margin: "10px 0 0",
                          padding: 12,
                          borderRadius: 12,
                          border: "1px solid rgba(255,255,255,0.14)",
                          background: "rgba(0,0,0,0.20)",
                          color: "rgba(255,255,255,0.86)",
                          overflowX: "auto",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          fontSize: 12,
                          lineHeight: 1.5,
                        }}
                      >
                        <code>{s.script}</code>
                      </pre>
                    </div>
                  )}

                  <div className="meta">
                    {s.tags.map((t) => (
                      <span key={t} className="kv">
                        #{t}
                      </span>
                    ))}
                    <span className="kv">Updated {formatDate(s.updated)}</span>

                    <div className="links">
                      {s.repoUrl && (
                        <a className="btn" href={s.repoUrl} target="_blank" rel="noreferrer">
                          Repo
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
