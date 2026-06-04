import os
import re

root_dir = r"c:\Users\Agarw\Documents\Codex\2026-06-01\flexist-crypto-complete-website-build-prompt"

clean_routes = [
    "inquiry", "contact", "experience", "services", "about", "founder", 
    "blog", "flexistlabs", "ambassadors", "community", "partnerships", 
    "case-studies", "projects", "testimonials", "influencers"
]

pattern = re.compile(r'href=(["\'])([^"\']+)\1')

def replace_links_in_file(file_path):
    rel_path = os.path.relpath(file_path, root_dir)
    is_in_services = rel_path.startswith("services" + os.sep)
    is_in_onboarding = rel_path.startswith("onboarding" + os.sep)
    is_in_plans = rel_path.startswith("plans" + os.sep)
    is_in_payment = rel_path.startswith("payment" + os.sep)

    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    modified = False

    def replacer(match):
        nonlocal modified
        quote = match.group(1)
        url = match.group(2)

        # Handle inquiry path in services directory
        if is_in_services:
            if url.startswith("/inquiry/index.html"):
                new_url = url.replace("/inquiry/index.html", "../inquiry.html")
                modified = True
                return f'href={quote}{new_url}{quote}'
            if url.startswith("inquiry"):
                new_url = url.replace("inquiry", "../inquiry.html")
                modified = True
                return f'href={quote}{new_url}{quote}'

        # Check if URL starts with ../
        prefix = ""
        target_url = url
        if url.startswith("../"):
            prefix = "../"
            target_url = url[3:]

        # Split on hash
        parts = target_url.split("#", 1)
        route = parts[0]
        fragment = "#" + parts[1] if len(parts) > 1 else ""

        if route in clean_routes:
            new_url = prefix + route + ".html" + fragment
            modified = True
            return f'href={quote}{new_url}{quote}'

        return match.group(0)

    new_content = pattern.sub(replacer, content)

    if modified:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Fixed links in: {rel_path}")

for dirpath, _, filenames in os.walk(root_dir):
    if ".git" in dirpath or ".gemini" in dirpath or "scratch" in dirpath:
        continue
    for filename in filenames:
        if filename.endswith(".html"):
            replace_links_in_file(os.path.join(dirpath, filename))
