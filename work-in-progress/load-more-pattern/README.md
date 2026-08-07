# Accessible Load More Pattern

> ⚠️ **Work in progress.** This example lives under `work-in-progress/` while the
> accompanying article is drafted. The accessibility behaviour below has been
> screen reader tested, but treat the code as not yet final.

This folder contains code for a load more pattern demonstrating **how to announce results as they
load**, land keyboard focus where a user expects it, and keep the "Load more" button
reachable while it is busy.

## Testing Verification

This example has been tested with:
- VoiceOver
- Safari
- macOS

Behaviour in NVDA and JAWS has **not** been verified. Where a decision was made
because of a VoiceOver-specific quirk, it is called out below.

## What's in This Example

- `accessible-load-more-demo.html` – The full pattern, built as plain web components
- `inaccessible-load-more.html` – The same component with every accessibility affordance removed, for comparison
- `css/main.css` – Shared styles, including the contrast-checked focus and disabled states
- `data/parks-data.js` – 32 Canadian national parks, used as the fake paginated response

Both demos use the same component names and property names, so they diff cleanly
against each other.

## How to Use

1. Open `accessible-load-more-demo.html` in your browser
2. Turn on a screen reader and press **Load more**. Listen for the result count announcement
3. Press **Tab** immediately after. Focus should land at the start of the new batch, not back at the top
4. Press **Simulate fetch failure** to hear the error announcement and see the sighted-user error message
5. Keep loading until all 32 results are shown. The button removes itself and the announcement changes to "all 32 results shown"
6. Compare against `inaccessible-load-more.html`, where none of the above happens

No build tools required. Everything is plain HTML, CSS, and JavaScript.

## What the Pattern Does

| Concern | Mechanism | Who it serves |
| --- | --- | --- |
| Announce new results | `role="status"` + `aria-live="polite"` | Screen reader users |
| Avoid announcement collisions | Nested `requestAnimationFrame()` | Screen reader users |
| Avoid needless "Loading" chatter | 500ms timer, cancelled on arrival | Screen reader users |
| Land focus predictably | Batch marker with `tabindex="-1"` | Keyboard users, screen reader users |
| Stay reachable while busy | `aria-disabled` + a loading guard | Keyboard users |
| Position within the set | `aria-label` on each result link | Screen reader users |
| Report failures | Live region + a separate visible message | Everyone, through their own channel |

---

## Position in the Set: `aria-label`, not `aria-setsize` / `aria-posinset`

`aria-setsize` and `aria-posinset` read like they were made for this: one maps to the
total number of results, the other to an individual result's place in it.

