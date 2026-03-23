with open("c:\\xampp\\htdocs\\www\\QuickService\\index.html", "r", encoding="utf-8") as f:
    text = f.read()

# Replace light grey text with high-contrast slate-900 and color the separating diamonds in brand orange
target = ".marquee-item { font-size: 1.6rem; font-weight: 900; color: #cbd5e1; text-transform: uppercase; letter-spacing: 3px; }"
replacement = ".marquee-item { font-size: 1.6rem; font-weight: 900; color: #1e293b; text-transform: uppercase; letter-spacing: 3px; }\n        .marquee-item:nth-child(even) { color: var(--c-brand); font-size: 1.2rem; }"

if target in text:
    text = text.replace(target, replacement)
    with open("c:\\xampp\\htdocs\\www\\QuickService\\index.html", "w", encoding="utf-8") as f:
        f.write(text)
    print("Fixed marquee contrast.")
else:
    print("Target string not found in file.")
