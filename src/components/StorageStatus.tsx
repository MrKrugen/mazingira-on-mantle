"use client";

import { formatEther } from "viem";
import { useStorageStatus, usePayStorageFee, useRedeemTokens } from "@/hooks/useContract";

type Props = {
  tokenId: number;
  holderAddress: `0x${string}`;
};

export function StorageStatus({ tokenId, holderAddress }: Props) {
  const { data: status, isLoading } = useStorageStatus(tokenId, holderAddress);
  const { payStorageFee, isPending: isPaying,    isSuccess: paidOk,     error: payError }    = usePayStorageFee();
  const { redeemTokens, isPending: isRedeeming, isSuccess: redeemedOk, error: redeemError } = useRedeemTokens();

  if (isLoading) {
    return (
      <div className="mt-4 h-24 animate-pulse rounded-3xl bg-stone-100" />
    );
  }

  if (!status) return null; // buyer has no active purchase for this token

  const { daysSincePurchase, freeStorageDaysRemaining, freeStorageDays, maxStorageDays,
          storageFeePerKgDailyMNT, totalFeesAccrued, bufferDepositRemaining, status: phase } = status;

  // Timeline bar: maps day → percentage
  const progressPct = Math.min(100, (daysSincePurchase / maxStorageDays) * 100);
  const freePct     = (freeStorageDays / maxStorageDays) * 100;

  const bannerConfig = {
    free:        { bg: "bg-emerald-50  border-emerald-200", dot: "bg-emerald-500", text: "text-emerald-800", label: `Free storage — ${freeStorageDaysRemaining} day${freeStorageDaysRemaining !== 1 ? "s" : ""} remaining` },
    paying:      { bg: "bg-amber-50    border-amber-200",   dot: "bg-amber-500",   text: "text-amber-800",   label: `Storage fees active — ${storageFeePerKgDailyMNT} MNT/kg/day` },
    critical:    { bg: "bg-red-50      border-red-300",     dot: "bg-red-500",     text: "text-red-800",     label: `CRITICAL — ${maxStorageDays - daysSincePurchase} days to forced liquidation` },
    liquidating: { bg: "bg-red-100     border-red-400",     dot: "bg-red-600",     text: "text-red-900",     label: "OVERDUE — eligible for forced liquidation" },
  }[phase];

  return (
    <div className="mt-4 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm space-y-5">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-400">Storage Status</p>

      {/* Banner */}
      <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${bannerConfig.bg}`}>
        <span className={`h-2 w-2 shrink-0 rounded-full ${bannerConfig.dot}`} />
        <p className={`text-sm font-black ${bannerConfig.text}`}>{bannerConfig.label}</p>
      </div>

      {/* Timeline bar */}
      <div>
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-stone-100">
          {/* free period zone */}
          <div
            className="absolute inset-y-0 left-0 bg-emerald-200"
            style={{ width: `${freePct}%` }}
          />
          {/* current position */}
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all ${
              phase === "free" ? "bg-emerald-400" :
              phase === "paying" ? "bg-amber-400" : "bg-red-500"
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[10px] font-bold text-stone-400">
          <span>Day 0</span>
          <span>Free {freeStorageDays}d</span>
          <span>Max {maxStorageDays}d</span>
        </div>
        <p className="mt-1 text-center text-xs font-bold text-stone-500">
          Day {daysSincePurchase} of {maxStorageDays}
        </p>
        {phase === "free" && (
          <p className="mt-2 text-center text-[11px] text-stone-400">
            Storage fees begin on day {freeStorageDays + 1}
          </p>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-stone-50 p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">Fees Accrued</p>
          <p className="mt-1 text-sm font-black text-stone-900">{formatEther(totalFeesAccrued)} MNT</p>
        </div>
        <div className="rounded-2xl bg-stone-50 p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">Buffer Remaining</p>
          <p className="mt-1 text-sm font-black text-stone-900">{formatEther(bufferDepositRemaining)} MNT</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-2">
        {(redeemedOk || paidOk) ? (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-center text-xs font-black text-emerald-800">
            {redeemedOk ? "Redemption submitted. Contact vendor for physical collection." : "Storage fee paid from buffer."}
          </div>
        ) : (
          <>
            <button
              onClick={() => redeemTokens(tokenId, 1)}
              disabled={isRedeeming || isPaying}
              className="w-full rounded-2xl bg-[#132317] py-3 text-sm font-black text-white hover:bg-stone-800 disabled:bg-stone-300 transition-colors"
            >
              {isRedeeming ? "Confirming redemption..." : "Redeem Physical Goods"}
            </button>

            <a
              href={`/secondary?tab=sell&tokenId=${tokenId}`}
              className="block w-full rounded-2xl border border-stone-200 py-3 text-center text-sm font-black text-stone-600 hover:border-emerald-300 hover:text-emerald-800 transition-colors"
            >
              Sell My Tokens
            </a>

            {(phase === "paying" || phase === "critical") && (
              <button
                onClick={() => payStorageFee(tokenId)}
                disabled={isPaying || isRedeeming || totalFeesAccrued === 0n}
                className="w-full rounded-2xl border border-amber-200 bg-amber-50 py-3 text-sm font-black text-amber-800 hover:bg-amber-100 disabled:opacity-50 transition-colors"
              >
                {isPaying ? "Confirming payment..." : `Pay Storage Fees (${formatEther(totalFeesAccrued)} MNT)`}
              </button>
            )}
          </>
        )}
      </div>

      {(payError || redeemError) && (
        <p className="text-xs text-red-500 text-center">
          {(payError ?? redeemError)!.message.slice(0, 120)}
        </p>
      )}
    </div>
  );
}
