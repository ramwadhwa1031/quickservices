import re

with open(r'c:\xampp\htdocs\www\QuickService\index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update CSS
css_target = ".svc-card-3d { background: #FFF; border-radius: 24px; padding: 40px; box-shadow: var(--shadow-card); position: relative; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); text-decoration: none; color: inherit; display: block; border: 1px solid rgba(0,0,0,0.03); overflow:hidden; }"
css_replacement = """.svc-card-3d { background: #FFF; border-radius: 24px; box-shadow: var(--shadow-card); position: relative; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); text-decoration: none; color: inherit; display: flex; flex-direction: column; border: 1px solid rgba(0,0,0,0.03); overflow:hidden; }
        .svc-img-wrap { width: 100%; height: 240px; overflow: hidden; position: relative; }
        .svc-img { width: 100%; height: 100%; object-fit: cover; transition: 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .svc-card-3d:hover .svc-img { transform: scale(1.08); }
        .svc-body-3d { padding: 45px 35px 35px; position: relative; flex-grow: 1; }"""
text = text.replace(css_target, css_replacement)

icon_target = ".svc-icon-3d { width: 85px; height: 85px; background: var(--c-warm-bg); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; color: var(--c-brand); margin-bottom: 30px; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border: 1px solid rgba(255,87,34,0.1);}"
icon_replacement = ".svc-icon-3d { position: absolute; right: 35px; top: -42px; width: 85px; height: 85px; background: var(--c-warm-bg); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; color: var(--c-brand); transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border: 4px solid #FFF; box-shadow: 0 10px 20px rgba(0,0,0,0.05); z-index: 5;}"
text = text.replace(icon_target, icon_replacement)

# HTML Regex Replacements
replacements = [
    (r'<a href="service-chimney\.html"([^>]*)>\s*<div class="svc-icon-3d">', r'<a href="service-chimney.html"\1>\n                    <div class="svc-img-wrap"><img src="assets/chimney_indian_1774159192970.png" class="svc-img" alt="Kitchen Chimney Repair"></div>\n                    <div class="svc-body-3d">\n                        <div class="svc-icon-3d">'),
    (r'<a href="service-hob\.html"([^>]*)>\s*<div class="svc-icon-3d">', r'<a href="service-hob.html"\1>\n                    <div class="svc-img-wrap"><img src="assets/stove_indian_1774159214973.png" class="svc-img" alt="Hob Repair"></div>\n                    <div class="svc-body-3d">\n                        <div class="svc-icon-3d">'),
    (r'<a href="service-microwave\.html"([^>]*)>\s*<div class="svc-icon-3d">', r'<a href="service-microwave.html"\1>\n                    <div class="svc-img-wrap"><img src="assets/microwave_indian_1774159242700.png" class="svc-img" alt="Microwave Repair"></div>\n                    <div class="svc-body-3d">\n                        <div class="svc-icon-3d">'),
    (r'<a href="service-ro\.html"([^>]*)>\s*<div class="svc-icon-3d">', r'<a href="service-ro.html"\1>\n                    <div class="svc-img-wrap"><img src="assets/ro_indian_1774159259432.png" class="svc-img" alt="RO Repair"></div>\n                    <div class="svc-body-3d">\n                        <div class="svc-icon-3d">'),
    (r'<a href="service-dishwasher\.html"([^>]*)>\s*<div class="svc-icon-3d">', r'<a href="service-dishwasher.html"\1>\n                    <div class="svc-img-wrap"><img src="assets/dishwasher_indian_1774159277516.png" class="svc-img" alt="Dishwasher Repair"></div>\n                    <div class="svc-body-3d">\n                        <div class="svc-icon-3d">')
]

for pat, repl in replacements:
    text = re.sub(pat, repl, text)

# Close the new svc-body-3d div
text = re.sub(r'(<div class="svc-arrow"><i class="fas fa-arrow-right"></i></div>\s*)</a>', r'\1</div>\n                </a>', text)

with open(r'c:\xampp\htdocs\www\QuickService\index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Images successfully added to matrix grid.")
