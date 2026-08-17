---
name: pm
description: >-
  Ask Moji's PM (product strategist) a question. Invoke as /pm <question>.
  Use for roadmap, gaps, opportunities, competitive references, or what to
  build next.
disable-model-invocation: true
---

# /pm — ask the Moji PM

Treat the text after `/pm` as the user's question to the product strategist.

**Question:** $ARGUMENTS

If `$ARGUMENTS` is empty or unsubstituted, use the rest of the user message after `/pm` as the question. If there is still no question, ask one clarifying question and stop.

## What to do

1. Delegate to the **pm** subagent (`.cursor/agents/pm.md`) with that question as the full task.
2. Do not answer as a generic coding agent first — the PM owns the reply.
3. Pass through any scope the user gave (e.g. only editor, only Premium, competitive scan).
4. Return the PM's answer to the user without rewriting their priorities; you may lightly tighten formatting.

## Examples

```
/pm what's missing in the core loop?
/pm compare our editor to Fixdate for host self-serve
/pm what should we tackle next for RSVP?
```
