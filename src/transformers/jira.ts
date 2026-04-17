import { collapseBlankLines, trimText, markdownToJira } from "./shared";

/**
 * Transform Inkdrop Markdown to Jira wiki markup.
 */
export function toJira(markdown: string): string {
  let result = markdown;

  // Demote headings deeper than h3 to h3 before converting
  result = result.replace(/^#{4,}\s+/gm, "### ");

  // Convert Markdown → Jira wiki markup
  result = markdownToJira(result);

  // Collapse excessive blank lines (max 1 blank line between content)
  result = collapseBlankLines(result, 1);

  result = trimText(result);
  return result;
}
