path = "src/components/SecurePoCUploader.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the text the user wants removed
text_to_remove = """<p className="text-xs text-gray-400 font-mono text-center max-w-sm">
              Drag & drop your exploit proof here.<br/>
              Max 2MB. Strict AI Validation enforced.
            </p>"""
            
new_text = """<p className="text-xs text-gray-500 font-mono mt-2">
              (Click or drag file here)
            </p>"""

content = content.replace(text_to_remove, new_text)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Removed the explicit 2MB limit text from UI.")
