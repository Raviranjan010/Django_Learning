import os
import shutil

ROOT_DIR = r"c:\develop\Django\Django_Master_Notes"

# Map DESTINATION -> [SOURCES]
# We merge multiple sources into one destination
STRUCTURE_MAP = {
    "01_Python_Fundamentals": ["00_Prerequisites"],
    "02_Django_Setup_Config": ["01_Introduction", "02_Project_Structure", "03_Apps"],
    "03_Models_Database": ["04_Models", "04_ORM", "10_Database"],
    "04_Views_URL_Routing": ["05_Views"],
    "05_Templates_Frontend": ["06_Templates"],
    "06_Forms_Validation": ["07_Forms"],
    "07_Authentication_Security": ["09_Authentication", "14_Security", "08_Admin"],
    "08_REST_API_Development": ["11_Django_REST_Framework"],
    "09_Testing_Quality": ["15_Testing"],
    "10_Performance_Caching": ["14_Performance", "17_Performance_Optimization", "12_Middleware"],
    "11_Deployment_DevOps": ["15_Deployment", "16_Deployment"],
    "12_Advanced_Patterns": ["13_Signals", "18_Advanced_Topics"],
    "13_Django_Mastery": ["19_Real_Projects"]
}

def reorganize():
    for dest_name, sources in STRUCTURE_MAP.items():
        dest_path = os.path.join(ROOT_DIR, dest_name)
        
        # Create destination if it doesn't exist
        if not os.path.exists(dest_path):
            os.makedirs(dest_path)
            print(f"Created: {dest_name}")

        for source_name in sources:
            source_path = os.path.join(ROOT_DIR, source_name)
            
            if os.path.exists(source_path):
                print(f"Moving content from {source_name} to {dest_name}...")
                
                # Move all files/folders from source to dest
                items = os.listdir(source_path)
                for item in items:
                    s = os.path.join(source_path, item)
                    d = os.path.join(dest_path, item)
                    
                    # Handle renaming if collision exists (e.g. 01_Intro.md in both?)
                    # Unlikely based on file names seen, but safety first
                    if os.path.exists(d):
                        base, ext = os.path.splitext(item)
                        d = os.path.join(dest_path, f"{base}_{source_name.split('_')[0]}{ext}")
                    
                    try:
                        shutil.move(s, d)
                    except Exception as e:
                        print(f"Error moving {s}: {e}")
                
                # Remove empty source directory
                try:
                    os.rmdir(source_path)
                    print(f"Removed empty source: {source_name}")
                except OSError:
                    print(f"Could not remove {source_name}, it might not be empty.")

if __name__ == "__main__":
    reorganize()
