import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

const DEFAULT_INPUT = path.join(process.cwd(), "data", "fandom", "simulacra.json")
const DEFAULT_OUTPUT = path.join(process.cwd(), "data", "normalized", "simulacra.json")

function parseArgs(argv) {
  const args = {
    input: DEFAULT_INPUT,
    output: DEFAULT_OUTPUT,
    versionMapPath: null,
    keepSource: false,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === "--input") {
      args.input = path.resolve(argv[i + 1])
      i += 1
      continue
    }

    if (arg === "--output") {
      args.output = path.resolve(argv[i + 1])
      i += 1
      continue
    }

    if (arg === "--version-map") {
      args.versionMapPath = path.resolve(argv[i + 1])
      i += 1
      continue
    }

    if (arg === "--keep-source") {
      args.keepSource = true
    }
  }

  return args
}

async function readJson(filePath, fallback = null) {
  try {
    const raw = await readFile(filePath, "utf8")
    return JSON.parse(raw)
  } catch (error) {
    if (fallback !== null) return fallback
    throw error
  }
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

function repairEncoding(value) {
  return value
    .replace(/Ã—/g, "×")
    .replace(/â€™/g, "'")
    .replace(/â€“/g, "-")
    .replace(/â€”/g, "-")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â˜…/g, "★")
}

function normalizeWhitespace(value) {
  return repairEncoding(String(value || ""))
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
    .trim()
}

function normalizeName(value) {
  return normalizeWhitespace(value)
}

function normalizeDescription(value) {
  return normalizeWhitespace(value)
    .replace(/\bTO soothe\b/g, "To soothe")
    .replace(/\s+:\s+/g, ": ")
}

function normalizeResonance(value) {
  const normalized = normalizeWhitespace(value).toLowerCase()

  if (normalized === "dps" || normalized === "attack") return "Attack"
  if (normalized === "tank" || normalized === "fortitude" || normalized === "defense") return "Fortitude"
  if (normalized === "support" || normalized === "healer" || normalized === "benediction") return "Benediction"

  return normalizeWhitespace(value)
}

function normalizeElement(value) {
  const normalized = normalizeWhitespace(value)

  const map = {
    Frost: "Ice",
  }

  return map[normalized] || normalized
}

function normalizeTrait(trait) {
  return {
    title: normalizeName(trait?.title || ""),
    description: normalizeDescription(trait?.description || ""),
  }
}

function normalizeAbilityList(items) {
  if (!Array.isArray(items)) return []

  return items
    .map((item) => ({
      title: normalizeName(item?.title || ""),
      description: normalizeDescription(item?.description || ""),
    }))
    .filter((item) => item.title && item.description)
}

function normalizeAdvancements(items) {
  if (!Array.isArray(items)) return Array(6).fill("")

  const normalized = items.map((item) => normalizeDescription(item || ""))
  const padded = [...normalized]

  while (padded.length < 6) {
    padded.push("")
  }

  return padded.slice(0, 6)
}

function normalizeMatrices(matrices) {
  return {
    pc2: normalizeDescription(matrices?.pc2 || ""),
    pc4: normalizeDescription(matrices?.pc4 || ""),
  }
}

function normalizeNumber(value, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value
  const parsed = Number(String(value || "").replace(/,/g, ""))
  return Number.isFinite(parsed) ? parsed : fallback
}

function resolveReleaseDate(entry, versionMap) {
  const byId = versionMap[entry.id]
  const byName = versionMap[entry.simulacrumName]
  const byVersion = versionMap[entry.source?.releaseVersion]
  const byVersionLabel = versionMap[`Version ${entry.source?.releaseVersion}`]
  return byId || byName || byVersion || byVersionLabel || normalizeWhitespace(entry.releaseDate || "")
}

function normalizeEntry(entry, versionMap, keepSource) {
  const normalized = {
    id: slugify(entry.id || entry.simulacrumName || ""),
    simulacrumName: normalizeName(entry.simulacrumName || ""),
    weaponName: normalizeName(entry.weaponName || ""),
    rarity: normalizeWhitespace(entry.rarity || "SSR"),
    releaseDate: "",
    description: normalizeDescription(entry.description || ""),
    element: normalizeElement(entry.element || ""),
    resonance: normalizeResonance(entry.resonance || ""),
    shatter: normalizeNumber(entry.shatter, 0),
    charge: normalizeNumber(entry.charge, 0),
    trait: normalizeTrait(entry.trait),
    images: {
      character: "",
      weapon: "",
      matrix: "",
    },
    attacks: normalizeAbilityList(entry.attacks),
    dodges: normalizeAbilityList(entry.dodges),
    skills: normalizeAbilityList(entry.skills),
    discharges: normalizeAbilityList(entry.discharges),
    scaling: normalizeWhitespace(entry.scaling || "ATK_HP_CRIT"),
    passives: normalizeAbilityList(entry.passives),
    advancements: normalizeAdvancements(entry.advancements),
    matrices: normalizeMatrices(entry.matrices),
  }

  normalized.releaseDate = resolveReleaseDate(
    {
      ...entry,
      id: normalized.id,
      simulacrumName: normalized.simulacrumName,
    },
    versionMap
  )

  if (keepSource && entry.source) {
    normalized.source = entry.source
  }

  return normalized
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const input = await readJson(args.input)
  const versionMap = args.versionMapPath ? await readJson(args.versionMapPath, {}) : {}

  if (!Array.isArray(input)) {
    throw new Error("Expected the input file to contain an array.")
  }

  const normalized = input
    .map((entry) => normalizeEntry(entry, versionMap, args.keepSource))
    .sort((a, b) => a.simulacrumName.localeCompare(b.simulacrumName))

  await mkdir(path.dirname(args.output), { recursive: true })
  await writeFile(args.output, `${JSON.stringify(normalized, null, 2)}\n`, "utf8")

  console.log(`Normalized ${normalized.length} entries to ${args.output}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
