---
title: Your documents
description: Import your own notes, manuals and data into BOAR's offline library as .txt, .md, .csv, .json or .pdf files, switch collections on and off, and share them as portable packs.
section: Your knowledge
order: 20
---

Import your own notes, manuals and data, and BOAR searches them alongside its library, on the phone. Nothing is uploaded anywhere.

## Import a file

Settings → Knowledge Base → **Import**. Pick a file and give the collection a name.

| Format | What BOAR reads |
|---|---|
| `.txt`, `.md` | the text |
| `.csv` | the rows, split on commas (quoted fields with commas inside aren't handled) |
| `.json` | BOAR's own pack shape, a list of `{title, source, body}`; any other JSON is read as plain text |
| `.pdf` | the text you could select in the PDF, extracted on the phone |

> [!NOTE]
> PDFs are read without OCR, so a scanned, image-only PDF comes out empty. Password-protected PDFs are refused with a clear message.

## What happens to it

BOAR splits the text into passages of about 500 tokens with a little overlap, embeds each one on the phone with the same model it uses for the rest of the library, and saves them as a named collection. From the next question on, answers can draw on it, and cite it as a source.

## Collections

- **Switch one off** to leave it out of answers without deleting it.
- **Delete one** to remove it completely.

## Share a collection

**Export** saves a collection as a plain JSON pack, the same `{title, source, body}` shape as BOAR's own packs, and opens Android's share sheet: Bluetooth, Nearby Share, a file manager, whatever the phone offers.

The person you send it to imports it the same way, and their phone rebuilds it locally. It deliberately doesn't export the phone's search index: that would carry this phone's embeddings, which wouldn't match a phone running a different embedding model.

## Tips

- **Short, titled sections work best.** Search finds passages, so a manual with clear headings answers better than one long block.
- **Keep one subject per collection.** It's easier to switch a trip's notes off when you're home.
- **The library is English-first.** Search uses an English embedding model, so documents in other languages are found mostly by keyword.
