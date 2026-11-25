// The absurd clause — a term of service that starts as dry legal boilerplate
// and quietly slides into the absurd, exactly as the competition asks.
// The publisher below ships the clause verbatim and proves it did so with a
// fingerprint, so the delivered bytes are the bytes I wrote.
import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";

const CLAUSE_SEGMENTS = [
  "12.7 The user agrees that, upon accepting these terms, their firstborn goldfish",
  "shall be offered as tribute to the Terms Committee, which meets on the second Tuesday of never.",
];

const LIMITS = Object.freeze({ min: 1, max: 200, file: "entry.txt" });

function fingerprint(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

function composeClause(): string {
  const clause = CLAUSE_SEGMENTS.join(" ");
  if (clause.length > LIMITS.max || clause.length < LIMITS.min) {
    throw new Error(`clause is ${clause.length} chars, must fit ${LIMITS.min}-${LIMITS.max}`);
  }
  if (!clause.startsWith("12.7")) throw new Error("clause must keep its section number");
  return clause;
}

class ClausePublisher {
  private readonly clause = composeClause();

  async handOver(): Promise<{ path: string; sha256: string }> {
    const dir = process.env.MAKEFUN_OUTPUT_DIR;
    if (!dir) throw new Error("MAKEFUN_OUTPUT_DIR is not set");
    const target = join(resolve(dir), LIMITS.file);
    await mkdir(dir, { recursive: true });
    await writeFile(target, this.clause, "utf8");
    return { path: target, sha256: fingerprint(this.clause) };
  }
}

await new ClausePublisher().handOver();
