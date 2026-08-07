# Accessible Load More Pattern

This folder contains code for an accessible load more pattern demonstrating **how to announce results as they
load**, land keyboard focus where a user expects it, and keep the "Load more" button
reachable while it is busy.

## Testing Verification

This example has been tested with:
- VoiceOver
- Safari
- macOS 26.3.1 (a)

Behaviour in NVDA and JAWS has **not** been verified. Where a decision was made
because of a VoiceOver-specific quirk, it is called out below.

## What's in This Example

- `accessible-load-more-pattern.html` – The full pattern, built as plain web components
- `inaccessible-load-more-pattern.html` – The same pattern with every accessibility affordance removed, for comparison
- `css/main.css` – Shared styles, including the contrast-checked focus and disabled states
- `data/parks-data.js` – 32 Canadian national parks, used as the fake paginated response

Both demos use the same component names and property names, so they diff cleanly
against each other.

## How to Use

1. Open `accessible-load-more-pattern.html` in your browser
2. Turn on a screen reader, navigate with your keyboard and press **Load more**. Listen for the result count announcement
3. Press **Tab** immediately after. Focus should land at the start of the new batch
4. Press **Simulate fetch failure** to hear the error announcement and see the sighted-user error message
5. Keep loading until all 32 results are shown. The button removes itself and the announcement changes to "all 32 results shown"
6. Compare against `inaccessible-load-more-pattern.html`, where none of the above happens

No build tools required. Everything is plain HTML, CSS, and JavaScript.

## What the Pattern Does

| Concern | Mechanism | Who it serves |
| --- | --- | --- |
| Announce new results | `role="status"` + `aria-live="polite"` | Screen reader users |
| Avoid announcement collisions | One deferred, cancelable announcer | Screen reader users |
| Avoid needless "Loading" chatter | 500ms delay, superseded on arrival | Screen reader users |
| Land focus predictably | Batch marker with `tabindex="-1"` | Keyboard users, screen reader users |
| Stay reachable while busy | `aria-disabled` + a loading guard | Keyboard users |
| Position within the set | `aria-label` on each result link | Screen reader users |
| Report failures | Live region + a separate visible message | Everyone, through their own channel |

---

## Position in the Set: `aria-label`, not `aria-setsize` / `aria-posinset`

`aria-setsize` and `aria-posinset` read like they were made for this: one maps to the
total number of results, the other to an individual result's place in it.

