# Manual screen-reader / keyboard verification checklist

Automated checks cover keyboard reachability, focus semantics, and contract
level (the regression suites pin dialog roles, `aria-expanded` wiring,
`data-autofocus` placement, and `role="status"` announcements). Physical
assistive-technology testing requires a real device — **it has NOT been
performed in the sandbox environment** and must not be claimed as done.
This is the procedure for a human to run it.

Recommended setup: Android + TalkBack (Arabic TTS voice) and/or iOS +
VoiceOver, in Arabic, at 100% and 150% in-app text size.

## Emergency protocol (وضع الطوارئ) — highest priority

- [ ] Launching the overlay announces the step title (each step remount is
      an alertdialog; the primary action is focused via `data-autofocus`).
- [ ] Tab / swipe order stays inside the overlay; background is inert.
- [ ] The countdown's pause/resume/restart buttons have Arabic labels.
- [ ] **When the countdown completes, the calm next-action message is
      announced** (`role="status"` / `aria-live="polite"`), and nothing
      claims success or safety.
- [ ] The honest exit («خروج من وضع الطوارئ») is reachable and announced;
      exiting never reads as an outcome.
- [ ] At level 5 the single dominant instruction is announced first.

## Onboarding

- [ ] All wizard steps: option groups are announced as multi-select with
      their Arabic labels; selected state is announced.
- [ ] The sticky «السابق/التالي» footer is the last tab stop of each step;
      «التالي» is disabled-until-valid and its state is announced.
- [ ] After advancing, focus lands on the new step's heading (the scroll
      reset starts the step at the top).

## Forms (urge check, evening check-in, relapse log, values)

- [ ] The four evening condition scales each announce THEIR OWN question
      (sleep asks about sleep; stress about stress; loneliness about
      loneliness; free time about free time) with 1–5 values and endpoints.
- [ ] The 1–5 rating rows are radiogroups with per-value Arabic labels.
- [ ] Textareas have visible labels near them and no placeholder-as-label.

## More sheet (كل الأقسام)

- [ ] Opens as a dialog/sheet with its title; Escape and the X button
      announce closure; focus returns to the «المزيد» tab.

## Export / reset dialogs (Settings)

- [ ] The pre-export warning reads out the unencrypted-file warning and the
      content list BEFORE any download starts; «رجوع» cancels cleanly.
- [ ] The erase confirmation enumerates what is deleted and what remains
      (theme + text size); on storage failure the honest failure banner is
      announced (`role="alert"`).
- [ ] The rule-deletion confirmation in خطة الوقاية names the exact rule
      before deletion.

## Specialist help (المساعدة المتخصصة)

- [ ] The urgent card is the first content after the header.
- [ ] Phone CTAs are links with the number in their accessible name.
- [ ] The three secondary disclosures announce expanded/collapsed state
      (`aria-expanded`) and their chevrons are reachable by keyboard.
- [ ] The platform-unavailability note and verified Ministry link read
      naturally (no raw error codes).
