import { useEffect, useRef } from "react";

import { useLang } from "@/lib/i18n";
import { translateBatch } from "@/lib/translate.functions";

const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "CODE",
  "PRE",
  "TEXTAREA",
  "SVG",
  "PATH",
]);

const ATTRS = ["placeholder", "aria-label", "title"] as const;

const hasLetters = (s: string) => /[A-Za-z]{2}/.test(s);

function cacheKey(lang: string) {
  return `skillbridge-tr-${lang}`;
}

function loadCache(lang: string): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(cacheKey(lang)) || "{}");
  } catch {
    return {};
  }
}

function saveCache(lang: string, cache: Record<string, string>) {
  try {
    localStorage.setItem(cacheKey(lang), JSON.stringify(cache));
  } catch {
    /* quota — ignore */
  }
}

/**
 * Translates the entire rendered page (including live dashboard data) into the
 * selected language. Original English text is remembered per node so switching
 * back to English — or to another language — always translates from the source.
 */
export function AutoTranslate() {
  const { lang } = useLang();
  const textOriginals = useRef(new WeakMap<Text, string>());
  const attrOriginals = useRef(new WeakMap<Element, Record<string, string>>());
  const applying = useRef(false);
  const runId = useRef(0);

  useEffect(() => {
    if (typeof document === "undefined") return;

    let disposed = false;
    const cache = loadCache(lang);
    let timer: ReturnType<typeof setTimeout> | null = null;

    type Slot =
      | { kind: "text"; node: Text; original: string }
      | { kind: "attr"; el: Element; attr: string; original: string };

    function collect(): Slot[] {
      const slots: Slot[] = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, {
        acceptNode: (n) =>
          SKIP_TAGS.has((n as Element).tagName)
            ? NodeFilter.FILTER_REJECT
            : NodeFilter.FILTER_ACCEPT,
      });

      const visit = (el: Element) => {
        for (const attr of ATTRS) {
          const current = el.getAttribute(attr);
          if (current == null) continue;
          const stored = attrOriginals.current.get(el) ?? {};
          const original = stored[attr] ?? current;
          if (!hasLetters(original)) continue;
          stored[attr] = original;
          attrOriginals.current.set(el, stored);
          slots.push({ kind: "attr", el, attr, original });
        }
        for (const child of Array.from(el.childNodes)) {
          if (child.nodeType !== Node.TEXT_NODE) continue;
          const node = child as Text;
          const original = textOriginals.current.get(node) ?? node.nodeValue ?? "";
          if (!original.trim() || !hasLetters(original)) continue;
          textOriginals.current.set(node, original);
          slots.push({ kind: "text", node, original });
        }
      };

      visit(document.body);
      let current = walker.nextNode();
      while (current) {
        visit(current as Element);
        current = walker.nextNode();
      }
      return slots;
    }

    function apply(slots: Slot[], dict: Record<string, string>) {
      applying.current = true;
      for (const slot of slots) {
        const key = slot.original.trim();
        const translated = lang === "en" ? slot.original : dict[key];
        if (translated == null) continue;
        const value =
          lang === "en" ? slot.original : slot.original.replace(key, translated);
        if (slot.kind === "text") {
          if (slot.node.nodeValue !== value) slot.node.nodeValue = value;
        } else if (slot.el.getAttribute(slot.attr) !== value) {
          slot.el.setAttribute(slot.attr, value);
        }
      }
      requestAnimationFrame(() => {
        applying.current = false;
      });
    }

    async function run() {
      const id = ++runId.current;
      const slots = collect();
      if (!slots.length) return;

      if (lang === "en") {
        apply(slots, {});
        return;
      }

      // Apply everything we already know instantly.
      apply(slots, cache);

      const missing = Array.from(
        new Set(slots.map((s) => s.original.trim()).filter((s) => !(s in cache))),
      );
      if (!missing.length) return;

      for (let i = 0; i < missing.length; i += 60) {
        const chunk = missing.slice(i, i + 60);
        try {
          const res = await translateBatch({ data: { texts: chunk, target: lang } });
          chunk.forEach((source, idx) => {
            cache[source] = res.items[idx] ?? source;
          });
        } catch {
          chunk.forEach((source) => {
            cache[source] = source;
          });
        }
        if (disposed || id !== runId.current) return;
        saveCache(lang, cache);
        apply(collect(), cache);
      }
    }

    const schedule = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => void run(), 120);
    };

    schedule();

    const observer = new MutationObserver((records) => {
      if (applying.current) return;
      if (records.some((r) => r.type === "childList" || r.type === "characterData")) schedule();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...ATTRS],
    });

    document.documentElement.lang = lang;

    return () => {
      disposed = true;
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [lang]);

  return null;
}
