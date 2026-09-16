path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# 1. Add showSuccess state
content = content.replace("const [solved, setSolved] = useState(alreadySolved);", "const [solved, setSolved] = useState(alreadySolved);\n  const [showSuccess, setShowSuccess] = useState(false);")

# 2. Update handleSubmitFlag to set showSuccess
content = content.replace("setSolved(true);", "setSolved(true);\n              setShowSuccess(true);\n              setActive(false);")

# 3. Update the overlay conditions
# Old button condition: {!active && !solved && !failed && (
# New button condition: {!active && !failed && !showSuccess && (
content = content.replace("{!active && !solved && !failed && (", "{!active && !failed && !showSuccess && (")

# Old solved overlay condition: {solved && (
# New solved overlay condition: {showSuccess && (
content = content.replace("{solved && (", "{showSuccess && (")

# 4. Update the blur condition
# Old blur condition: ${!active && !solved && !failed ? 'opacity-10 blur-xl pointer-events-none select-none' : ''}
# New blur condition: ${!active ? 'opacity-10 blur-xl pointer-events-none select-none' : ''}
content = content.replace("${!active && !solved && !failed ? 'opacity-10 blur-xl pointer-events-none select-none' : ''}", "${!active ? 'opacity-10 blur-xl pointer-events-none select-none' : ''}")

# 5. Add a "Close" button to the success and failure overlays so they aren't permanently stuck
success_block = """<p className="text-gray-400 text-sm mb-6">Lab completed successfully. You can safely exit.</p>
                 <button onClick={() => setShowSuccess(false)} className="px-6 py-2 rounded-xl bg-green-500/20 text-green-400 font-bold hover:bg-green-500/30 transition-colors">Close</button>"""
content = re.sub(r'<p className="text-gray-400 text-sm">Lab completed successfully. You can safely exit.</p>', success_block, content)

fail_block = """<p className="text-gray-400 text-sm mb-6">Time expired before PoC was verified. System locked.</p>
                 <button onClick={() => setFailed(false)} className="px-6 py-2 rounded-xl bg-red-500/20 text-red-400 font-bold hover:bg-red-500/30 transition-colors">Acknowledge</button>"""
content = re.sub(r'<p className="text-gray-400 text-sm">Time expired before PoC was verified. System locked.</p>', fail_block, content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated overlay logic")
