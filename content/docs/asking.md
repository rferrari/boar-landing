---
title: Ask and check
description: How BOAR answers a question offline, what the sources under each answer mean, when to trust an answer, and how Deep Research, conversations and voice work.
section: Using BOAR
order: 10
---

You ask; BOAR looks in its library on the phone, hands the best passages to the model on the phone, and the model writes the answer. Nothing goes to a server.

## What happens when you ask

1. **BOAR searches its library.** It looks for passages by keyword and by meaning, in the built-in library, any [knowledge packs](knowledge-packs.md) and any [documents you imported](your-documents.md). For greetings, arithmetic, translation and code it skips this step.
2. **The model writes the answer** from those passages and what it already knows, word by word.
3. **The sources appear under the answer**: the articles it used, with how closely each matched your question.

The first word usually takes a few seconds, because the model reads the passages before it starts writing. With the default model on our test phone, a whole answer took about 10–21 seconds.

## Reading the sources

Each source is an article from the library, with a link back to where it came from (for Wikipedia articles, the Wikipedia page, which you can open once you're back online).

- **A source that matches the answer** is a good sign. Read it when the answer matters.
- **No sources** means the answer came from the model alone. That's expected for arithmetic ("worked out on the phone, no source needed"), and a reason for more care on facts.
- **A source that doesn't fit** means the search pulled in something unrelated. The answer may still be fine, but check it.

> [!WARNING]
> Small models make mistakes, and they can misread a source or invent a citation. BOAR shows its sources so you can check it. For anything serious, it's a companion, not a doctor or a rescue service. Get help as soon as you can reach it.

## Getting better answers

- **Ask one thing at a time.** "What are the signs of hypothermia?" works better than a paragraph of questions.
- **Use the words the topic uses.** The library is searched by keyword too, so "photosynthesis" finds more than "how plants eat light".
- **Follow up.** BOAR remembers the conversation. "Why?" or "Interesting, continue" picks up where it left off.
- **Try Prompt Ideas** from the menu for questions that show what it can do.
- **Switch models for hard questions.** The default is quick; others think harder and take longer. See [Models](models.md).

## Deep Research mode

Settings has a **Deep Research** toggle. It splits your question into two or three smaller ones, answers each from the library, then writes one answer from those. It's the same model playing each role in turn, not several AIs at once, so it takes noticeably longer than a normal answer.

## Conversations

Conversations are kept on the phone, in the menu under recent chats, with automatic titles. Delete one from the list. In long conversations, BOAR condenses older turns into a short summary and keeps the most recent ones word for word (how many is set in Settings), so it stays quick.

## Voice

The microphone button uses Android's own speech recognizer, asking it to work offline. Whether that works without a connection depends on your phone's speech service. Most phones have one; GrapheneOS and other de-Googled phones usually don't, and BOAR says so rather than pretending to listen. Typing always works.

## The numbers under each answer

Every answer records which model ran, how long until the first word, how fast it wrote (tokens a second) and how much memory it used. Find them in the menu under **Execution Telemetry**, and export them as JSON or CSV. See [Results](results.md) for what they look like across models.
