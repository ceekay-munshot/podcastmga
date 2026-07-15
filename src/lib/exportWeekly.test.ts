import { describe, it, expect } from 'vitest'
import { weeklyToWord } from './exportWeekly'
import { summaryToWord } from './exportSummary'
import { EPISODES, PODCASTS, WEEKLY } from './mock-data'

// The exported Word doc is the user-facing artifact. These smoke tests pin both the
// content (pitched ideas with their thesis, organized by show) and the institution-
// grade house style (navy cover, gold/serif palette, the dark quote panel).

const episodeById = (id: string) => EPISODES.find((e) => e.id === id)
const podcastById = (id: string) => PODCASTS.find((p) => p.id === id)

describe('weeklyToWord — institution-grade weekly doc', () => {
  const html = weeklyToWord(WEEKLY, episodeById, podcastById)

  it('opens with the navy house-style cover', () => {
    expect(html).toContain('class="cover"')
    expect(html).toContain('AI Podcast Intelligence') // eyebrow
    expect(html).toContain('class="cv-title"')
    expect(html).toContain('Weekly Summary')
    // House palette + serif display role are present in the stylesheet.
    expect(html).toContain('#b8902f') // gold
    expect(html).toContain('#14233c') // navy cover
    expect(html).toContain('Georgia')
  })

  it('leads with the synthesised Guidepoint body: Key Points + the data tables', () => {
    expect(html).toContain('Key Points')
    expect(html).toContain('Power, not silicon, is the binding constraint') // a key-theme heading
    expect(html).toContain('Quantitative Summary')
    expect(html).toContain('Investment Readout')
    expect(html).toContain('Investment interpretation') // a readout card label
    expect(html).toContain('class="dt"') // the data tables
    expect(html).toContain('<strong>') // **bold** claim leads promoted to gold
  })

  it('keeps mentions, the dark quote panel, and a sources table', () => {
    expect(html).toContain('Mentions')
    expect(html).toContain('class="interesting"') // dark navy quote panel
    expect(html).toContain('class="srcs"') // sources table
    expect(html).toContain('tag-') // colour-coded show tags
  })

  it('falls back to the By-Show body when there are no synthesised key themes', () => {
    const noThemes = weeklyToWord({ ...WEEKLY, keyThemes: [] }, episodeById, podcastById)
    expect(noThemes).toContain('By Show')
    expect(noThemes).toContain('class="show-head"')
    expect(noThemes).toContain('Long Nvidia (NVDA) into the capex supercycle')
    expect(noThemes).toContain('Pitched by <b>David Sacks</b>')
  })
})

describe('summaryToWord — institution-grade episode doc', () => {
  it('opens with a cover naming the show and includes Ideas Pitched', () => {
    const full = EPISODES.find((e) => e.id === 'ep-oddlots-grid')!
    const html = summaryToWord(full, podcastById(full.podcastId))
    expect(html).toContain('class="cover"')
    expect(html).toContain('Odd Lots') // eyebrow = show · author
    expect(html).toContain(full.title)
    expect(html).toContain('Ideas Pitched')
    expect(html).toContain('Own the intermediaries that get paid for balance sheet')
    expect(html).toContain('Pitched by <b>The guest</b>')
  })

  it('omits the Ideas section for an episode with no pitches', () => {
    const brief = EPISODES.find((e) => e.id === 'ep-mib-brief')!
    const html = summaryToWord(brief, podcastById(brief.podcastId))
    expect(html).not.toContain('Ideas Pitched')
  })
})
