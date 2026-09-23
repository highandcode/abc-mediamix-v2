export type ArticleBlock = { heading?: string; text?: string; quote?: string };

// How much copy one frame holds, in "weighted characters". Headings count
// extra (they're set larger), so a heading-and-paragraph block weighs about
// what a long paragraph does.
const FRAME_BUDGET = 440;
const MAX_BLOCKS_PER_FRAME = 3;
const HEADING_WEIGHT = 1.5;
const QUOTE_WEIGHT = 1.3;

function weigh(block: ArticleBlock) {
  return (
    (block.heading?.length ?? 0) * HEADING_WEIGHT +
    (block.text?.length ?? 0) +
    (block.quote?.length ?? 0) * QUOTE_WEIGHT
  );
}

/**
 * Splits an article's blocks into per-frame groups, in order, filling each
 * frame up to a copy budget. Every group is small enough to sit on one screen
 * (the dev-only frame guard flags any that isn't), so long articles gain
 * frames instead of scrolling.
 */
export function chunkArticle(blocks: ArticleBlock[]): ArticleBlock[][] {
  const chunks: ArticleBlock[][] = [];
  let current: ArticleBlock[] = [];
  let weight = 0;

  for (const block of blocks) {
    const w = weigh(block);
    if (current.length > 0 && (weight + w > FRAME_BUDGET || current.length >= MAX_BLOCKS_PER_FRAME)) {
      chunks.push(current);
      current = [];
      weight = 0;
    }
    current.push(block);
    weight += w;
  }
  if (current.length > 0) chunks.push(current);
  return chunks;
}
