# WCAG Made Simple Code Examples

Accessible front-end code snippets, demos, and patterns that align with [WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/) and practical accessibility best practices.

These examples are companion resources to the [WCAG Made Simple Blog](https://wcagmadesimple.com).

New examples land a few times a year. If you'd like to know when one does, [get an email when something new publishes](https://wcagmadesimple.com/subscribe). It's a heads up, not a newsletter.

## 📖 What You’ll Find Here

This repo grows one article at a time, but the direction stays the same:

- **Foundations**: how semantic HTML elements like landmarks and text-level semantics appear in the accessibility tree, and what that changes for screen reader users
- **Interactive patterns**: components that change after the page loads, where focus, announcements and state all have to work together (things like load more, filtering and removable selections)
- **Side-by-side comparisons**: an accessible version next to an inaccessible one or a common alternative, so you can hear the difference for yourself
- **Tested results, not just rules**: each example lists the screen readers and browsers it was tested in, and points out the quirks found along the way

Each example is tied to a specific article and video walkthrough, and each piece has its own job:

- **The article** walks through the key decisions and why they were made
- **The code** carries the details and caveats that would bog an article down
- **The video** shows what the example actually sounds like with a screen reader

Together, they let you explore *why* something works, not just take my word for it.

## 🗂 Repository Structure

Examples are grouped by blog article. Folder names match the article slugs, e.g.:

- /how-semantic-html-landmarks-improve-accessibility/

Inside each folder, you’ll typically find:

- HTML file(s) – the core example
- `README.md` – notes and context
- Optional CSS/JS if needed

## 🚀 Getting Started

Clone the repo and open any example in your browser:

```bash
git clone https://github.com/WCAGMadeSimple/wcag-made-simple-code-examples.git
cd wcag-made-simple-code-examples
```

No build tools required. These examples are intentionally kept vanilla for clarity and ease of use.

## 🔗 Related Resources

- 📘 [WCAG Made Simple Blog](https://wcagmadesimple.com) – full articles & tutorials
- 🎥 [WCAG Made Simple YouTube Channel](https://www.youtube.com/@WCAGMadeSimple) – walkthroughs of these examples
- 📬 [Get notified of new articles](https://wcagmadesimple.com/subscribe) – an email when something new publishes

## 🤝 Contributing

Contributions are welcome! If you have improvements to existing examples, please feel free to open an issue or PR.

Please make sure code PRs:
- are accessible first
- have been tested manually and with a screen reader
- use small, focused commits
- follow the [conventional commit guidelines](https://www.conventionalcommits.org/en/v1.0.0/)
- update the relevant README
- keep the MIT license

Please keep all PRs focused on improvements to existing examples.

## 🌍 Why This Repo Exists

Accessibility can feel overwhelming when buried in W3C documentation.

Like the blog it supports, this repo aims to make WCAG simple, clear, and practical so that developers can build inclusive websites without guesswork.

## ⚖️ Accessibility Compliance Support

This repository is designed to help developers, designers, and organizations create websites that meet accessibility standards required by law.

While the examples follow [WCAG 2.2 guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/), they also provide practical guidance for compliance with key accessibility laws and regulations, including:

- **ADA (Americans with Disabilities Act)** – United States
- **Section 508 (Rehabilitation Act)** – United States
- **ACA (Accessible Canada Act)** – Canada
- **AODA (Accessibility for Ontarians with Disabilities Act)** – Ontario, Canada
- **IASR (Integrated Accessibility Standards Regulation)** – Ontario, Canada
- Other national or international laws and regulations that reference WCAG standards

By using these examples, contributors and organizations can build websites that are **inclusive, usable, and more likely to meet legal accessibility obligations**.

⚠️ **Note**: This repository is intended as an educational and practical resource. It does **not constitute legal advice nor do examples guarantee compliance**. Organizations should consult legal professionals for formal compliance verification.
