# Work assets — how this folder is organized

All of this is real material sourced from an old agency archive (see the
project's `work-assets-proof-vs-brand` memory for the sourcing rule this
follows). It's organized to match `src/data/samples.ts` and
`src/data/campaigns.ts`, not by any fictional case study.

```
samples/<medium>/...     — standalone, single-medium pieces (one real client
                            each). Listed in src/data/samples.ts and shown in
                            the filterable gallery at /work.
campaigns/<slug>/...      — full multi-channel stories: several real mediums,
                            one real client, genuinely spanning that breadth
                            in the archive. Listed in src/data/campaigns.ts
                            and shown at /work/:slug. Their pieces also show
                            up in the /work gallery (tagged with a "Full
                            story →" link back to the campaign page).
```

**The rule that governs both:** if a source file has a real client's own
branding/logo/content on it, that branding stays exactly as it was made —
only the presentation (staging, color grade, cropping) changes. Nothing here
gets rebranded into ABC Mediamix's own identity unless it's genuinely our
own old material with no client attached (see `abc-legacy-web-*` in
`samples/digital/`, captioned as such).

Only two campaigns exist right now (`avj`, `cyberwalk`) because those are
the only clients the archive shows genuine multi-medium breadth for — see
the campaign-restructure conversation for how those were picked and what
else was considered and left as standalone samples instead.

To add a new sample: drop the staged file under `samples/<medium>/`, add an
entry to `workSamples` in `src/data/samples.ts` with the real client name
and an honest caption. To add a new campaign: create
`campaigns/<slug>/`, add entries to `workSamples` with `campaignSlug` set,
and add the campaign itself (with real Brief/Idea/Execution/Work copy — no
invented metrics) to `src/data/campaigns.ts`.
