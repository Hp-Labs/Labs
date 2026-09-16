path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re
content = re.sub(
    r'import \{([^}]+)\} from "lucide-react";',
    r'import {\1, Sword, Microscope, ClipboardCheck, Radar, Cpu, ExternalLink} from "lucide-react";',
    content
)

# wait, what if it's single quotes?
content = re.sub(
    r"import \{([^}]+)\} from 'lucide-react';",
    r"import {\1, Sword, Microscope, ClipboardCheck, Radar, Cpu, ExternalLink} from 'lucide-react';",
    content
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed missing lucide icons")
