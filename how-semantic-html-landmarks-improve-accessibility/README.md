# Semantic HTML Landmarks

This folder contains code examples demonstrating how to use **semantic HTML landmarks** to improve accessibility, navigation, and screen reader support.  

Landmarks help assistive technologies (like screen readers) provide quick navigation points on a page, making content easier to explore without scanning line by line.

## Testing Verification

This example has been tested with:
- VoiceOver
- Safari
- MacOs

## What Are Landmarks?

Landmarks are **structural elements in HTML** that define the major sections of a page. Common landmarks include:

- `<header>` – introductory or navigational content  
- `<nav>` – primary or secondary navigation  
- `<main>` – the primary content of the page  
- `<aside>` – complementary content (sidebar, related links, etc.)  
- `<footer>` – site-wide or section-specific footer  

Screen reader users can jump between these regions, which greatly improves the browsing experience.

## What’s in This Example

- `with-landmarks.html` – A simple page using semantic landmarks for header, nav, main, aside, and footer  
- `without-landmarks.html` – A non-semantic version for comparison

## How to Use

1. Open `with-landmarks.html` in your browser
2. Use a screen reader (e.g., NVDA, VoiceOver) to explore how landmarks allow for region-based navigation
3. Compare with `without-landmarks.html` to see the difference

No build tools required — everything is plain HTML.

## Accessibility Benefits

- Enables **region navigation** for screen reader users  
- Provides a **clear document outline** for assistive technologies  
- Reduces the need for `role` attributes since landmarks are built-in  
- Improves SEO by giving search engines clearer context of page sections  

---

## Related Resources

- (Blog) [From Fog to Skyline: How Semantic HTML Landmarks Improve Accessibility](https://wcagmadesimple.com/blog/how-semantic-html-landmarks-improve-accessibility)
- (PDF) [Semantic HTML Landmarks Cheat Sheet](https://www.wcagmadesimple.com/resources/how-semantic-html-landmarks-improve-accessibility/semantic-html-landmarks-cheatsheet.pdf)
- (Youtube) [Semantic HTML Landmarks Made Simple](https://www.youtube.com/watch?v=qPW8mcGy0Zg)
- (MDN Docs) [Using HTML sections and outlines](https://developer.mozilla.org/en-US/docs/Web/HTML/Element#content_sectioning)
- (WCAG 2.2 Reference) [WCAG 2.2 – Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
