import json
import os
import re

# Configuration
REPO_BASE_URL = "https://github.com/Raviranjan010/Django_Learning/blob/main/"
REPO_TREE_URL = "https://github.com/Raviranjan010/Django_Learning/tree/main/"
ROOT_DIR = r"c:\develop\Django\Django_Master_Notes"
EXCLUDE_DIRS = {'.git', '.github', '.vscode', '__pycache__', 'node_modules', '.gemini', '.agent'}
EXCLUDE_FILES = {'index.html', 'main.js', 'roadmap-data.js', 'generate_data.py', 'reorganize.py', 'structure_ascii.txt', 'README.md', '.nojekyll', 'LICENSE', 'task.md', 'implementation_plan.md', 'walkthrough.md'}

def format_title(name):
    # Remove leading numbers (e.g., "01_")
    name = re.sub(r'^\d+_', '', name)
    # Replace underscores with spaces
    name = name.replace('_', ' ')
    # Remove extension
    name = os.path.splitext(name)[0]
    # Special overrides
    if name.lower() == "orm": return "ORM"
    if name.lower() == "url routing": return "URL Routing"
    if name.lower() == "api": return "API"
    if name.lower() == "rest api": return "REST API"
    if name.lower() == "devops": return "DevOps"
    return name.title()

def get_difficulty_and_icon(title, content=""):
    lower_title = title.lower()
    
    # Difficulty
    difficulty = "intermediate"
    if any(x in lower_title for x in ['basic', 'intro', 'start', 'setup', 'install', 'prerequisite', 'fundamental']):
        difficulty = "beginner"
    elif any(x in lower_title for x in ['advance', 'deploy', 'security', 'optimize', 'scal', 'performance', 'complex', 'mastery']):
        difficulty = "advanced"
    elif any(x in lower_title for x in ['expert', 'architect', 'internal']):
        difficulty = "expert"

    # Icon
    icon = "file-text"
    if "database" in lower_title or "model" in lower_title or "orm" in lower_title: icon = "database"
    elif "api" in lower_title or "rest" in lower_title: icon = "server"
    elif "auth" in lower_title or "security" in lower_title or "login" in lower_title: icon = "shield"
    elif "optimization" in lower_title or "performance" in lower_title: icon = "zap"
    elif "deploy" in lower_title or "docker" in lower_title: icon = "cloud"
    elif "view" in lower_title or "template" in lower_title: icon = "layout"
    elif "form" in lower_title: icon = "edit-3"
    elif "test" in lower_title: icon = "check-circle"
    elif "admin" in lower_title: icon = "settings"
    elif "signal" in lower_title: icon = "radio"
    elif "middleware" in lower_title: icon = "layers"
    
    return difficulty, icon

def generate_roadmap_data():
    roadmap_data = []
    
    try:
        items = os.listdir(ROOT_DIR)
    except FileNotFoundError:
        print(f"Error: Directory not found: {ROOT_DIR}")
        return

    phase_dirs = []
    for item in items:
        item_path = os.path.join(ROOT_DIR, item)
        if os.path.isdir(item_path) and item not in EXCLUDE_DIRS and not item.startswith('.'):
            phase_dirs.append(item)
    
    phase_dirs.sort()

    for phase_dir in phase_dirs:
        phase_path = os.path.join(ROOT_DIR, phase_dir)
        
        # Phase URL (folder)
        phase_folder_url = f"{REPO_TREE_URL}{phase_dir}".replace("\\", "/")

        topics = []
        try:
            files = os.listdir(phase_path)
            files.sort()
        except OSError:
            continue

        for file_name in files:
            file_path = os.path.join(phase_path, file_name)
            
            if os.path.isdir(file_path):
                continue
                
            if file_name in EXCLUDE_FILES or file_name.endswith('.pyc') or file_name.startswith('.'):
                continue

            # Process file
            topic_title = format_title(file_name)
            difficulty, icon = get_difficulty_and_icon(topic_title)
            
            # File URL (blob)
            rel_path = f"{phase_dir}/{file_name}".replace("\\", "/")
            github_url = f"{REPO_BASE_URL}{rel_path}"
            
            safe_id = re.sub(r'[^a-zA-Z0-9]', '-', f"{phase_dir}-{file_name}").lower()

            topics.append({
                "id": safe_id,
                "title": topic_title,
                "description": f"Detailed notes on {topic_title}.", 
                "difficulty": difficulty,
                "githubUrl": github_url,
                "folderUrl": phase_folder_url, 
                "tags": ["Django", phase_dir.split('_')[-1]],
                "icon": icon,
                "estimatedTime": "30 mins"
            })

        if topics:
            phase_title = format_title(phase_dir)
            
            roadmap_data.append({
                "phase": phase_title,
                "description": f"Master the concepts of {phase_title}.",
                "icon": "folder", 
                "folderUrl": phase_folder_url,
                "topics": topics
            })

    js_content = f"const roadmapData = {json.dumps(roadmap_data, indent=4)};"
    
    output_path = os.path.join(ROOT_DIR, 'roadmap-data.js')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"Successfully generated roadmap-data.js with {len(roadmap_data)} phases.")

if __name__ == "__main__":
    generate_roadmap_data()
