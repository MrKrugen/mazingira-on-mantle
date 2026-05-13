"use client";

import {
  useReadContract,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { parseEther } from "viem";
import { MAZINGIRA_RWA_ABI, CONTRACT_ADDRESSES } from "@/lib/contracts";
import { mantleSepolia } from "@/lib/wagmi";

function useContractAddress() {
  const chainId = useChainId();
  return chainId === mantleSepolia.id
    ? CONTRACT_ADDRESSES.mantleSepolia
    : CONTRACT_ADDRESSES.mantle;
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
    writeContract({
      address,
      abi: MAZINGIRA_RWA_ABI,
      functionName: "purchaseProduct",
      args: [BigInt(tokenId), BigInt(quantity)],
      value: pricePerUnit * BigInt(quantity),
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
