# Work-page medium assets — raw material + AI conversion prompts

Each `work-0X/` folder holds the hero banner (`work-0X.jpg`, already live on the site) plus a
set of **raw source files** pulled from the D:\Sir System\Alok archive, one subfolder per
medium (`ooh`, `social`, `tv`/`film`, `digital`, `print`, `pr`, `radio`, `experiences`/`events`,
`stationery`). These are unedited originals — real old client work, site photography, e-mailers,
visiting cards, TVCs and radio spots. Nothing here has been retouched; that's the point — you're
going to run each one through ChatGPT (or another image model) to turn it into a polished mockup
in the site's own visual language, per the plan below.

**Still carrying original client branding/contact info**, same as the hero banners — expect logos,
phone numbers, old URLs baked into most stills. The prompts below generally ask the model to
crop/relight around that rather than promising to remove it — image models are unreliable at
cleanly deleting text, so plan to also crop tightly on the strongest visual element where that
matters more than the words.

**Two exclusions worth knowing about:** I left out a folder full of candid photos of an
identifiable beauty-pageant/event crowd (privacy), and one PR photo that included a recognizable
public figure (Kapil Dev) at a party — using that on the site could wrongly read as a celebrity
endorsement of ABC Mediamix, so I swapped it for a plain newspaper press-clipping instead
(`work-04/pr/dainik-jagran-press-clipping.pdf`).

## Site style guide (feed this to ChatGPT with every image)

```
Brand: ABC Mediamix — an editorial, cinematic ad-agency portfolio site.
Palette: navy #262970 (primary/ink), gold #9f732c and gold-light #c79a5c (accent),
gold-pale #e4cfa4 (highlight), charcoal #3e3e3e (secondary text), ivory #f4f1ea /
ivory-deep #ece6d9 / paper #faf8f3 (light backgrounds).
Typeface family in use: Inter (clean geometric sans-serif) — if any type is generated,
match that character, not a script or slab serif.
Mood: minimal, confident, high-contrast, generous negative space, full-bleed photography
with a soft navy gradient wash for text legibility. No stock-photo clutter, no busy
gradients, no drop-shadowed 3D bevels. Think a modern design studio's showreel, not a
2008 real-estate flyer (even when the source image IS a 2008 real-estate flyer).
Output: high resolution, clean edges, photorealistic mockup (not a flat clipart device).
```

## Per-medium mockup convention

| Medium | Treatment to ask ChatGPT for |
|---|---|
| `social` / `digital` | Composite the creative into a modern smartphone screen (Instagram post/story or feed UI), phone held at a slight angle or resting on a navy/ivory surface, soft studio light, shallow depth of field. |
| `tv` / `film` | Composite as a still playing on a slim flatscreen TV in a dim, minimal navy-toned room, or crop to a 21:9 cinematic frame with subtle letterboxing and a film-grain grade. |
| `ooh` | Composite onto a realistic billboard/gantry/hoarding in an urban street scene shot from below at dusk, city lights, gentle motion-blur traffic in the foreground for scale and drama. |
| `stationery` | Arrange as an elegant flat-lay — business card, letterhead, envelope — on a dark navy or marble surface, soft directional light, subtle gold foil edge highlight, shadow falling right. |
| `print` / `pr` | Present as a magazine spread or press clipping resting on a clean textured surface (paper grain visible), gentle drop shadow, editorial-photography lighting. |
| `radio` | These are audio files — generate a square "spot" cover card: a stylised navy/gold soundwave or vinyl-groove graphic, minimal type in the Inter-style face, treat it like an album-art tile, not a literal image of a radio. |
| `experiences` / `events` | Crop wide, cinematic vignette, warm gold rim-light on any people, crowd/bokeh background thrown soft so the moment reads over the noise. |

Open the `PROMPTS.md` inside each `work-0X/` folder for the ready-to-paste prompt per file.
