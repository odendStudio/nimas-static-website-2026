import os
import re

def inject_analytics():
    ga_id = "G-BTQ1Y0D03Z"
    
    # Google Analytics tracking code block
    ga_code = f"""<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id={ga_id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());

  gtag('config', '{ga_id}');
</script>
"""

    # We run from the root of the checked-out repo
    directory = "."
    modified_count = 0
    skipped_count = 0

    for root, dirs, files in os.walk(directory):
        # Exclude hidden directories
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()

                # Skip if already has GA ID
                if ga_id in content or "googletagmanager.com/gtag/js" in content:
                    skipped_count += 1
                    continue

                # Find the <head> tag
                head_match = re.search(r'(<head\b[^>]*>)', content, re.IGNORECASE)
                if head_match:
                    head_tag = head_match.group(1)
                    new_content = content.replace(head_tag, f"{head_tag}\n{ga_code}", 1)
                    
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    
                    print(f"Successfully injected GA into: {os.path.relpath(file_path, directory)}")
                    modified_count += 1
                else:
                    skipped_count += 1

    print(f"Injection complete: {modified_count} files updated, {skipped_count} files skipped.")

if __name__ == "__main__":
    inject_analytics()
