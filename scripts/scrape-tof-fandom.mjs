import { mkdir, writeFile, readFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { load } from "cheerio"

const API_URL = "https://toweroffantasy.fandom.com/api.php"
const DEFAULT_OUT_DIR = path.join(process.cwd(), "data", "fandom", "simulacra")
const DEFAULT_COMBINED_FILE = path.join(process.cwd(), "data", "fandom", "simulacra.json")

function parseArgs(argv) {
  const args = {
    all: false,
    pages: [],
    outDir: DEFAULT_OUT_DIR,
    combinedFile: DEFAULT_COMBINED_FILE,
    delayMs: 200,
    limit: null,
    versionMapPath: null,
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
      continue
    }

    if (arg === "--version-map") {
      args.versionMapPath = path.resolve(argv[i + 1])
      i += 1
      continue
    }
  }

  if (!args.all && args.pages.length === 0) {
    args.pages.push("Lana")
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
      "user-agent": "tower-hub-scraper/1.0",
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
  const repaired = value
    .replace(/Ã—/g, "×")
    .replace(/â€™/g, "’")
    .replace(/â€“/g, "–")
    .replace(/â€”/g, "—")
    .replace(/â€œ/g, "“")
    .replace(/â€/g, "”")
    .replace(/â˜…/g, "★")

  return repaired
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
    .trim()
}

function cleanAbilityTitle(value) {
  return normalizeWhitespace(
    value
      .replace(/File:[^\n]+?\.(png|jpg|jpeg|gif|webp)\s*/gi, "")
      .replace(/\[🎥\]/g, "")
      .replace(/\[[^\]]*\]/g, "")
      .replace(/Lv\.\s*\d+/gi, "")
      .replace(/★+/g, "")
      .replace(/^-\s*/, "")
  )
}

function htmlToText(html) {
  if (!html) return ""

  const $ = load(`<div id="root">${html}</div>`)
  const root = $("#root")

  root.find("img, figure, a.image, .thumb, .thumbinner").remove()
  root.find("br").replaceWith("\n")
  root.find("li").each((_, el) => {
    $(el).prepend("\n")
  })
  root.find("p, div, tr, table").each((_, el) => {
    $(el).append("\n")
  })

  return normalizeWhitespace(root.text().replace(/No preview/gi, ""))
}

function getTableRows($, $table) {
  return $table.find("tr").map((_, tr) => {
    return $(tr).children("th,td").map((__, cell) => {
      const $cell = $(cell)
      const html = $cell.html() || ""
      return normalizeWhitespace(htmlToText(html))
    }).get().filter(Boolean)
  }).get()
}

function getImageUrl($container) {
  const img = $container.find("img").first()
  if (!img.length) return ""

  const candidates = [
    img.attr("data-src"),
    img.attr("src"),
  ].filter(Boolean)

  const imageUrl = candidates.find((value) => !value.startsWith("data:image"))
  return imageUrl || ""
}

function getInfoboxDataMap($) {
  const map = new Map()

  $("aside .pi-item.pi-data").each((_, el) => {
    const label = normalizeWhitespace($(el).find(".pi-data-label").text())
    const valueHtml = $(el).find(".pi-data-value").html() || ""
    const valueText = normalizeWhitespace(htmlToText(valueHtml))

    if (label) {
      map.set(label, {
        text: valueText,
        html: valueHtml,
        element: el,
      })
    }
  })

  return map
}

function extractSmartGroupValue($aside, label) {
  const head = $aside.find(".pi-smart-data-label").filter((_, el) => {
    return normalizeWhitespace($aside.find(el).text()) === label
  }).first()

  if (!head.length) return ""

  const dataSource = head.attr("data-source")
  if (!dataSource) return ""

  const value = $aside.find(`.pi-smart-data-value[data-source="${dataSource}"]`).first()
  return normalizeWhitespace(value.text())
}

function extractReleaseVersion($) {
  const text = normalizeWhitespace($(".change-history").first().text())
  const match = text.match(/Released in Version\s+([0-9.]+)/i)
  return match ? match[1] : ""
}

function inferScaling(baseStatLabels) {
  const labels = baseStatLabels.map((value) => value.toLowerCase())
  return labels.includes("crit") ? "ATK_HP_CRIT" : "ATK_HP_RES"
}

function extractBaseStatLabels($aside) {
  return $aside.find(".pi-smart-group").eq(1).find(".pi-smart-data-label").map((_, el) => {
    return normalizeWhitespace($aside.find(el).text())
  }).get()
}

function parseNumericValue(value) {
  if (!value) return 0
  const match = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/)
  return match ? Number(match[0]) : 0
}

