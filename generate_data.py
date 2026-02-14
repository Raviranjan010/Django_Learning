import json
import os
import re

# Read the structure file
try:
    with open(r'c:\develop\Django\Django_Master_Notes\structure_ascii.txt', 'r') as f:
        lines = f.readlines()
except FileNotFoundError:
    print("const roadmapData = [];")
    exit()

structure = {}
# Adjust base URL to match user request "keep the link of github repo of particular topics set to default"
repo_base_url = "https://github.com/Raviranjan010/Python_Complete_notes/tree/main/" 

def format_title(name):
    # Remove leading numbers (e.g., "01_") and replace underscores with spaces
    name = re.sub(r'^\d+_', '', name)
    name = name.replace('_', ' ')
    # Remove extension
    name = os.path.splitext(name)[0]
    return name.title()

for line in lines:
    path = line.strip()
    if not path or path.startswith('index.html') or path.startswith('main.js') or path.startswith('roadmap-data.js') or path.endswith('.txt') or path.endswith('.py'):
        continue
    
    parts = path.split('\\')
    
    if len(parts) > 1:
        phase_folder = parts[0]
        file_name = parts[-1]
        
        # We only care about files as topics
        if '.' in file_name:
            if phase_folder not in structure:
                structure[phase_folder] = []
            
            structure[phase_folder].append({
                "path": path,
                "name": file_name
            })

roadmap_data = []
phase_id_counter = 1

sorted_phases = sorted(structure.keys())

for phase in sorted_phases:
    # Skip non-content folders if any
    if phase in ['index.html', 'main.js', 'roadmap-data.js', '.git', '.github']:
        continue
        
    topics = []
    files = structure[phase]
    
    # Sort files naturally
    files.sort(key=lambda x: x['name'])
    
    for file_info in files:
        topic_title = format_title(file_info['name'])
        # Generate a safe ID
        topic_id = re.sub(r'[^a-zA-Z0-9]', '-', topic_title.lower()) + '-' + str(phase_id_counter)
        
        # Determine difficulty based on keywords
        difficulty = "intermediate"
        lower_title = topic_title.lower()
        if any(x in lower_title for x in ['basic', 'intro', 'start', 'setup', 'install']):
            difficulty = "beginner"
        elif any(x in lower_title for x in ['advance', 'deploy', 'security', 'optimize', 'scal']):
            difficulty = "advanced"
        elif any(x in lower_title for x in ['expert', 'architect']):
            difficulty = "expert"

        # Determine icon based on keywords
        icon = "file-text"
        if "database" in lower_title or "model" in lower_title: icon = "database"
        elif "api" in lower_title or "rest" in lower_title: icon = "server"
        elif "authentication" in lower_title or "security" in lower_title: icon = "shield"
        elif "optimization" in lower_title: icon = "zap"
        elif "deploy" in lower_title: icon = "cloud"
        
        topics.append({
            "id": topic_id,
            "title": topic_title,
            "description": f"Detailed notes and examples for {topic_title}.", 
            "difficulty": difficulty,
            "githubUrl": repo_base_url + file_info['path'].replace('\\', '/'),
            "tags": ["Django", phase.split('_')[-1]],
            "icon": icon, 
            "estimatedTime": "45 mins"
        })
    
    if topics: 
        phase_title = format_title(phase)
        roadmap_data.append({
            "phase": phase_title, # Removed "Phase X:" prefix to be cleaner, UI can add it or not
            "description": f"Master the concepts of {phase_title}.",
            "icon": "folder", 
            "topics": topics
        })
        phase_id_counter += 1

print("const roadmapData = " + json.dumps(roadmap_data, indent=4) + ";")
