/**
 * Shared utilities for markdown transformation.
 */

/** Collapse consecutive blank lines. maxConsecutive=1 means at most 1 blank line between paragraphs. */
export function collapseBlankLines(
  text: string,
  maxConsecutive: number = 2,
): string {
  // maxConsecutive blank lines = maxConsecutive+1 newline characters
  const threshold = maxConsecutive + 2; // more than allowed
  const pattern = new RegExp(`(\\n\\s*){${threshold},}`, "g");
  return text.replace(pattern, "\n".repeat(maxConsecutive + 1));
}

/** Trim leading/trailing whitespace from the entire text. */
export function trimText(text: string): string {
  return text.trim();
}

/**
 * Convert Markdown to Jira wiki markup.
 * Jira uses its own notation: h1., *bold*, _italic_, {code}, [text|url], etc.
 */
export function markdownToJira(markdown: string): string {
  let result = markdown;

  // --- Protect code blocks from all subsequent transforms ---
  // Extract fenced code blocks into placeholders, convert to Jira {code} format,
  // and restore them at the very end so their content is never touched.
  const codeBlocks: string[] = [];
  const CODE_PLACEHOLDER = "\x03CODE_BLOCK_";
  result = result.replace(
    /^```(\w+)?\s*\n([\s\S]*?)^```\s*$/gm,
    (_match, lang: string | undefined, code: string) => {
      const langAttr = lang ? `:${lang}` : "";
      const jiraBlock = `{code${langAttr}}\n${code}{code}`;
      const index = codeBlocks.length;
      codeBlocks.push(jiraBlock);
      return `${CODE_PLACEHOLDER}${index}\x03`;
    },
  );

  // --- Block-level transforms (process line-by-line for some) ---

  // Convert headings: # H1 → h1. H1
  result = result.replace(/^#{1,6}\s+(.+)$/gm, (_match, text: string) => {
    const level = _match.match(/^#+/)![0].length;
    return `h${level}. ${text}`;
  });

  // Convert blockquotes: > text → {quote}\ntext\n{quote}
  // Handle multi-line blockquotes by grouping consecutive > lines
  result = result.replace(/(^>\s?.+$(\n^>\s?.+$)*)/gm, (_match: string) => {
    const inner = _match.replace(/^>\s?/gm, "");
    return `{quote}\n${inner}\n{quote}`;
  });

  // Convert horizontal rules
  result = result.replace(/^[-*_]{3,}\s*$/gm, "----");

  // Convert checklist items to bullet items
  // Use [ \t]* instead of \s* to avoid eating newlines
  result = result.replace(/^([ \t]*)- \[[ x]\]\s*/gm, "$1* ");

  // Convert unordered list items: - item or + item → * item
  // Handle nesting by counting indent (2 spaces = one extra *)
  result = result.replace(/^([ \t]*)[-+]\s+/gm, (_match, indent: string) => {
    const depth = Math.floor(indent.length / 2) + 1;
    return "*".repeat(depth) + " ";
  });

  // Convert ordered list items: 1. item → # item
  // Handle nesting by counting indent
  result = result.replace(/^([ \t]*)\d+\.\s+/gm, (_match, indent: string) => {
    const depth = Math.floor(indent.length / 2) + 1;
    return "#".repeat(depth) + " ";
  });

  // --- Inline transforms ---

  // Convert images ![alt](url) → !url! (must come before links)
  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "!$2!");

  // Convert links [text](url) → [text|url]
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "[$1|$2]");

  // Convert inline code `code` → {{code}}
  result = result.replace(/`([^`]+)`/g, "{{$1}}");

  // Bold/italic conversion uses placeholders to prevent
  // the italic pass from re-matching Jira bold markers.
  const BOLD_OPEN = "\x01";
  const BOLD_CLOSE = "\x02";

  // Convert bold+italic ***text*** → placeholder_italic_placeholder
  result = result.replace(
    /\*\*\*(.+?)\*\*\*/g,
    `${BOLD_OPEN}_$1_${BOLD_CLOSE}`,
  );

  // Convert bold **text** → placeholder
  result = result.replace(/\*\*(.+?)\*\*/g, `${BOLD_OPEN}$1${BOLD_CLOSE}`);

  // Convert italic *text* → _text_ (safe now — no Jira bold * markers present)
  result = result.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "_$1_");

  // Convert underscore bold+italic ___text___ → placeholder
  result = result.replace(/___(.+?)___/g, `${BOLD_OPEN}_$1_${BOLD_CLOSE}`);

  // Convert underscore bold __text__ → placeholder
  result = result.replace(/__(.+?)__/g, `${BOLD_OPEN}$1${BOLD_CLOSE}`);

  // Replace bold placeholders with Jira bold marker *
  result = result.replace(/\x01/g, "*");
  result = result.replace(/\x02/g, "*");

  // Convert tables: | h1 | h2 | → ||h1||h2||  and  | c1 | c2 | → |c1|c2|
  // Detect header separator line (|---|---|) to distinguish header from body rows
  const lines = result.split("\n");
  const tableResult: string[] = [];
  let i = 0;
  while (i < lines.length) {
    // Check if this line is a table row
    if (/^\|(.+)\|$/.test(lines[i].trim())) {
      // Check if next line is a separator (|---|---|)
      if (i + 1 < lines.length && /^\|[\s-:|]+\|$/.test(lines[i + 1].trim())) {
        // This is a header row — convert to ||col||col||
        const cells = lines[i]
          .trim()
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());
        tableResult.push("||" + cells.join("||") + "||");
        i += 2; // skip separator line
        continue;
      } else {
        // Regular table row — convert to |col|col|
        const cells = lines[i]
          .trim()
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());
        tableResult.push("|" + cells.join("|") + "|");
        i++;
        continue;
      }
    }
    tableResult.push(lines[i]);
    i++;
  }
  result = tableResult.join("\n");

  // --- Restore protected code blocks ---
  for (let idx = 0; idx < codeBlocks.length; idx++) {
    result = result.replace(`${CODE_PLACEHOLDER}${idx}\x03`, codeBlocks[idx]);
  }

  return result;
}
