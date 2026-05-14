export type ProductMeta = {
  name: string;
  image: string | null;
};

export function parseMetadata(metadataURI: string): ProductMeta {
  if (!metadataURI) return { name: "", image: null };
  try {
    const parsed = JSON.parse(metadataURI);
    if (typeof parsed === "object" && typeof parsed.name === "string") {
      return { name: parsed.name, image: typeof parsed.image === "string" ? parsed.image : null };
    }
  } catch {
    // plain string — legacy format
  }
  return { name: metadataURI, image: null };
}

export function buildMetadata(name: string, image?: string): string {
  if (!image?.trim()) return name;
  return JSON.stringify({ name, image: image.trim() });
}