**Support for them varies widely across major screen readers.** At the time of writing
(September 2026), the [W3C ARIA-AT](https://aria-at.w3.org/) project's feature support
data puts them at:

| Screen reader | Support |
| --- | --- |
| JAWS / Chrome | Well supported |
| VoiceOver / macOS / Safari | Moderate |
| NVDA / Chrome | Weakest |

`aria-label`, by contrast, has some of the broadest support of any ARIA attribute. So
this example keeps the *spirit* of `aria-setsize` / `aria-posinset` and puts the same
information into a label on each result's heading link, which is a tabbable element:

```html
<h3>
  <a href="#" aria-label="Banff National Park, 1 of 32">
    Banff National Park
  </a>
</h3>
```

> If you add filtering or sorting to a list like this, both numbers have to be
> recalculated. This example does not include either.

---

## Keyboard Focus and the Batch Marker

Without intervention, pressing "Load more" leaves focus on the button while ten new
results appear *above* it. Reaching the first new result means tabbing backwards
repeatedly.

This example inserts a **batch marker**: a visually hidden `<li>` with `tabindex="-1"`,
placed immediately before each new batch, which receives focus programmatically. The
user's next Tab press then moves forward into the new results, on their own terms.

```html
<li class="visually-hidden batch-marker" tabindex="-1">
  <span aria-hidden="true">5 results loaded, 10 of 32 shown.</span>
</li>
```

Three details matter:

- **The inner text is `aria-hidden`, not the `<li>`.** A focused `<li>` may or may not
  have its text announced, because the `listitem` role does not build an accessible name
  from its contents. Rather than depend on that, the spoken announcement stays the live
  region's job and the marker's text is for sighted keyboard users only. `aria-hidden`
  goes on the inner `<span>`, because putting it on a focused element is a known
  anti-pattern.
- **It uses `:focus-visible`, not `:focus`.** Clicking "Load more" with a mouse moves
  focus to the marker but shows nothing on screen. Activating it by keyboard reveals it.
- **It is removed on `focusout`.** The marker has no purpose after focus leaves it, and
  if left in place it can still be reached by a screen reader's arrow-key browse mode.

### Why `role="listitem"`, not `role="separator"`

A marker sitting between two batches looks like a job for `role="separator"`, and the
[BBC GEL pagination pattern](https://www.bbc.co.uk/gel) uses exactly that to keep markers
like this one out of the list item count.

This example uses `role="listitem"` instead, for two reasons:

1. **The spec does not allow the alternative.** Per
   [ARIA in HTML](https://www.w3.org/TR/html-aria/), once a `<ul>` or `<ol>` exposes a
   list role, its `<li>` children permit *no role other than `listitem`*. There is no
   sanctioned override, BBC's precedent notwithstanding.
2. **`separator` implies a widget this element is not.** A focusable separator is a
   range control: it is expected to carry `aria-valuenow`, `aria-valuemin`, and
   `aria-valuemax`, and to behave like a splitter a user can move. Our marker is an
   inert landing spot for focus. Borrowing slider semantics to describe it is
   inaccurate in a way that `listitem` is not.

**The trade-off, stated plainly:** while the marker is in the DOM, VoiceOver's own list
item count can be inflated by one, and the marker can appear as a blank stop during
rotor or arrow-key navigation, since its text is `aria-hidden`.

Both are narrow. The window is brief because the marker removes itself on `focusout`,
and the positional information a user actually needs ("Banff National Park, 3 of 32")
lives on each result's own `aria-label`, not on VoiceOver's list-level count. Nothing
load-bearing depends on that count being exact at every instant.

---

## Announcing Results (`aria-live`)

A visually hidden `<p>` carries every status message:

```html
<p id="statusMessage" class="visually-hidden" role="status" aria-live="polite"></p>
```

- **It exists in the DOM on page load.** A live region added dynamically may not be
  monitored by the time you write to it.
- **`role="status"` and `aria-live="polite"` are both present** even though the first
  implies the second, for maximum compatibility.
- **`polite`, not `assertive`.** Nothing here is destructive or time-critical, so it can
  wait for whatever the screen reader is currently saying.
- **It is visually hidden, never `display: none`.** Both `display: none` and
  `visibility: hidden` remove an element from the accessibility tree entirely, so it
  would never be announced at all.

### Announcement timing: nested `requestAnimationFrame`

Screen readers can silently drop a live region update that lands in the same batch of
DOM changes as everything else: a fresh set of `<li>`s, a button reset, an error
element appearing. The update is treated as one item in a pile rather than as its own
observable mutation.

Every announcement in this example is therefore scheduled two animation frames out:

```js
requestAnimationFrame(() => {
  statusElement.textContent = '';
  requestAnimationFrame(() => {
    statusElement.textContent = message;
  });
});
```

Nesting the second call guarantees that at least one full paint, the one carrying
everything else that just changed, has completed before the text change fires as its
own isolated update.

> **Why not `setTimeout`?** A timer's firing time relative to the render pipeline is not
> guaranteed by spec; it can land before or after the paint you were hoping to clear.
> `requestAnimationFrame` is explicitly scheduled against rendering. Neither is
> bulletproof, but one is tied to something the browser actually did and the other is a
> guess about how long it might take.

**What the clear on the first frame does and does not buy.** It keeps every update a
clean single-string change rather than mutating from one non-empty string straight to
another. It does **not** make a repeated identical message announce twice. Tested in
VoiceOver/Safari: two identical errors in a row announce once, cleared in between or
not, because VoiceOver compares incoming text against what it last *spoke* rather than
what is currently in the DOM. An empty string is never spoken, so it does not reset that
comparison. A different message in between does.

### The 500ms loading threshold

Announcing "Loading…" the moment a fetch starts means a fast response produces two
announcements back to back, the first of which told the user nothing they did not
already know, since they pressed the button themselves. It also lands close enough to
the second to risk one being dropped.

So the loading message is held behind a timer and cancelled if results arrive first:

```js
loadingAnnouncementTimer = setTimeout(() => announce('loading results.'), 500);
// ...
finally { clearTimeout(loadingAnnouncementTimer); }
```

This is a `setTimeout` immediately after arguing against them, so the difference is
worth naming: the 500ms is not a guess about when the browser will finish its own work.
It is a deliberate threshold for how long a wait has to be before a user needs to be
told about it. A timer is the right tool for measuring human patience.

[Nielsen Norman Group's response time limits](https://www.nngroup.com/articles/response-times-3-important-limits/)
put one second as roughly the limit for a user's train of thought to stay uninterrupted.
That guidance was written about *visual* feedback, though: a spinner that flashes for
300ms is easy to ignore, whereas an announcement is speech a user has to sit through.
One second is a sensible ceiling; under it you have room to choose. This demo's fetch is
artificially delayed to 1200ms so the loading state is observable on demand, and 500ms
leaves a comfortable gap before the results announcement lands.

---

## Disabling Without Losing Focus (`aria-disabled`)

Rapidly pressing "Load more" can trigger several overlapping fetches. The status message
then reports only the most recent batch: "5 results loaded" when 15 actually arrived.

The obvious fix is the `disabled` attribute. **Don't use it here.** A disabled element
loses its place in the tab order, so if the button had focus when it was disabled, focus
drops to `<body>` and the user's next Tab starts over from the top of the page.
VoiceOver in particular loses track of it and will not announce the text change either,
since the element it was reading no longer exists.

`aria-disabled="true"` instead tells assistive technology the control is unavailable
while leaving it focusable and in the tab order. This is a two-part solution, because
`aria-disabled` does not actually prevent activation:

```js
if (this.loading) return;          // part 1: the guard does the preventing
this.loading = true;
this.loadMoreButton.setAttribute('aria-disabled', 'true');   // part 2: the announcement
```

> `aria-disabled` is best used when a control is temporarily unavailable and will work
> again shortly. It means "not usable right now," which is exactly what a mid-fetch
> button is.

Unlike `disabled`, it applies no styling of its own (see below).

---

## Error Handling

Two messages, two audiences:

- **Screen reader users** get the failure through the same `aria-live` status line as
  everything else.
- **Sighted users** get a separate visible `<p class="error-message">`, injected above
  the button. It is `aria-hidden="true"`, so a screen reader user reading through the
  page does not encounter the same text a second time.

Nothing else on the page signals a failure (the result count does not change), which is
why the visible message is needed at all.

The visible error is cleared at the *start* of every attempt rather than on completion.
Once a user has retried, the previous error is no longer current information, whatever
the retry ends up doing.

Focus is deliberately **not** moved on failure. No marker is created, so focus stays on
whichever button was actually clicked, which is exactly where a retry needs it.

---

## Visual Design Decisions

The CSS carries a few decisions that are easy to get wrong.

### Disabled state is signalled by hue, never `opacity`

`opacity` fades an element toward the page behind it. On a white page that is the same
operation as destroying its contrast: the dim and the WCAG failure are inseparable.

The ceiling for *any* colour at `opacity: 0.6` over white is 5.74:1 (pure black
composites to `#666666`). The enabled button is already at 5.48:1, so the entire legal
dim band was 5.48 → 4.50, which is imperceptible. There is no value to tune to.
`#236DA9` at 0.6 became `#7ba7cb`: **2.55:1**, a 1.4.3 failure.

Worse, `opacity` composites the *whole* element including its focus ring, on a button
that `aria-disabled` deliberately keeps focusable.

The disabled state instead **fills**: a grey fill, with a darker grey border and label
drawn on top of it.

| Part | Colour | Contrast |
| --- | --- | --- |
| Fill | `#ced7e0` | 1.46:1 against the white page |
| Border and label | `#3f4d5a` | 5.96:1 on the fill, 8.68:1 on the page |

The two values have to be chosen as a pair, because the fill can only go as dark as the
ink above it allows. A fill around 1.2:1 against the page is the one that gets described
as hard to see: it reads as an off-white cast rather than as a filled button. Holding a
mid-grey `#5a6b7a` ink fixed, the darkest fill still clearing 4.5:1 behind it is about
`#e4e9ed`, which is 1.22:1 against the page, precisely that barely-there fill. Darkening
the ink first is what buys the room to darken the fill.

It also says "busy" rather than "broken," which is what `aria-disabled` means here.

> Do not reach for the "inactive user interface component" exemption in 1.4.3 / 1.4.11
> for an `aria-disabled` control. That attribute is chosen precisely *because* the
> control stays focusable, in the tab order, and carrying live status text. Claiming it
> is inactive contradicts the reason for using it.

### Every focusable element defines its own focus ring

Nothing falls through to the browser default. Left to the UA this is three different
indicators across Chrome, Safari, and Firefox, none of which can be quoted as a ratio.
Chrome's resolves to `#005fcc` at `outline: auto 1px`, which passes at 5.98:1 against
white, but it draws at zero offset, putting that ring flush against a `#236DA9` link at
1.09:1. Legible against the page, mush at the inner edge.

| Element | Colour | Offset | Contrast |
| --- | --- | --- | --- |
| Result link | `#236DA9` | 2px | 5.48:1 |
| Load more | `#236DA9` | 6px | 5.48:1 |
| Load more, `aria-disabled` | `#14405f` | 6px | 10.89:1 |
| Batch marker | `#236DA9` | 2px | 5.48:1 |

The button uses a 6px offset, and that offset does more work than it appears to. The
button carries a 2px border of its own colour, so at a small offset the ring and the
border read as a single heavy doubled edge. The more important reason is that the gap is
what puts page white on both edges of the ring, and page white is what both ring colours
in the table are measured against.

Set that offset to 0 and the disabled button's ring lands directly on its own border at
**1.26:1**, a 1.4.11 failure. Both are dark desaturated blues, so the indicator
disappears into the border it is supposed to be indicating. Swapping back to the primary
blue does not rescue it either, at 1.58:1 against the same border. The ratios quoted
above are a property of the offset as much as of the colour, which is worth knowing
before anyone tightens the spacing.

The `aria-disabled` button swaps the ring's colour, and only the colour: a vivid mid-tone
blue vibrates against the desaturated grey ground next to it, which is a saturation clash
rather than a contrast problem. The blue measures comfortably against that fill and still
looks wrong, so this is one to judge by eye rather than by ratio.

---

## Known Browser Quirks

### VoiceOver drops list semantics when `list-style: none` is set

If a list is styled with `list-style: none`, VoiceOver removes the implicit `list` and
`listitem` roles from the `<ul>` / `<ol>` and its `<li>` children, treating the content
as plain text. Restoring `role="list"` on the parent does **not** cascade back down.
Each `<li>` has to reassert `role="listitem"` explicitly, the batch marker included.

Per [ARIA in HTML](https://www.w3.org/TR/html-aria/) this is "NOT RECOMMENDED" as
redundant, rather than disallowed. It is harmless to state, and needed only to work
around a browser bug the spec does not account for.

### VoiceOver does not follow `focus()` on newly added elements

`marker.focus()` lands real keyboard focus correctly, and Tab and Shift+Tab from there
move exactly where they should. But Safari/VoiceOver can fail to move its own virtual
cursor to match, because the call happens asynchronously (after an awaited fetch) rather
than synchronously inside a trusted user-gesture handler.

When that happens, VoiceOver's cursor stays wherever the user's last direct interaction
left it, and the first arrow-key press after manually tabbing away can re-announce
container context before advancing.

This is a **confirmed, fixed WebKit bug**, traced to an accessibility-tree
update/notify ordering race. It is not addressable by changing the marker's role,
removal timing, or focus target: it reproduces for any element focused after an async
gap. Tab and Shift+Tab remain correct throughout, and the `aria-live` announcement gives
screen reader users the accurate "what just happened" message regardless of where the
cursor currently thinks it is.

Shipped in Safari Technology Preview 246 (June 17, 2026). Not yet confirmed in a stable
Safari release as of writing.

- [Release Notes for Safari Technology Preview 246](https://webkit.org/blog/18128/release-notes-for-safari-technology-preview-246/)
- [WebKit commit f3b6d2a](https://github.com/WebKit/WebKit/commit/f3b6d2ac3f94074de46b2e61b19f48bf46a191db)

---

## Accessibility Benefits

- Every state change (loading, success, failure, completion) reaches sighted users,
  sighted keyboard users, and screen reader users through a channel that suits how they
  are navigating
- Keyboard focus lands at the start of each new batch and is never left sitting on an
  element that leaves the DOM
- The "Load more" button stays reachable and announces its own unavailability instead of
  vanishing from the tab order mid-fetch
- Result counts stay accurate under rapid activation, because the guard prevents
  overlapping fetches rather than relying on the button's disabled state
- Each result carries its own position in the set, using an attribute that is actually
  supported rather than one that reads correct on paper

---

## Related Resources

- (Blog) [Accessible Load More Pattern | Nobody's Left Guessing](https://wcagmadesimple.com/blog/) <!-- TODO: final article slug -->
- (YouTube) [Accessible Load More Pattern](https://www.youtube.com/@WCAGMadeSimple) <!-- TODO: final video link -->
- (Nielsen Norman Group) [Response Times: The 3 Important Limits](https://www.nngroup.com/articles/response-times-3-important-limits/)
- (W3C ARIA-AT) [ARIA and Assistive Technologies Community Group](https://aria-at.w3.org/)
- (W3C) [ARIA in HTML](https://www.w3.org/TR/html-aria/)
- (W3C WAI) [Understanding the Four Principles of Accessibility](https://www.w3.org/WAI/WCAG22/Understanding/intro#understanding-the-four-principles-of-accessibility)

## Attributes and methods referenced

- (MDN Docs) [ARIA: aria-live attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live)
- (MDN Docs) [ARIA: aria-disabled attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled)
- (MDN Docs) [ARIA: aria-label attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label)
- (MDN Docs) [ARIA: aria-setsize attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-setsize)
- (MDN Docs) [ARIA: aria-posinset attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-posinset)
- (MDN Docs) [tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex)
- (MDN Docs) [Window: requestAnimationFrame() method](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
- (MDN Docs) [Window: setTimeout() method](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout)

## WCAG Criteria

The WCAG 2.2 criteria this pattern addresses:

- 1.3.1 Info and Relationships (A)
- 1.4.3 Contrast (Minimum) (AA)
- 1.4.11 Non-text Contrast (AA)
- 2.1.1 Keyboard (A)
- 2.4.3 Focus Order (A)
- 2.4.7 Focus Visible (AA)
- 2.5.3 Label in Name (A)
- 4.1.2 Name, Role, Value (A)
- 4.1.3 Status Messages (AA)
