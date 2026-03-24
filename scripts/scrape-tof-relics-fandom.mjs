import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { load } from "cheerio"

const API_URL = "https://toweroffantasy.fandom.com/api.php"
const DEFAULT_OUT_DIR = path.join(process.cwd(), "data", "normalized", "relics")
const DEFAULT_COMBINED_FILE = path.join(process.cwd(), "data", "normalized", "relics.json")

function parseArgs(argv) {
  const args = {
    all: false,
    pages: [],
    outDir: DEFAULT_OUT_DIR,
    combinedFile: DEFAULT_COMBINED_FILE,
    delayMs: 150,
    limit: null,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === "--all") {
      args.all = true
      continue
    }

    if (arg === "--page") {
      args.pages.push(argv[i + 1])
      i += 1
      continue
    }

    if (arg === "--out-dir") {
      args.outDir = path.resolve(argv[i + 1])
      i += 1
      continue
    }

    if (arg === "--combined-file") {
      args.combinedFile = path.resolve(argv[i + 1])
      i += 1
      continue
    }

    if (arg === "--delay-ms") {
      args.delayMs = Number(argv[i + 1] || 0)
      i += 1
      continue
    }

    if (arg === "--limit") {
      args.limit = Number(argv[i + 1] || 0)
      i += 1
    }
  }

  if (!args.all && args.pages.length === 0) {
    args.all = true
  }

  return args
}

async function apiGet(params) {
  const url = new URL(API_URL)
  Object.entries({
    format: "json",
    formatversion: "2",
    ...params,
  }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value))
    }
  })

  const response = await fetch(url, {
    headers: {
      "user-agent": "tower-hub-relic-scraper/1.0",
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`)
  }

  const data = await response.json()

  if (data.error) {
    throw new Error(data.error.info || `API error for ${url}`)
  }

  return data
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
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

function normalizeWhitespace(value) {
  return String(value || "")
    .replace(/Ã—/g, "×")
    .replace(/â€™/g, "'")
    .replace(/â€“/g, "-")
    .replace(/â€”/g, "-")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
    .trim()
}

async function getCategoryMembers(categoryTitle, limit) {
  const titles = []
  let cmcontinue = null

  while (true) {
    const data = await apiGet({
      action: "query",
      list: "categorymembers",
      cmtitle: categoryTitle,
      cmlimit: "max",
      cmcontinue,
    })

    const members = data.query?.categorymembers || []
    titles.push(...members.filter((item) => item.ns === 0).map((item) => item.title))

    if (limit && titles.length >= limit) {
      return titles.slice(0, limit)
    }

    if (!data.continue?.cmcontinue) {
      return titles
    }

    cmcontinue = data.continue.cmcontinue
  }
}

function parseAdvancements($) {
  const table = $("h2")
    .filter((_, el) => normalizeWhitespace($(el).text()) === "Advancements[]")
    .first()
    .nextAll("table")
    .first()

  const advancements = Array(5).fill("")

  if (!table.length) return advancements

  table.find("tr").each((_, tr) => {
    const cells = $(tr)
      .children()
      .map((__, cell) => normalizeWhitespace($(cell).text()))
      .get()

    if (cells.length < 2) return

    const index = parseInt(cells[0], 10)
    if (Number.isNaN(index) || index < 1 || index > 5) return

    advancements[index - 1] = cells[1]
  })

  return advancements
}

function parseSkillDescription($) {
  const skillHeading = $("h2")
    .filter((_, el) => normalizeWhitespace($(el).text()) === "Skill[]")
    .first()

  if (!skillHeading.length) return ""

  let description = ""

  skillHeading.nextAll().each((_, el) => {
    if (el.tagName === "h2") {
      return false
    }

    if (el.tagName !== "p") {
      return undefined
    }

    const text = normalizeWhitespace($(el).text())

    if (!text || /^Type:/i.test(text)) {
      return undefined
    }

    description = text
    return false
  })

  return description
}

async function scrapeRelic(title) {
  const data = await apiGet({
    action: "parse",
    page: title,
    prop: "text",
  })

  const $ = load(data.parse.text)
  const gradeHtml =
    $("aside .pi-item.pi-data")
      .filter((_, el) => normalizeWhitespace($(el).find(".pi-data-label").text()) === "Grade")
      .find(".pi-data-value")
      .html() || ""

  const rarity = normalizeWhitespace(load(gradeHtml)("img").attr("alt") || "SSR")

  return {
    name: normalizeWhitespace($("h2").first().text() || title),
    description: parseSkillDescription($),
    rarity,
    image: "",
    advancements: parseAdvancements($),
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const titles = args.all
    ? await getCategoryMembers("Category:Relics", args.limit)
    : args.pages

  await mkdir(args.outDir, { recursive: true })
  await mkdir(path.dirname(args.combinedFile), { recursive: true })

  const results = []
  const failures = []

  for (const [index, title] of titles.entries()) {
    try {
      console.log(`[${index + 1}/${titles.length}] Scraping ${title}`)
      const entry = await scrapeRelic(title)
      const fileName = `${slugify(entry.name)}.json`
      await writeFile(path.join(args.outDir, fileName), `${JSON.stringify(entry, null, 2)}\n`, "utf8")
      results.push(entry)
    } catch (error) {
      failures.push({ title, error: error.message })
      console.error(`Failed to scrape ${title}: ${error.message}`)
    }

    if (args.delayMs > 0 && index < titles.length - 1) {
      await sleep(args.delayMs)
    }
  }

  const sorted = results.sort((a, b) => a.name.localeCompare(b.name))
  await writeFile(args.combinedFile, `${JSON.stringify(sorted, null, 2)}\n`, "utf8")

  console.log(`\nSaved ${sorted.length} relics to ${args.combinedFile}`)

  if (failures.length > 0) {
    console.log(`Failures: ${failures.length}`)
    failures.forEach((failure) => console.log(`- ${failure.title}: ${failure.error}`))
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
