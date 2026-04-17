# Office Web Homepage Design

Date: 2026-04-17
Project: `office_web`
Status: Approved for spec review

## Summary

Build the `office_web` homepage as a cinematic, brand-led landing page for Rocky. The page should closely follow the provided Figma screenshot and position Rocky as a trustworthy crypto trading platform centered around the `POCKY` token model.

The audience is crypto beginners. The tone is stable, credible, and financial rather than aggressive or speculative. The first release is English-only.

The page must preserve the visual identity from the screenshot while improving implementation quality in three areas:

1. Semantic structure for accessibility and SEO
2. Search metadata and structured data
3. Responsive behavior across desktop and mobile

## Goals

### Primary goals

- Present Rocky as a credible, premium crypto trading brand
- Explain the `trade-to-mine` and `POCKY` token model clearly
- Drive users toward account creation and platform exploration
- Convert the visual landing page into crawlable, semantic HTML content

### Secondary goals

- Establish a scalable homepage foundation for future marketing pages
- Preserve strong art direction without making the site feel like a template
- Support future expansion to additional pages without reworking the homepage architecture

## Non-goals

- Building the trading product itself
- Adding blog, docs, or pricing pages in this phase
- Adding multilingual support in this phase
- Implementing authentication or backend integration in this phase
- Inventing new homepage sections that are not implied by the approved screenshot

## Audience

### Primary audience

New-to-crypto or early-stage trading users evaluating whether Rocky feels safe, understandable, and worth trying.

### Audience needs

- Confidence that the platform is trustworthy
- A simple explanation of how Rocky differs from other exchanges
- A clear sense of how `POCKY` works and why it matters
- Reassurance that the platform is structured, not chaotic

## Brand Direction

### Tone

- Stable
- Credible
- Premium
- Deliberate

### Emotional target

Users should feel that Rocky is a serious trading platform with a distinctive token system, not a hype-first meme landing page.

### Visual direction

- Dark, atmospheric hero with cinematic landscape imagery
- Restrained orange highlight color for emphasis
- Deep charcoal and sand-toned palette
- Precision lines, data blocks, and diagrammatic layouts
- Strong typography hierarchy with uppercase display treatment where appropriate

## Page Architecture

The homepage should remain a single long-form landing page with the following sections in order.

### 1. Header

Content:

- Rocky wordmark/logo
- Navigation links
- Primary CTA
- Secondary CTA or utility action if the design requires it

Behavior:

- Fixed or sticky behavior is optional, but must not interfere with the hero composition
- Desktop navigation should match the minimal look from the screenshot
- Mobile navigation can collapse into a menu trigger

### 2. Hero

Purpose:

Set brand tone immediately and communicate Rocky's core message.

Content:

- Main headline: `PRIVATE POSITIONS. MINING TRADES. ALL IN POCKY.`
- Supporting copy introducing Rocky and the token-linked trading concept
- Two CTA buttons
- Four compact stat items below the hero copy
- Large desert scene background with central monument imagery

Requirements:

- Headline remains real text, not baked into an image
- CTA hierarchy should clearly distinguish primary vs secondary
- Stats should stay readable on smaller screens
- Hero should feel expansive on large displays without becoming sparse

### 3. Moats Section

Purpose:

Explain why Rocky is structurally differentiated.

Content:

- Eyebrow label
- Section title matching the approved direction: `Three Moats Competitors Structurally Cannot Replicate.`
- Three feature cards with short descriptions and compact supporting links or notes

Requirements:

- Preserve the angular line and panel language from the screenshot
- Use semantic headings and paragraphs inside each card
- Avoid generic feature-card styling; cards should feel integrated with the brand system

### 4. Trade Produces POCKY Section

Purpose:

Explain that trading activity creates `POCKY`, making token generation part of the core trading loop.

Content:

- Left-side product mockup resembling a compact trading module
- Right-side title: `Every Trade You Make Produces POCKY.`
- Supporting paragraph
- Bullet list of key implications
- CTA button

Requirements:

- Mock product UI can be implementation art, not a live app
- Key explanatory copy must be textual and indexable
- Section layout should stack cleanly on mobile

### 5. Mechanism Flow Section

Purpose:

Clarify the Rocky value loop.

Content:

- Section title: `Trading Is Mining. Holding Is Discount. Loop Closes.`
- Introductory supporting paragraph
- Four-step or multi-node connected flow showing how usage, earning, holding, and fee or reward effects connect

Requirements:

- Flow should preserve the diagram-like logic shown in the screenshot
- Mobile version can simplify connector lines if needed, but the step sequence must remain understandable
- This section should read as a system, not as four unrelated cards

### 6. Tokenomics Section

Purpose:

Show fixed supply and allocation logic for `POCKY`.

Content:

- Section title: `1 Billion POCKY. Fixed Supply. Half To Users.`
- Supporting copy
- Central donut chart or radial allocation graphic
- Clearly labeled allocation categories with percentages

