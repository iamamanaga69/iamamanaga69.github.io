import os
import re

root_dir = r"c:\Users\Agarw\Documents\Codex\2026-06-01\flexist-crypto-complete-website-build-prompt"

# Define the mappings for archived pages to active clean URL paths
archived_mappings = {
    "community.html": "services#community",
    "influencers.html": "services#kol",
    "ambassadors.html": "services#ambassadors",
    "partnerships.html": "services#partnerships",
    "testimonials.html": "about",
    "case-studies.html": "experience",
    "projects.html": "experience",
    "media-kit.html": "about",
    "founder.html": "about",
    "blog.html": "about",
    "india-hub.html": "flexistlabs"
}

# Define the active root clean URLs
root_clean_routes = [
    "about", "contact", "experience", "services", "flexistlabs", "inquiry", "index"
]

# Pattern to find href attribute values
pattern = re.compile(r'href=(["\'])([^"\']+)\1')

def clean_links_in_file(file_path):
    rel_path = os.path.relpath(file_path, root_dir)
    # Check folder depth
    depth = len(rel_path.split(os.sep)) - 1
    prefix = "../" * depth
    current_dir = os.path.dirname(rel_path).replace(os.sep, "/")

    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    modified = False

    def replacer(match):
        nonlocal modified
        quote = match.group(1)
        url = match.group(2)

        # Ignore external links, mailto, tel, anchor-only
        if (url.startswith("http") or 
            url.startswith("mailto:") or 
            url.startswith("tel:") or 
            url.startswith("#") or 
            url.startswith("javascript:") or
            url == "./" or 
            url == "../"):
            return match.group(0)

        # Separate query and fragment
        target_url = url
        fragment = ""
        query = ""
        
        if "#" in target_url:
            target_url, frag_part = target_url.split("#", 1)
            fragment = "#" + frag_part
            
        if "?" in target_url:
            target_url, query_part = target_url.split("?", 1)
            query = "?" + query_part

        # Normalize prefix
        url_prefix = ""
        if target_url.startswith("../"):
            url_prefix = "../"
            target_url = target_url[3:]
        elif target_url.startswith("./"):
            target_url = target_url[2:]

        # Get absolute path from root for resolution
        if url_prefix == "../":
            # Go up one folder from current_dir
            if "/" in current_dir:
                parent_dir = current_dir.rsplit("/", 1)[0]
                resolved_path = f"{parent_dir}/{target_url}" if parent_dir else target_url
            else:
                resolved_path = target_url
        elif depth > 0 and not target_url.startswith("/"):
            # Resolve relative to current_dir
            resolved_path = f"{current_dir}/{target_url}"
        else:
            resolved_path = target_url

        # Check mapping
        # Extract filename only from resolved path to check archived mapping
        filename = resolved_path.split("/")[-1]
        if filename in archived_mappings:
            target = archived_mappings[filename]
            if depth > 0:
                target = prefix + target
            modified = True
            return f'href={quote}{target}{query}{fragment}{quote}'

        # Check root clean pages
        for route in root_clean_routes:
            if resolved_path == f"{route}.html":
                new_base = route if route != "index" else ""
                new_url = prefix + new_base + query + fragment
                if not new_url:
                    new_url = "./" if depth == 0 else "../"
                modified = True
                return f'href={quote}{new_url}{quote}'

        # Check plans/index.html
        if resolved_path == "plans/index.html":
            new_url = prefix + "plans/" + query + fragment
            modified = True
            return f'href={quote}{new_url}{quote}'

        # Check payment/index.html
        if resolved_path == "payment/index.html":
            new_url = prefix + "payment/" + query + fragment
            modified = True
            return f'href={quote}{new_url}{quote}'

        # Check other plans files
        if resolved_path.startswith("plans/") and resolved_path.endswith(".html"):
            new_url = prefix + resolved_path[:-5] + query + fragment
            modified = True
            return f'href={quote}{new_url}{quote}'

        # Check onboarding files
        if resolved_path.startswith("onboarding/") and resolved_path.endswith(".html"):
            new_url = prefix + resolved_path[:-5] + query + fragment
            modified = True
            return f'href={quote}{new_url}{quote}'

        return match.group(0)

    new_content = pattern.sub(replacer, content)

    if modified:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Cleaned links in: {rel_path}")

for dirpath, _, filenames in os.walk(root_dir):
    if ".git" in dirpath or ".gemini" in dirpath or "scratch" in dirpath or "archive" in dirpath:
        continue
    for filename in filenames:
        if filename.endswith(".html"):
            clean_links_in_file(os.path.join(dirpath, filename))
