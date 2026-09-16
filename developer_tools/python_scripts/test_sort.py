def sort_labs(labs):
    # Priority mapping for CWEs and names
    priority = {
        # Tier 1 - The absolute classics
        "CWE-89": 100, # SQLi
        "CWE-79": 99,  # XSS
        "SQL Injection": 100,
        "Cross-Site Scripting": 99,
        "XSS": 99,
        
        # Tier 2 - Very common OWASP Top 10
        "CWE-639": 95, # BOLA/IDOR
        "CWE-284": 95, # Improper Access Control
        "IDOR": 95,
        "BOLA": 95,
        "CWE-287": 94, # Broken Auth
        "Authentication": 94,
        "CWE-352": 93, # CSRF
        "CSRF": 93,
        
        # Tier 3 - Common structural issues
        "CWE-918": 90, # SSRF
        "SSRF": 90,
        "CWE-22": 89,  # Path Traversal
        "Traversal": 89,
        "LFI": 89,
        "CWE-434": 88, # File Upload
        "File Upload": 88,
        
        # Tier 4 - Well known but slightly less prevalent than top tiers
        "CWE-611": 85, # XXE
        "XXE": 85,
        "CWE-200": 84, # Info Exposure
        "CWE-74": 83,  # Injection
        "CWE-94": 83,  # Code Injection
        "CWE-78": 83,  # Command Injection
        "Command Injection": 83,
        "CWE-502": 80, # Deserialization
        "Deserialization": 80,
    }
    
    def get_score(lab):
        score = 0
        name = lab.get("name", "")
        cwes = lab.get("cwe", [])
        
        # Check CWEs
        for c in cwes:
            if c in priority:
                score = max(score, priority[c])
                
        # Check Name
        for kw, p_score in priority.items():
            if kw.lower() in name.lower():
                score = max(score, p_score)
                
        # Sub-sort by name length (simpler names usually mean fundamental concepts) or alphabetical to keep it stable
        return (-score, name)

    return sorted(labs, key=get_score)

test_labs = [
    {"name": "Obscure JWT timing attack", "cwe": ["CWE-208"]},
    {"name": "Cross-Site Scripting (XSS) in Search", "cwe": ["CWE-79"]},
    {"name": "SQL Injection in Login", "cwe": ["CWE-89"]},
    {"name": "IDOR on user profiles", "cwe": ["CWE-639"]},
    {"name": "CSRF on email change", "cwe": ["CWE-352"]}
]

for l in sort_labs(test_labs):
    print(l["name"])
