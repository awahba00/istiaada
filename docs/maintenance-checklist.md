# Quarterly help-resources maintenance checklist

The specialist-help screen (`src/data/app/help-resources.ts`) makes factual
claims about Egyptian services: phone numbers, scope, hours, cost, and
confidentiality. Those claims were verified against official sources on
**2026-10-14** (`HELP_INFO_VERIFIED_AT`). This document is the manual
procedure for keeping them true. It is deliberately a HUMAN procedure — the
app must never poll external services or check numbers at runtime.

Run this checklist **every quarter** (and after any known ministry
reorganization), recording the date, the sources, and the verdict for each
line.

## Procedure

1. **16328 — psychological support hotline (GSMHAT / Ministry of Health)**
   - Check the Secretariat's official channel and the State Information
     Service (sis.gov.eg) for: the number itself, scope (psychological
     consultation + family counseling), 24/7 availability, and the
     confidentiality statement.
   - Do NOT add a "free" claim unless an official source states a cost.
   - It must remain presented ONLY as general psychological support — never
     as a CSBD / problematic-pornography-use treatment service.

2. **16023 — addiction-fund hotline (FDCTA)**
   - Check the fund's own site (drugcontrol.org.eg) and official channels
     for: the number, scope (substance-addiction treatment), 24/7, free
     treatment, confidentiality.
   - It stays ONLY in its separate, clearly-labeled substance-addiction
     context card — never inside the general find-a-specialist pathway and
     never presented as a CSBD/PPU service.

3. **123 / 122 — ambulance / police**
   - Re-confirm via an authoritative reference that 123 is medical
     emergency and 122 is police, and that they appear only in their
     emergency contexts.

4. **Ministry page link**
   - Fetch `https://www.mohp.gov.eg/SectorServices.aspx?Deptcode=4&SectorCode=2`
     and confirm it still renders the Secretariat's official page. If it
     moves, find the new official URL — never substitute a third-party
     directory link.

5. **Online platform status**
   - The platform host (mentalhealth.mohp.gov.eg) refused visitors with 401
     at verification time and is described as unavailable (not linked). If
     it becomes reachable again from an ordinary browser, update the note;
     only link it after confirming it actually serves users.

6. **The honest-absence statement**
   - Re-attempt to find an official Egyptian service specifically scoped to
     CSBD / problematic pornography use. If one is verifiably found, add it
     WITH its official source; until then the screen keeps saying none was
     found, and routes to a competent clinician.

## Watch items

- A third-party directory classifies 16328 differently from the official
  sources (e.g. broader "addiction hotline" framing). The official GSMHAT /
  SIS / WHO-EMRO description wins; document the conflict here rather than
  changing the claim.
- Hotline numbers occasionally change after ministry reorganizations. If a
  number stops matching any official source, prefer REMOVING the entry over
  keeping an unverifiable one (a missing card with an honest note beats a
  wrong number in a crisis).

## Record

| Date | Verified by | Lines checked | Sources | Changes made |
|------|-------------|---------------|---------|--------------|
| 2026-10-14 | (initial verification batch) | 16328, 16023, 123, 122, MoHP page, platform | GSMHAT channel, SIS, WHO EMRO, FDCTA site/channels, live fetches | Initial verified content; platform unlinked (401), MoHP page linked |
