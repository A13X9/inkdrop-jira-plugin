import { toJira } from "./jira";

describe("toJira", () => {
  it("should trim leading and trailing whitespace", () => {
    expect(toJira("  hello  ")).toBe("hello");
  });

  it("should collapse excessive blank lines to max 1", () => {
    const input = "line 1\n\n\n\n\nline 2";
    expect(toJira(input)).toBe("line 1\n\nline 2");
  });

  it("should demote h4+ headings to h3 in Jira format", () => {
    expect(toJira("#### Deep heading")).toBe("h3. Deep heading");
    expect(toJira("##### Deeper heading")).toBe("h3. Deeper heading");
  });

  it("should convert h1-h3 headings to Jira format", () => {
    expect(toJira("# H1")).toBe("h1. H1");
    expect(toJira("## H2")).toBe("h2. H2");
    expect(toJira("### H3")).toBe("h3. H3");
  });

  it("should convert code blocks to Jira format", () => {
    const input = "```js\nconst x = 1\n```";
    expect(toJira(input)).toBe("{code:js}\nconst x = 1\n{code}");
  });

  it("should convert lists to Jira format", () => {
    const input = "- item 1\n- item 2\n  - nested";
    expect(toJira(input)).toBe("* item 1\n* item 2\n** nested");
  });

  it("should convert bold to Jira format", () => {
    expect(toJira("This is **bold** text")).toBe("This is *bold* text");
  });

  it("should convert italic to Jira format", () => {
    expect(toJira("This is *italic* text")).toBe("This is _italic_ text");
  });

  it("should convert links to Jira format", () => {
    expect(toJira("[Google](https://google.com)")).toBe(
      "[Google|https://google.com]",
    );
  });

  it("should convert inline code to Jira format", () => {
    expect(toJira("Use `console.log`")).toBe("Use {{console.log}}");
  });
});
