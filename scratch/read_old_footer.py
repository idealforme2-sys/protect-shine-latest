import subprocess

def get_old_styles():
    # Run git show to get styles.css content at 0ca5f96
    content = subprocess.check_output(["git", "show", "0ca5f96:styles.css"], text=True)
    lines = content.splitlines()
    
    # Let's search for footer lines
    footer_lines = []
    in_footer_section = False
    for i, line in enumerate(lines):
        if ".site-footer" in line or "footer-" in line:
            print(f"L{i+1}: {line}")

if __name__ == "__main__":
    get_old_styles()
