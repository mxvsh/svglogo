import type { IconCategoryId } from "#/domain/icon/icon.types";

interface EmbeddingsMeta {
  icons: string[];
  categories: string[];
}

interface Embeddings {
  meta: EmbeddingsMeta;
  iconVecs: Float32Array;
  categoryVecs: Float32Array;
  dims: number;
}

let cached: Embeddings | null = null;

async function loadEmbeddings(): Promise<Embeddings> {
  if (cached) return cached;

  const [binRes, metaRes] = await Promise.all([
    fetch("/icon-embeddings.bin"),
    fetch("/icon-embeddings-meta.json"),
  ]);

  if (!binRes.ok || !metaRes.ok) throw new Error("Embeddings not found");

  const [buf, meta] = await Promise.all([
    binRes.arrayBuffer(),
    metaRes.json() as Promise<EmbeddingsMeta>,
  ]);

  const header = new Int32Array(buf, 0, 3);
  const [iconCount, categoryCount, dims] = header;

  const dataOffset = 12;
  const iconFloats = iconCount * dims;
  const catFloats = categoryCount * dims;

  const iconVecs = new Float32Array(buf, dataOffset, iconFloats);
  const categoryVecs = new Float32Array(buf, dataOffset + iconFloats * 4, catFloats);

  cached = { meta, iconVecs, categoryVecs, dims };
  return cached;
}

function cosine(a: Float32Array, aOffset: number, b: Float32Array, bOffset: number, dims: number): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < dims; i++) {
    const ai = a[aOffset + i];
    const bi = b[bOffset + i];
    dot += ai * bi;
    normA += ai * ai;
    normB += bi * bi;
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function findIconsByCategory(
  categoryId: IconCategoryId,
  prefix: string | null,
  topN = 300,
): Promise<string[]> {
  const emb = await loadEmbeddings();
  const catIdx = emb.meta.categories.indexOf(categoryId);
  if (catIdx === -1) return [];

  const { iconVecs, categoryVecs, dims, meta } = emb;
  const catOffset = catIdx * dims;

  const scores: Array<{ name: string; score: number }> = [];

  for (let i = 0; i < meta.icons.length; i++) {
    const name = meta.icons[i];
    if (prefix && !name.startsWith(`${prefix}:`)) continue;
    const score = cosine(iconVecs, i * dims, categoryVecs, catOffset, dims);
    scores.push({ name, score });
  }

  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, topN).map((s) => s.name);
}
