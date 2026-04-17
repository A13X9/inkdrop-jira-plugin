import { markdownToJira } from "./shared";

describe("markdownToJira", () => {
  describe("headings", () => {
    it("should convert h1-h6 to Jira notation", () => {
      expect(markdownToJira("# Title")).toBe("h1. Title");
      expect(markdownToJira("## Section")).toBe("h2. Section");
      expect(markdownToJira("### Sub")).toBe("h3. Sub");
      expect(markdownToJira("###### Deep")).toBe("h6. Deep");
    });
  });

  describe("emphasis", () => {
    it("should convert bold **text** to *text*", () => {
      expect(markdownToJira("**bold**")).toBe("*bold*");
    });

    it("should convert italic *text* to _text_", () => {
      expect(markdownToJira("*italic*")).toBe("_italic_");
    });

    it("should convert bold+italic ***text*** to *_text_*", () => {
      expect(markdownToJira("***both***")).toBe("*_both_*");
    });

    it("should convert underscore bold __text__ to *text*", () => {
      expect(markdownToJira("__bold__")).toBe("*bold*");
    });
  });

  describe("code", () => {
    it("should convert inline code to {{code}}", () => {
      expect(markdownToJira("Use `npm install`")).toBe("Use {{npm install}}");
    });

    it("should convert fenced code blocks with language", () => {
      const input = "```js\nconst x = 1;\n```";
      expect(markdownToJira(input)).toBe("{code:js}\nconst x = 1;\n{code}");
    });

    it("should convert fenced code blocks without language", () => {
      const input = "```\nsome code\n```";
      expect(markdownToJira(input)).toBe("{code}\nsome code\n{code}");
    });
  });

  describe("links and images", () => {
    it("should convert links to [text|url]", () => {
      expect(markdownToJira("[Google](https://google.com)")).toBe(
        "[Google|https://google.com]",
      );
    });

    it("should convert images to !url!", () => {
      expect(markdownToJira("![alt](http://example.com/img.png)")).toBe(
        "!http://example.com/img.png!",
      );
    });
  });

  describe("lists", () => {
    it("should convert unordered lists", () => {
      expect(markdownToJira("- item 1\n- item 2")).toBe("* item 1\n* item 2");
    });

    it("should convert nested unordered lists", () => {
      expect(markdownToJira("- item\n  - nested")).toBe("* item\n** nested");
    });

    it("should convert ordered lists", () => {
      expect(markdownToJira("1. First\n2. Second")).toBe("# First\n# Second");
    });

    it("should convert checklists to bullet items", () => {
      expect(markdownToJira("- [x] Done\n- [ ] Todo")).toBe("* Done\n* Todo");
    });
  });

  describe("blockquotes", () => {
    it("should convert blockquotes to {quote}", () => {
      expect(markdownToJira("> quoted")).toBe("{quote}\nquoted\n{quote}");
    });

    it("should convert multi-line blockquotes", () => {
      const input = "> line 1\n> line 2";
      expect(markdownToJira(input)).toBe("{quote}\nline 1\nline 2\n{quote}");
    });
  });

  describe("tables", () => {
    it("should convert markdown tables to Jira tables", () => {
      const input = "| Name | Age |\n| --- | --- |\n| Alice | 30 |";
      expect(markdownToJira(input)).toBe("||Name||Age||\n|Alice|30|");
    });
  });

  describe("horizontal rules", () => {
    it("should convert --- to ----", () => {
      expect(markdownToJira("---")).toBe("----");
    });
  });

  describe("mixed content", () => {
    it("should handle a note with multiple elements", () => {
      const input = [
        "## My Note",
        "",
        "Some **bold** and *italic* text.",
        "",
        "- item 1",
        "- item 2",
        "",
        "```js",
        "const x = 1;",
        "```",
      ].join("\n");

      const expected = [
        "h2. My Note",
        "",
        "Some *bold* and _italic_ text.",
        "",
        "* item 1",
        "* item 2",
        "",
        "{code:js}",
        "const x = 1;",
        "{code}",
      ].join("\n");

      expect(markdownToJira(input)).toBe(expected);
    });
  });
});