**Support for them varies widely across major screen readers.** At the time of writing
(September 2026), the [W3C ARIA-AT ARIA feature support levels report](https://aria-at.w3.org/reports/aria-features) puts them at:

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

Without intervention, pressing "Load more" leaves focus on the button while new
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

**There is no marker before the first batch.** The first batch is fetched by
`connectedCallback()`, not by a user pressing anything, so there is no prior focus
position to preserve and nothing has "just loaded" from the user's point of view. A
marker there would be a focus move nobody asked for, on page load. Only batches two
onward get one.

### Why `role="listitem"`, not `role="separator"`

A marker sitting between two batches looks like a job for `role="separator"`, and the
[BBC GEL pagination pattern](https://bbc.github.io/gel/components/load-more/#recommended-markup) uses exactly that to keep markers
like this one out of the list item count.

This example uses `role="listitem"` instead, for two reasons:

1. **The spec does not allow the alternative.** Per
   [ARIA in HTML](https://www.w3.org/TR/html-aria/), once a `<ul>` or `<ol>` exposes a
   list role, its `<li>` children permit *no role other than `listitem`*. There is no
   sanctioned override, BBC's precedent notwithstanding.
2. **`separator` implies a widget this element is not.** A focusable separator is a
   range control: it is expected to carry `aria-valuenow`, `aria-valuemin`, and
   `aria-valuemax`, and to behave like a slider/splitter a user can move. Borrowing slider
   semantics to describe our marker is inaccurate.

**The trade-off, stated plainly:** while the marker is in the DOM, VoiceOver's own list
item count can be inflated by one, and the marker can appear as a blank stop during
rotor or arrow-key navigation, since its text is `aria-hidden`.

Both are narrow. The window is brief because the marker removes itself on `focusout`,
and the positional information a user actually needs ("Banff National Park, 3 of 32")
lives on each result's own `aria-label`, not on VoiceOver's list-level count. Nothing
load-bearing depends on that count being exact at every instant.

---

## Announcing Results (`aria-live`)

A visually hidden `<p>` under the button carries every status message: "Loading
results." while a fetch is in flight, "5 results loaded, 5 of 32 shown." once it
finishes.

```html
<p id="statusMessage" class="visually-hidden" role="status" aria-live="polite"></p>
```

Four decisions behind it:

- **It sits in the DOM on page load.** A screen reader may not announce changes to a live region that was added dynamically.
- **`role="status"` and `aria-live="polite"` are both present.** The first implies the second, but stating both keeps the intent explicit.
- **`polite`, not `assertive`.** Nothing in this pattern is time sensitive or destructive, so it can wait for whatever the screen reader is currently saying.
- **It is visually hidden, never `display: none`.** Both `display: none` and `visibility: hidden` remove an element from the accessibility tree, so it would never be announced at all.

### The 500ms loading threshold

Firing the loading message the moment a fetch starts produces two announcements back to
back on a fast response: "Loading results.", with "5 results loaded, 5 of 32 shown."
right behind it. In this scenario, the first message is noise, and the two blur
together.

However, there is value in keeping the "Loading results." messaging when the fetch is
slow. Therefore it is held back for 500ms, and any newer message replaces it if one
arrives inside that window:

```js
this.announce('Loading results.', LoadMoreList.LOADING_ANNOUNCEMENT_DELAY);
// ...the success or error announce() below replaces it if the fetch beats the delay
```

Why is this needed? Because a screen reader works through a single queue of speech.
Announcements are heard one after another, and each takes as long as it takes to say. An
unnecessary "Loading results." message spends the user's listening time and pushes the
announcement that matters further back. The bar for "worth saying" is higher than the
bar for "worth showing", which is why speech needs this threshold and a visual indicator
does not.

[Nielsen Norman Group's response time limits](https://www.nngroup.com/articles/response-times-3-important-limits/)
put one second as roughly the limit for a user's train of thought to stay uninterrupted.
That is a sensible ceiling: past it, someone who pressed a button and heard nothing
starts to wonder whether it registered. Under it you have room to choose. A shorter
threshold fires the message more often, a longer one lets fast responses skip it
entirely.

`LOADING_ANNOUNCEMENT_DELAY` is a named constant of its own because it measures human
patience rather than anything the browser is doing. `SIMULATED_FETCH_DELAY` holds the
fetch open for 1500ms so the loading state is audible on every press: "Loading results."
fires at 500ms, and the results announcement follows about a second later. It sits at
module scope because it goes away with the rest of the simulation once `fetchBatch()` is
a real `fetch()`.

### Replacing a message before it is spoken

The threshold only works if a later message can take the place of one still waiting on
its timer. Every announcement goes through one method, and the component holds a single
pending timer:

```js
announce(message, delay = LoadMoreList.DEFAULT_ANNOUNCEMENT_DELAY) {
  this.cancelAnnouncement();
  this.statusElement.textContent = '';
  this.announcementTimer = setTimeout(() => {
    this.announcementTimer = null;
    this.statusElement.textContent = message;
  }, delay);
}

cancelAnnouncement() {
  clearTimeout(this.announcementTimer);
  this.announcementTimer = null;
}
```

Each call clears the pending timer before setting its own, so a message that is only
relevant while a fetch is running drops itself once that fetch resolves. No caller has
to track a timer id.

`cancelAnnouncement()` is separate and public for the case with no replacement message.
`disconnectedCallback()` calls it, so a component removed mid-fetch cannot fire a
callback into a detached element.

One caveat on the clear. It keeps each update a single clean string change, but it does
**not** make a repeated identical message announce twice. Tested in VoiceOver/Safari,
two identical errors in a row announce once whether cleared in between or not, because
VoiceOver compares incoming text against what it last *spoke*, and an empty string is
never spoken.

### Where this approach stops fitting

Replacing unconditionally is safe here because only one outcome message exists per
interaction: the batch message or the error, never both, with the `this.loading` guard
stopping a second interaction starting underneath the first. The only message ever
superseded is the transient loading one, which is the point.

Outcome messages arriving from more than one place breaks that assumption.

---

## Disabling Without Losing Focus (`aria-disabled`)

Rapidly pressing "Load more" can trigger several overlapping fetches. The status message
then reports only the most recent batch: "5 results loaded" when 15 may have actually arrived.

The obvious fix is the `disabled` attribute. **Don't use it here.** A disabled element
loses its place in the tab order, so if the button had focus when it was disabled, focus
drops to `<body>` and the user's next Tab starts over from the top of the page.

`aria-disabled="true"` instead tells assistive technology the control is unavailable
while leaving it focusable and in the tab order. This is a two-part solution, because
`aria-disabled` does not actually prevent activation. The 2nd part is to implement a loading guard that prevents additional fetches when a loading state is active:

```js
if (this.loading) return;          // the guard does the preventing
this.loading = true;
this.loadMoreButton.setAttribute('aria-disabled', 'true');   // the attribute communicates the state of the control
```

> `aria-disabled` is best used when a control is temporarily unavailable and will work
> again shortly. It means "not usable right now," which is exactly what a mid-fetch load more
> button is.

Unlike `disabled`, it applies no styling of its own (see styling considerations in the Visual Design Decisions section below).

While the button is disabled and loading is happening, the load more button's label also changes to "Loading…", which acts as another visual state change for sighted users.

---

## Error Handling

Two messages, two audiences:

- **Screen reader users** get the failure through the same `aria-live` status line as
  everything else.
- **Sighted users** get a separate visible `<p class="error-message">`, injected above
  the button. It is `aria-hidden="true"`, so a screen reader user reading through the
  page does not encounter the same text a second time.

The visible error is cleared at the *start* of every attempt rather than on completion.
Once a user has retried, the previous error is no longer current information, whatever
the retry ends up doing.

Focus is deliberately **not** moved on failure. No marker is created, so focus stays on
whichever button was actually clicked, which is exactly where a retry needs it.

---

## Visual Design Decisions

The CSS carries a few decisions that are easy to get wrong.

### Disabled state is signalled by fill, not `opacity`

While fading a disabled control with `opacity` is permitted (as inactive components are exempt from both 1.4.3 and 1.4.11)
the load more button is a poor candidate for that exemption.

`aria-disabled` keeps the button focusable and in the tab order. The button can also hold focus for the whole data fetch (this is the loading state).

Opacity often drops elements outside of the perceivable contrast ratios. Given that, it makes sense to keep the load more button legible and passing the same contrast requirements as active components.

So, rather than opacity, a dark grey border and text are paired with a light grey fill:

| Part | Colour | Contrast |
| --- | --- | --- |
| Fill | `#ced7e0` | 1.46:1 against the white page |
| Border and label | `#3f4d5a` | 5.96:1 on the fill, 8.68:1 on the page |

Grey was chosen because it is the conventional signal: disabled form fields and
controls are greyed out across most interfaces. The shades may be different, but the signal is the same.

### Every focusable element defines its own focus ring

Browser defaults for focus ring colour and offset value vary.

Rather than leave contrast ratios up to chance by keeping the defualts, this code example uses it's own tried and true values:

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
disappears into the border of the button it is supposed to be indicating. Swapping back to the primary
blue does not rescue it either, at 1.58:1 against the same border. The ratios quoted
above are a property of the offset as much as of the colour, which is worth knowing
before anyone tightens the spacing.

The `aria-disabled` state on the button swaps the ring's colour, and only the colour:
`#236DA9` becomes `#14405f`. That is the same blue tilted toward black rather than a
different hue. Darkening drains the perceived vividness along with it, so the ring stops competing with
the desaturated grey fill beside it. Note that this is a judgement call, the primary blue focus ring passed contrast requirements here, yet still appeared hard to see.

---

## Known Quirks

### VoiceOver drops list semantics when `list-style: none` is set

If a list is styled with `list-style: none`, VoiceOver removes the implicit `list` and
`listitem` roles from the `<ul>` / `<ol>` and its `<li>` children, treating the content
as plain text. Restoring `role="list"` on the parent does **not** cascade back down.
Each `<li>` has to reassert `role="listitem"` explicitly, the batch marker included.

Per [ARIA in HTML](https://www.w3.org/TR/html-aria/) this is "NOT RECOMMENDED" (as its
redundant), rather than disallowed. It is harmless to state, and needed only to work
around a screen reader bug the spec does not account for.

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

- (Blog) [Accessible Load More Pattern | Nobody's Left Guessing](https://wcagmadesimple.com/blog/accessible-load-more-pattern)
- (YouTube) Accessible Load More Pattern (Coming Soon)
- (Aleksandr Hovhannisyan) [Managing Keyboard Focus for Load-More Buttons](https://www.aleksandrhovhannisyan.com/blog/load-more-button-focus/)
- (Alessio Carnevale) [An accessible “Load more” implementation](https://medium.com/@alessio.carnevale/an-accessible-load-more-implementation-b55c07603bd8)
- (Nielsen Norman Group) [Response Times: The 3 Important Limits](https://www.nngroup.com/articles/response-times-3-important-limits/)
- (W3C ARIA-AT) [ARIA feature support levels report](https://aria-at.w3.org/reports/aria-features)
- (W3C ARIA-AT) [Community Group](https://github.com/w3c-cg/aria-at/wiki)
- (W3C) [ARIA in HTML](https://www.w3.org/TR/html-aria/)
- (W3C WAI) [Understanding the Four Principles of Accessibility](https://www.w3.org/WAI/WCAG22/Understanding/intro#understanding-the-four-principles-of-accessibility)

## Attributes and methods referenced

MDN resource documentation for each attribute and method referenced in this example:

- [ARIA: aria-disabled attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-disabled)
- [ARIA: aria-hidden attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-hidden)
- [ARIA: aria-label attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label)
- [ARIA: aria-live attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live)
- [ARIA: aria-posinset attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-posinset)
- [ARIA: aria-setsize attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-setsize)
- [ARIA: status role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role)
- [disabled HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/disabled)
- [Element: focusout event](https://developer.mozilla.org/en-US/docs/Web/API/Element/focusout_event)
- [:focus-visible CSS pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-visible)
- [tabindex HTML global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex)
- [Window: clearTimeout() method](https://developer.mozilla.org/en-US/docs/Web/API/Window/clearTimeout)
- [Window: setTimeout() method](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout)

## WCAG Criteria

The WCAG 2.2 criteria this pattern satisfies, across the article and this code example:

- [1.3.1 Info and Relationships (A)](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships)
- [1.4.3 Contrast (Minimum) (AA)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)
- [1.4.11 Non-text Contrast (AA)](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [2.1.1 Keyboard (A)](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)
- [2.4.3 Focus Order (A)](https://www.w3.org/WAI/WCAG22/Understanding/focus-order)
- [2.4.7 Focus Visible (AA)](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible)
- [2.4.11 Focus Not Obscured (Minimum) (AA)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- [2.5.3 Label in Name (A)](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name)
- [4.1.2 Name, Role, Value (A)](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value)
- [4.1.3 Status Messages (AA)](https://www.w3.org/WAI/WCAG22/Understanding/status-messages)
