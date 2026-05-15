type Props = {
  size?: "sm" | "xs";
};

export function VendorBadge({ size = "sm" }: Props) {
  if (size === "xs") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-black text-white">
        ✓ Verified
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-black text-white">
      ✓ Verified Vendor
    </span>
  );
}
