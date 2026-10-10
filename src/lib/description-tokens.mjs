// Element names are whole words, never substrings of Device, voice, etc.
export function splitDescription(text) {
  return text.split(/(\[.*?\]|\b(?:Volt|Frost|Ice|Flame|Physical)\b|\d+(?:\.\d+)?%?)/gi);
}
