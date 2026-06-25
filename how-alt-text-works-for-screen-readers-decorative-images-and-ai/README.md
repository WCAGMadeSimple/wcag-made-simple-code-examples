# Alt Text | Screen Readers, Decorative Images, and AI

This folder contains a code example demonstrating **how different alt text implementations are announced by screen readers** and why not all implementations behave the same way.

A missing alt attribute doesn't mean silence. Screen readers will try to fill the gap, and they often do it poorly.

## Testing Verification

This example has been tested with:

- VoiceOver
- Safari
- macOS

## What's the Difference?

| Implementation | Attributes Used | Screen Reader Behaviour |
| --- | --- | --- |
| Missing alt attribute | *(none)* | May announce file name, dimensions, or other fallback data |
| Empty alt text | `alt=""` | May still announce "graphic" or "image" depending on the screen reader |
| Empty alt + aria-hidden | `alt="" aria-hidden="true"` | Suppresses announcement in most screen readers |
| Empty alt + role none | `alt="" role="none"` | Required by VoiceOver to suppress the announcement. `aria-hidden` alone was not sufficient. |
| All three combined | `alt="" aria-hidden="true" role="none"` | Highest compatibility across screen readers |

> `aria-hidden="true"` alone is not sufficient to suppress image announcements in VoiceOver. Testing confirmed that `role="none"` is required to achieve the same suppression. Combining all three attributes is the safest approach for consistent cross-screen reader behaviour.

## What's in This Example

- `index.html` – A single page listing all five alt text implementations, designed to be explored with a screen reader and the Firefox Accessibility Tree

## How to Use

1. Open `index.html` in your browser
2. Use a screen reader (e.g. VoiceOver, NVDA) to hear how each implementation is announced
3. Open the Accessibility panel in Firefox DevTools to inspect how each element appears in the accessibility tree. Empty alt text is shown as empty text nodes, which helps explain why some implementations still get read out

No build tools required. Everything is plain HTML.

## Accessibility Benefits

- Demonstrates that omitting the alt attribute is worse than an empty one
- Clarifies when and why to combine `alt=""`, `aria-hidden="true"`, and `role="none"`
- Shows that screen reader behaviour varies across implementations. Testing is the only way to confirm compatibility.

---

## Related Resources

- (Blog) [Alt Text | Screen Readers, Decorative Images, and AI](https://wcagmadesimple.com/blog/how-alt-text-works-for-screen-readers-decorative-images-and-ai)
- (YouTube) [Screen Readers and Decorative Images](https://www.youtube.com/watch?v=PGDpMr_AN7c)
- (MDN Docs) [`<img>`: The Image element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img)
- (MDN Docs) [aria-hidden](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden)
- (MDN Docs) [ARIA roles: presentation / none](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/presentation_role)
- (WCAG 2.2 Reference) [Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)