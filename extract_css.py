import os
import re

files_to_process = [
    r"d:\next js projects\KB_RAG_Platform_v2\frontend\app\components\landing\LandingPage.jsx",
    r"d:\next js projects\KB_RAG_Platform_v2\frontend\app\profile\page.jsx",
    r"d:\next js projects\KB_RAG_Platform_v2\frontend\app\integrations\page.jsx",
    r"d:\next js projects\KB_RAG_Platform_v2\frontend\app\chat\page.jsx",
    r"d:\next js projects\KB_RAG_Platform_v2\frontend\app\components\layout\Footer.jsx",
    r"d:\next js projects\KB_RAG_Platform_v2\frontend\app\admin\chat\page.jsx"
]

for file_path in files_to_process:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = re.compile(r'<style\s+jsx[^>]*>\{`([\s\S]*?)`\}</style>', re.MULTILINE)
    
    matches = list(pattern.finditer(content))
    if not matches:
        continue
        
    css_content = ""
    for match in matches:
        css_content += match.group(1).strip() + "\n\n"
        
    base_name = os.path.basename(file_path)
    dir_name = os.path.dirname(file_path)
    name_without_ext = os.path.splitext(base_name)[0]
    
    if name_without_ext == "page":
        # e.g., "profile" from "app/profile/page.jsx"
        css_filename = os.path.basename(dir_name) + ".css"
    else:
        css_filename = name_without_ext + ".css"
        
    css_filepath = os.path.join(dir_name, css_filename)
    
    with open(css_filepath, 'w', encoding='utf-8') as f:
        f.write(css_content)
        
    new_content = re.sub(r'\s*<style\s+jsx[^>]*>\{`[\s\S]*?`\}</style>', '', content)
    
    import_stmt = f'import "./{css_filename}";\n'
    
    # Insert import after the last import statement, or at the top after "use client"
    lines = new_content.split('\n')
    insert_idx = 0
    for i, line in enumerate(lines):
        if line.startswith('import '):
            insert_idx = i + 1
            
    if insert_idx == 0:
        if lines and (lines[0].startswith('"use client"') or lines[0].startswith("'use client'")):
            insert_idx = 1
            
    lines.insert(insert_idx, import_stmt)
    new_content = '\n'.join(lines)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Processed {file_path} -> created {css_filename}")
