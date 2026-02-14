import os
import json

REPO_ROOT = r"c:\develop\Django\Django_Master_Notes"
GITHUB_BASE = "https://github.com/Raviranjan010/Django_Learning/tree/main"
IGNORE_DIRS = {".git", ".github", "assets", "__pycache__"}
IGNORE_FILES = {".nojekyll", "index.html", "main.js", "generate_data.py", "reorganize.py", "README.md", "task.md", "implementation_plan.md", "walkthrough.md", "generate_structure.py"}

def get_difficulty(filename):
    lower = filename.lower()
    if "basics" in lower or "intro" in lower or "setup" in lower:
        return "beginner"
    if "advanced" in lower or "optimization" in lower or "security" in lower:
        return "advanced"
    return "intermediate"

def generate_structure():
    structure = []
    
    # Get all top-level directories and sort them
    dirs = [d for d in os.listdir(REPO_ROOT) if os.path.isdir(os.path.join(REPO_ROOT, d)) and d not in IGNORE_DIRS]
    dirs.sort()

    for d in dirs:
        dir_path = os.path.join(REPO_ROOT, d)
        
        # Base entry
        entry = {
            "id": d.lower().replace("_", "-"),
            "folder": d,
            "title": d.replace("_", " ").strip(),
            "description": f"Master the concepts of {d.replace('_', ' ')}",
            "icon": "folder",
            "github": f"{GITHUB_BASE}/{d}",
            "files": [],
            "subfolders": []
        }

        # Scan files and subfolders
        for item in sorted(os.listdir(dir_path)):
            item_path = os.path.join(dir_path, item)
            
            if os.path.isfile(item_path):
                if item.endswith(".md"):
                    entry["files"].append({
                        "name": item,
                        "difficulty": get_difficulty(item),
                        "topics": ["Django", d.split('_')[-1] if '_' in d else "General"]
                    })
            elif os.path.isdir(item_path):
                # Handle subfolders (like projects)
                entry["subfolders"].append({
                    "name": item,
                    "github": f"{GITHUB_BASE}/{d}/{item}"
                })
        
        # Only add if it has content
        if entry["files"] or entry["subfolders"]:
            structure.append(entry)

    # Print JSON
    print(json.dumps(structure, indent=4))

if __name__ == "__main__":
    generate_structure()