function parseTrait($) {
  const table = $("h2").filter((_, el) => normalizeWhitespace($(el).text()) === "Recollection Rewards[]")
    .first()
    .nextAll("table")
    .first()

  if (!table.length) {
    return { title: "", description: "" }
  }

  let selectedTrait = { title: "", description: "" }

  table.find("tr").each((_, tr) => {
    const cells = $(tr).children().map((__, cell) => normalizeWhitespace($(cell).text())).get()
    if (cells.length < 2) return

    const points = parseInt(cells[0].replace(/,/g, ""), 10)
    const reward = cells[1]

    if (Number.isNaN(points) || points !== 4000) {
      return
    }

    const cleanedReward = reward.replace(/File:[^\n]+?\.(png|jpg|jpeg|gif|webp)\s*/gi, "")
    const match = cleanedReward.match(/Trait \((?:.*?:\s*)?([^)]+)\)([\s\S]+)/)
    if (!match) return

    selectedTrait = {
      title: normalizeWhitespace(match[1]),
      description: normalizeWhitespace(match[2]),
    }
  })

  return selectedTrait
}

function parseAbilityTables($, $tabContent) {
  return $tabContent.find("table.fandom-table").map((_, table) => {
    const $table = $(table)
    const title = cleanAbilityTitle(
      normalizeWhitespace($table.find("tr").first().children("th,td").first().text())
    )
    const description = normalizeWhitespace(
      $table.find("tr").slice(1).map((__, tr) => {
        return $(tr).children("th,td").map((___, cell) => {
          const value = normalizeWhitespace(htmlToText($(cell).html() || ""))
          return value && value.toLowerCase() !== "controls" ? value : null
        }).get().filter(Boolean).join("\n")
      }).get().filter(Boolean).join("\n")
    )

    return title && description ? { title, description } : null
  }).get().filter(Boolean)
}

function parseAdvancements($, $tabContent) {
  return $tabContent.find("table.fandom-table").map((_, table) => {
    const $table = $(table)
    const rows = getTableRows($, $table)

    const description = normalizeWhitespace(
      rows
        .flat()
        .filter((value) => value !== "Activated:")
        .join("\n")
        .replace(/^Lv\.\s*\d+\s*[★\s]*/i, "")
        .replace(/^Activated:\s*/i, "")
    )

    return description || null
  }).get().filter(Boolean)
}

function parseSetEffects($) {
  const table = $("h2").filter((_, el) => normalizeWhitespace($(el).text()) === "Set Effects[]")
    .first()
    .nextAll("table")
    .first()

  const matrices = { pc2: "", pc4: "" }

  table.find("tr").each((_, tr) => {
    const cells = $(tr).children().map((__, cell) => normalizeWhitespace($(cell).text())).get()
    if (cells.length < 2) return

    if (cells[0] === "2-piece") matrices.pc2 = cells[1]
    if (cells[0] === "4-piece") matrices.pc4 = cells[1]
  })

  return matrices
}

function pickLinkedPageTitle(href) {
  if (!href || !href.startsWith("/wiki/")) return ""
  return decodeURIComponent(href.replace("/wiki/", "")).replace(/_/g, " ")
}

async function parseSimulacrumPage(title) {
  const data = await apiGet({
    action: "parse",
    page: title,
    prop: "text",
  })

  const $ = load(data.parse.text)
  const $aside = $("aside.portable-infobox").first()
  const infobox = getInfoboxDataMap($)

  const simulacrumName = normalizeWhitespace($("h2").first().text()) || title
  const weaponName = infobox.get("Weapon")?.text || ""
  const rarityHtml = infobox.get("Grade")?.html || ""
  const rarity = normalizeWhitespace(htmlToText(rarityHtml)) || normalizeWhitespace(load(rarityHtml)("img").attr("alt") || "")
  const matrixHref = infobox.get("Matrix Set")?.html ? load(infobox.get("Matrix Set").html)("a").attr("href") : ""
  const matrixPageTitle = pickLinkedPageTitle(matrixHref)
  const weaponHref = infobox.get("Weapon")?.html ? load(infobox.get("Weapon").html)("a").attr("href") : ""
  const weaponPageTitle = pickLinkedPageTitle(weaponHref)

  return {
    pageTitle: data.parse.title,
    simulacrumName,
    weaponName,
    rarity,
    description: normalizeWhitespace($(".description").first().text()),
    trait: parseTrait($),
    images: {
      character: getImageUrl($aside),
    },
    relatedPages: {
      weaponPageTitle,
      matrixPageTitle,
    },
    releaseVersion: extractReleaseVersion($),
  }
}