Requirements:

- Allocation labels must remain textual for accessibility and crawlability
- The chart should feel premium and branded rather than default-chart-library output
- This section is a signature visual moment and should keep the luminous sand-to-sky gradient atmosphere seen in the screenshot

### 7. FAQ Section

Purpose:

Resolve common questions and add SEO-supporting informational content.

Content:

- Section heading
- Accordion list of beginner-friendly questions about Rocky, `POCKY`, mining through trading, platform safety, and token purpose

Requirements:

- At least 5 meaningful questions
- First item may be expanded by default
- All FAQ content must be rendered in HTML and included in schema markup

### 8. Footer CTA and Footer

Purpose:

Close with brand identity and a final conversion opportunity.

Content:

- Large statement: `SEALED IN CANTON. FORGED IN ROCKY.`
- Short support paragraph
- CTA buttons
- Footer columns or grouped links
- Brand block and legal copy

Requirements:

- Maintain scenic background treatment
- Footer content must stay readable over the image
- Final CTA should feel confident and composed, not urgent or salesy

## SEO Strategy

### Positioning

The homepage should support both brand discovery and product understanding. It should not chase broad, low-intent exchange keywords with repetitive copy. Instead, it should combine brand terms with clear trading-platform language and `POCKY` token explanations.

### Metadata requirements

- Unique page title
- Meta description
- Canonical URL
- Open Graph title, description, and image
- Twitter card metadata

### Recommended metadata direction

- Title should combine `Rocky`, `POCKY`, and `crypto trading platform`
- Description should explain Rocky as a trading platform where trading activity connects to token rewards or mining logic

### Semantic structure

- Exactly one `h1`
- Major sections use `h2`
- Card titles and supporting labels use `h3` or lower as appropriate
- Header and footer use semantic landmarks
- Decorative visuals should not carry critical copy

### Structured data

Include:

- `WebSite`
- `Organization`
- `FAQPage`

Do not add speculative structured data that implies regulated status, reviews, pricing, or investment guarantees.

### Indexable copy strategy

Ensure the following concepts appear naturally in crawlable text:

- Rocky crypto trading platform
- POCKY token
- trading rewards or mining through trading
- fixed token supply
- beginner-friendly explanation of the model

## Accessibility Requirements

- Maintain sufficient contrast across all sections
- All CTA buttons must have clear accessible labels
- FAQ accordion must be keyboard accessible
- Charts and visual diagrams must have textual equivalents
- Decorative background imagery must not block reading or interaction
- Motion should respect reduced-motion preferences

## Responsive Behavior

### Desktop

- Prioritize cinematic composition and wide-section rhythm
- Preserve asymmetric layouts where the screenshot depends on them

### Tablet

- Reduce horizontal spread while preserving hierarchy
- Convert complex split layouts into tighter stacked or semi-stacked compositions

### Mobile

- Stack all major sections vertically
- Simplify decorative connector lines where necessary
- Keep typography and CTA sizing readable without reducing the page to a generic mobile card list

## Technical Direction

### Framework

Use `Next.js` with the App Router for the initial build.

Reasons:

- Strong support for SEO metadata and social metadata
- Good foundation for future marketing pages
- Straightforward routing and static-first homepage delivery
- Easy structured data injection

### Styling

Use a tokenized design system at the page level:

- Color tokens for background, text, accent, border, and atmospheric overlays
- Spacing tokens for section rhythm and component padding
- Typography tokens for display, heading, body, and label usage

Avoid introducing a heavy component dependency footprint unless it directly speeds implementation.

### Content model

Keep homepage copy local to the page implementation for now, but structure the sections so the content can be extracted later if the site grows.

## Implementation Constraints

- Follow the approved screenshot closely in composition and hierarchy
- Do not flatten the site into a generic SaaS hero plus card grid
- Do not replace brand atmosphere with default gradients or glassmorphism
- Do not overload the homepage with exchange-jargon blocks aimed at experts
- Keep the page visually strong while ensuring text remains real HTML content

## Acceptance Criteria

The design should be considered ready for implementation when:

1. The homepage section order matches the approved screenshot
2. The visual direction preserves the dark cinematic Rocky identity
3. The page communicates `POCKY`, tokenomics, and trading loop clearly
4. SEO foundations are included without visibly compromising the design
5. The layout works on desktop and mobile
6. The FAQ section is both usable and schema-ready
7. The final result feels like a premium crypto brand landing page rather than a template

## Open Decisions Resolved In This Spec

- Homepage type: official homepage
- Audience: beginners
- Brand tone: stable and trustworthy
- Launch language: English only
- Design source: provided screenshot supersedes inaccessible direct Figma MCP extraction

## Next Step

After user review of this spec, create the implementation plan and then build the homepage in the empty `office_web` repository.
