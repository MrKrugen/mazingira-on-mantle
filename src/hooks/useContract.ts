"use client";

import {
  useReadContract,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { MAZINGIRA_RWA_ABI, CONTRACT_ADDRESSES } from "@/lib/contracts";
import { mantleSepolia } from "@/lib/wagmi";

const ZERO = "0x0000000000000000000000000000000000000000";

function useContractAddress() {
  const chainId = useChainId();
  if (chainId !== mantleSepolia.id && CONTRACT_ADDRESSES.mantle !== ZERO) {
    return CONTRACT_ADDRESSES.mantle;
  }
  return CONTRACT_ADDRESSES.mantleSepolia;
}

export function useNextTokenId() {
  const address = useContractAddress();
  return useReadContract({
    address,
    abi: MAZINGIRA_RWA_ABI,
    functionName: "nextTokenId",
  });
}

export function useAllProducts() {
  const address = useContractAddress();
  const { data: nextTokenId } = useNextTokenId();
  const tokenCount = nextTokenId ? Number(nextTokenId) - 1 : 0;

  const contracts = Array.from({ length: tokenCount }, (_, i) => ({
    address,
    abi: MAZINGIRA_RWA_ABI,
    functionName: "getProduct" as const,
    args: [BigInt(i + 1)] as [bigint],
  }));

  const { data, isLoading, refetch } = useReadContracts({
    contracts,
    query: { enabled: tokenCount > 0 },
  });

  const products = data
    ?.map((r, i) => (r.result ? { ...r.result, tokenId: i + 1 } : null))
    .filter(Boolean) ?? [];

  return { products, isLoading: isLoading || (!data && tokenCount > 0), tokenCount, refetch };
}

export function useProduct(tokenId: number) {
  const address = useContractAddress();
  return useReadContract({
    address,
    abi: MAZINGIRA_RWA_ABI,
    functionName: "getProduct",
    args: [BigInt(tokenId)],
    query: { enabled: tokenId > 0 },
  });
}

export function useIsApprovedVendor(vendorAddress?: `0x${string}`) {
  const address = useContractAddress();
  return useReadContract({
    address,
    abi: MAZINGIRA_RWA_ABI,
    functionName: "approvedVendors",
    args: vendorAddress ? [vendorAddress] : undefined,
    query: { enabled: !!vendorAddress },
  });
}

export function usePurchaseProduct() {
  const address = useContractAddress();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const purchase = (tokenId: number, quantity: number, pricePerUnit: bigint) => {
    const totalCost = pricePerUnit * BigInt(quantity);
    const buffer    = totalCost / 10n; // 10% buffer deposit
    writeContract({
      address,
      abi: MAZINGIRA_RWA_ABI,
      functionName: "purchaseProduct",
      args: [BigInt(tokenId), BigInt(quantity)],
      value: totalCost + buffer,
    });
  };

  return { purchase, isPending, isConfirming, isSuccess, hash, error };
}

export function useListProduct() {
  const address = useContractAddress();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const listProduct = (params: {
    metadataURI: string;
    pricePerUnit: string;
    supply: number;
    category: number;
    co2SavedKgPerUnit: number;
  }) => {
    writeContract({
      address,
      abi: MAZINGIRA_RWA_ABI,
      functionName: "listProduct",
      args: [
        params.metadataURI,
        parseEther(params.pricePerUnit),
        BigInt(params.supply),
        params.category,
        BigInt(params.co2SavedKgPerUnit),
      ],
    });
  };

  return { listProduct, isPending, isConfirming, isSuccess, hash, error };
}

export function useUpdateMetadata() {
  const address = useContractAddress();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const updateMetadata = (tokenId: number, newMetadataURI: string) => {
    writeContract({
      address,
      abi: MAZINGIRA_RWA_ABI,
      functionName: "updateMetadata",
      args: [BigInt(tokenId), newMetadataURI],
    });
  };

  return { updateMetadata, isPending, isConfirming, isSuccess, hash, error };
}

// ─── Storage hooks ────────────────────────────────────────────────────────────

export type StorageStatus = "free" | "paying" | "critical" | "liquidating";

export type StorageStatusData = {
  daysSincePurchase:        number;
  freeStorageDaysRemaining: number;
  freeStorageDays:          number;
  maxStorageDays:           number;
  storageFeePerKgDailyMNT:  string;  // formatted MNT string
  totalFeesAccrued:         bigint;
  bufferDepositRemaining:   bigint;
  status:                   StorageStatus;
};

export function useStorageStatus(
  tokenId: number,
  holderAddress?: `0x${string}`
): { data: StorageStatusData | null; isLoading: boolean } {
  const address = useContractAddress();
  const enabled = tokenId > 0 && !!holderAddress;

  const { data, isLoading } = useReadContracts({
    contracts: enabled
      ? [
          { address, abi: MAZINGIRA_RWA_ABI, functionName: "purchaseTimestamp" as const, args: [BigInt(tokenId), holderAddress!] },
          { address, abi: MAZINGIRA_RWA_ABI, functionName: "bufferDeposit"     as const, args: [BigInt(tokenId), holderAddress!] },
          { address, abi: MAZINGIRA_RWA_ABI, functionName: "calculateStorageFee" as const, args: [BigInt(tokenId), holderAddress!] },
          { address, abi: MAZINGIRA_RWA_ABI, functionName: "getProduct"         as const, args: [BigInt(tokenId)] },
        ]
      : [],
    query: { enabled },
  });

  if (!data || !enabled) return { data: null, isLoading };

  const ts      = data[0]?.result as bigint | undefined;
  const deposit = data[1]?.result as bigint | undefined;
  const fee     = data[2]?.result as bigint | undefined;
  const product = data[3]?.result as { freeStorageDays: bigint; maxStorageDays: bigint; storageFeePerKgDaily: bigint } | undefined;

  if (!ts || ts === 0n) return { data: null, isLoading };

  const nowSec              = Math.floor(Date.now() / 1000);
  const daysSincePurchase   = Math.floor((nowSec - Number(ts)) / 86_400);
  const freeStorageDays     = product ? Number(product.freeStorageDays) : 30;
  const maxStorageDays      = product ? Number(product.maxStorageDays)  : 90;
  const freeStorageDaysRemaining = Math.max(0, freeStorageDays - daysSincePurchase);
  const dailyFeeWei         = product?.storageFeePerKgDaily ?? 0n;

  let status: StorageStatus;
  if (daysSincePurchase <= freeStorageDays)              status = "free";
  else if (daysSincePurchase <= maxStorageDays - 10)     status = "paying";
  else if (daysSincePurchase <= maxStorageDays)          status = "critical";
  else                                                   status = "liquidating";

  return {
    data: {
      daysSincePurchase,
      freeStorageDaysRemaining,
      freeStorageDays,
      maxStorageDays,
      storageFeePerKgDailyMNT: formatEther(dailyFeeWei),
      totalFeesAccrued:        fee     ?? 0n,
      bufferDepositRemaining:  deposit ?? 0n,
      status,
    },
    isLoading,
  };
}

export function useStorageFee(tokenId: number, holderAddress?: `0x${string}`) {
  const address = useContractAddress();
  return useReadContract({
    address,
    abi: MAZINGIRA_RWA_ABI,
    functionName: "calculateStorageFee",
    args: holderAddress ? [BigInt(tokenId), holderAddress] : undefined,
    query: { enabled: tokenId > 0 && !!holderAddress },
  });
}

export function usePayStorageFee() {
  const address = useContractAddress();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const payStorageFee = (tokenId: number) => {
    writeContract({
      address,
      abi: MAZINGIRA_RWA_ABI,
      functionName: "payStorageFee",
      args: [BigInt(tokenId)],
    });
  };

  return { payStorageFee, isPending, isConfirming, isSuccess, hash, error };
}

export function useRedeemTokens() {
  const address = useContractAddress();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const redeemTokens = (tokenId: number, quantity: number) => {
    writeContract({
      address,
      abi: MAZINGIRA_RWA_ABI,
      functionName: "redeemTokens",
      args: [BigInt(tokenId), BigInt(quantity)],
    });
  };

  return { redeemTokens, isPending, isConfirming, isSuccess, hash, error };
}

export function useHeldTokens(holderAddress?: `0x${string}`) {
  const address = useContractAddress();
  const { data: nextTokenId } = useNextTokenId();
  const tokenCount = nextTokenId ? Number(nextTokenId) - 1 : 0;

  const contracts =
    holderAddress && tokenCount > 0
      ? Array.from({ length: tokenCount }, (_, i) => ({
          address,
          abi: MAZINGIRA_RWA_ABI,
          functionName: "balanceOf" as const,
          args: [holderAddress, BigInt(i + 1)] as [`0x${string}`, bigint],
        }))
      : [];

  const { data, isLoading } = useReadContracts({
    contracts,
    query: { enabled: !!holderAddress && tokenCount > 0 },
  });

  const heldTokens = (
    data
      ?.map((r, i) => {
        const qty = r.result as bigint | undefined;
        return qty && qty > 0n ? { tokenId: i + 1, quantity: Number(qty) } : null;
      })
      .filter((h): h is { tokenId: number; quantity: number } => h !== null) ?? []
  );

  return { heldTokens, isLoading: isLoading || (!data && tokenCount > 0) };
}
