import re

with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# find all selector { ... } blocks
matches = re.finditer(r'([^{}]+)\{([^}]+)\}', css)
for m in matches:
    selector = m.group(1).strip()
    body = m.group(2).strip()
    if 'content:' in body:
        # find the content: property
        prop = re.search(r'content:\s*([^;]+)', body)
        if prop:
            content_val = prop.group(1).strip()
            if any(term in content_val for term in ['TRUCK', 'PACKAGE', 'Select', 'Plan', 'UNIT']):
                print(f"Selector: {selector} => {content_val}")
