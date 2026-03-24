import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

const DEFAULT_INPUT = path.join(process.cwd(), "data", "normalized", "simulacra.json")
const DEFAULT_OUTPUT_DIR = path.join(process.cwd(), "data", "normalized", "characters")

function parseArgs(argv) {
  const args = {
    input: DEFAULT_INPUT,
    outDir: DEFAULT_OUTPUT_DIR,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === "--input") {
      args.input = path.resolve(argv[i + 1])
      i += 1
      continue
    }

    if (arg === "--out-dir") {
      args.outDir = path.resolve(argv[i + 1])
      i += 1
    }
  }

  return args
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const raw = await readFile(args.input, "utf8")
  const data = JSON.parse(raw)

  if (!Array.isArray(data)) {
    throw new Error("Expected the input JSON to contain an array.")
  }

  await mkdir(args.outDir, { recursive: true })

  for (const entry of data) {
    const fileName = `${slugify(entry.id || entry.simulacrumName || "character")}.json`
    const fullPath = path.join(args.outDir, fileName)
    await writeFile(fullPath, `${JSON.stringify(entry, null, 2)}\n`, "utf8")
  }

  console.log(`Wrote ${data.length} files to ${args.outDir}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