async function parseWeaponPage(title) {
  const data = await apiGet({
    action: "parse",
    page: title,
    prop: "text",
  })

  const $ = load(data.parse.text)
  const $aside = $("aside.portable-infobox").first()
  const infobox = getInfoboxDataMap($)
  const tabContents = $(".tabber .wds-tab__content")

  const classHtml = infobox.get("Class")?.html || ""
  const classAlt = normalizeWhitespace(load(classHtml)("img").attr("alt") || "")
  const elementHtml = infobox.get("Element")?.html || ""
  const elementAlt = normalizeWhitespace(load(elementHtml)("img").attr("alt") || "")
  const statLabels = extractBaseStatLabels($aside)

  const resonanceMap = {
    DPS: "Attack",
    Defense: "Fortitude",
    Tank: "Fortitude",
    Support: "Benediction",
    Benediction: "Benediction",
    Attack: "Attack",
  }

  return {
    rarity: normalizeWhitespace(load(infobox.get("Grade")?.html || "")("img").attr("alt") || ""),
    element: elementAlt,
    resonance: resonanceMap[classAlt] || classAlt || "",
    shatter: parseNumericValue(extractSmartGroupValue($aside, "Shatter")),
    charge: parseNumericValue(extractSmartGroupValue($aside, "Charge")),
    scaling: inferScaling(statLabels),
    images: {
      weapon: getImageUrl($aside),
    },
    attacks: parseAbilityTables($, tabContents.eq(0)),
    dodges: parseAbilityTables($, tabContents.eq(1)),
    skills: parseAbilityTables($, tabContents.eq(2)),
    discharges: parseAbilityTables($, tabContents.eq(3)),
    advancements: parseAdvancements($, tabContents.eq(4)),
    passives: parseAbilityTables($, tabContents.eq(5)),
    releaseVersion: extractReleaseVersion($),
  }
}

async function parseMatrixPage(title) {
  const data = await apiGet({
    action: "parse",
    page: title,
    prop: "text",
  })

  const $ = load(data.parse.text)
  const $aside = $("aside.portable-infobox").first()

  return {
    images: {
      matrix: getImageUrl($aside),
    },
    matrices: parseSetEffects($),
  }
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

async function readVersionMap(filePath) {
  if (!filePath) return {}

  const raw = await readFile(filePath, "utf8")
  return JSON.parse(raw)
}

function resolveReleaseDate(simulacrumName, releaseVersion, versionMap) {
  return (
    versionMap[slugify(simulacrumName)] ||
    versionMap[releaseVersion] ||
    versionMap[`Version ${releaseVersion}`] ||
    ""
  )
}

async function scrapeSimulacrum(title, versionMap) {
  const simulacrum = await parseSimulacrumPage(title)
  const weapon = simulacrum.relatedPages.weaponPageTitle
    ? await parseWeaponPage(simulacrum.relatedPages.weaponPageTitle)
    : null
  const matrix = simulacrum.relatedPages.matrixPageTitle
    ? await parseMatrixPage(simulacrum.relatedPages.matrixPageTitle)
    : null

  const releaseVersion = weapon?.releaseVersion || simulacrum.releaseVersion || ""

  return {
    id: slugify(simulacrum.simulacrumName),
    simulacrumName: simulacrum.simulacrumName,
    weaponName: simulacrum.weaponName || weapon?.weaponName || "",
    rarity: simulacrum.rarity || weapon?.rarity || "",
    releaseDate: resolveReleaseDate(simulacrum.simulacrumName, releaseVersion, versionMap),
    description: simulacrum.description,
    element: weapon?.element || "",
    resonance: weapon?.resonance || "",
    shatter: weapon?.shatter || 0,
    charge: weapon?.charge || 0,
    trait: simulacrum.trait,
    images: {
      character: simulacrum.images.character || "",
      weapon: weapon?.images.weapon || "",
      matrix: matrix?.images.matrix || "",
    },
    attacks: weapon?.attacks || [],
    dodges: weapon?.dodges || [],
    skills: weapon?.skills || [],
    discharges: weapon?.discharges || [],
    scaling: weapon?.scaling || "ATK_HP_CRIT",
    passives: weapon?.passives || [],
    advancements: weapon?.advancements || [],
    matrices: matrix?.matrices || { pc2: "", pc4: "" },
    source: {
      simulacrumPage: simulacrum.pageTitle,
      weaponPage: simulacrum.relatedPages.weaponPageTitle || "",
      matrixPage: simulacrum.relatedPages.matrixPageTitle || "",
      releaseVersion,
      scrapedAt: new Date().toISOString(),
    },
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const versionMap = await readVersionMap(args.versionMapPath)
  const titles = args.all
    ? await getCategoryMembers("Category:Simulacra", args.limit)
    : args.pages

  await mkdir(args.outDir, { recursive: true })
  await mkdir(path.dirname(args.combinedFile), { recursive: true })

  const results = []
  const failures = []

  for (const [index, title] of titles.entries()) {
    try {
      console.log(`[${index + 1}/${titles.length}] Scraping ${title}`)
      const entry = await scrapeSimulacrum(title, versionMap)
      const fileName = `${entry.id}.json`
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

  const sorted = results.sort((a, b) => a.simulacrumName.localeCompare(b.simulacrumName))
  await writeFile(args.combinedFile, `${JSON.stringify(sorted, null, 2)}\n`, "utf8")

  console.log(`\nSaved ${sorted.length} entries to ${args.combinedFile}`)
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
