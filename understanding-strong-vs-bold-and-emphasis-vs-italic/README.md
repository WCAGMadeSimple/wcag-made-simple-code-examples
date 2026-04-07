# Strong vs Bold and Emphasis vs Italic

This folder contains a code example demonstrating the **semantic and accessibility differences** between bold/italic styling approaches in HTML.

Not all bold text carries importance — and not all italic text carries emphasis. This example makes those differences visible (and audible).

## Testing Verification

This example has been tested with:
- VoiceOver
- Safari
- macOS

## What's the Difference?

### Bold

| Approach | Element / Method | Accessibility Tree |
|---|---|---|
| `<b>` | Bold tag | Text node only — no semantic role exposed |
| `font-weight: bold` | CSS | Text node only — no semantic role exposed |
| `<strong>` | Strong tag | Exposes an **importance** role to assistive technologies |

### Italic

| Approach | Element / Method | Accessibility Tree |
|---|---|---|
| `<i>` | Italic tag | Text node only — no semantic role exposed |
| `font-style: italic` | CSS | Text node only — no semantic role exposed |
| `<em>` | Emphasis tag | Exposes an **emphasis** role to assistive technologies |

> Screen readers may announce bold and italic text similarly across all three approaches — behaviour varies by screen reader and user settings. The real difference lives in the accessibility tree, where only `<strong>` and `<em>` carry semantic meaning.

## What's in This Example

- `strong-vs-bold-em-vs-italic.html` – A single page listing all three approaches for both bold and italic, designed to be explored with a screen reader and the Firefox Accessibility Tree

## How to Use

1. Open `strong-vs-bold-em-vs-italic.html` in your browser
2. Use a screen reader (e.g. VoiceOver, NVDA) to hear how each approach is announced
3. Open the Accessibility panel in Firefox DevTools to inspect how each element appears in the accessibility tree — this is where the difference becomes clear

No build tools required — everything is plain HTML.

## Accessibility Benefits

- Clarifies when to use `<strong>` vs `<b>` and `<em>` vs `<i>`
- Shows that visual appearance alone doesn't determine what assistive technologies expose
- Reinforces that **semantic HTML encodes intent**, not just style — future-proofing content for more expressive screen readers as AI-driven speech improves

---

## Related Resources

- (Blog) [Strong vs Bold, Emphasis vs Italic | Looks aren't everything](https://wcagmadesimple.com/blog/understanding-strong-vs-bold-and-emphasis-vs-italic)
- (YouTube) [Strong vs Bold, Emphasis vs Italic](https://www.youtube.com/watch?v=-hfIrX_4BKE)
- (MDN Docs) [&lt;strong&gt;: The Strong Importance element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/strong)
- (MDN Docs) [&lt;em&gt;: The Emphasis element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/em)
- (MDN Docs) [&lt;b&gt;: The Bring Attention To element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/b)
- (MDN Docs) [&lt;i&gt;: The Idiomatic Text element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/i)
- (MDN Docs) [Accessibility Tree](https://developer.mozilla.org/en-US/docs/Glossary/Accessibility_tree)
- (WCAG 2.2 Reference) [WCAG 2.2 – Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)