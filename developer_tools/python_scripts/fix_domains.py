path = "src/app/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update imports
import re
content = re.sub(
    r'import \{([^}]+)\} from "lucide-react";',
    r'import {\1, Sword, Shield, Microscope, ClipboardCheck, Radar, Cloud, Cpu, ExternalLink} from "lucide-react";',
    content
)

# 2. Update the domains array icons and add Hardware Hacking
old_domains = """              {
                id: 'red-team', icon: '', name: 'Red Team',
                modules: [
                  {
                    id: 'pentesting', icon: '', name: 'Pentesting',"""

new_domains = """              {
                id: 'red-team', icon: <Sword className="text-red-500" size={24} />, name: 'Red Team',
                modules: [
                  {
                    id: 'pentesting', icon: '', name: 'Pentesting',"""

content = content.replace(old_domains, new_domains)

content = content.replace(
    "id: 'blue-team', icon: '', name: 'Blue Team',",
    "id: 'blue-team', icon: <Shield className=\"text-blue-500\" size={24} />, name: 'Blue Team',"
)

content = content.replace(
    "id: 'forensics', icon: '', name: 'Forensics & DFIR',",
    "id: 'forensics', icon: <Microscope className=\"text-purple-500\" size={24} />, name: 'Forensics & DFIR',"
)

content = content.replace(
    "id: 'grc', icon: '', name: 'GRC & Compliance',",
    "id: 'grc', icon: <ClipboardCheck className=\"text-teal-500\" size={24} />, name: 'GRC & Compliance',"
)

content = content.replace(
    "id: 'threat-intel', icon: '', name: 'Threat Intelligence',",
    "id: 'threat-intel', icon: <Radar className=\"text-orange-500\" size={24} />, name: 'Threat Intelligence',"
)

content = content.replace(
    "id: 'cloud', icon: '', name: 'Cloud Security',",
    "id: 'cloud', icon: <Cloud className=\"text-sky-400\" size={24} />, name: 'Cloud Security',"
)

# Add Hardware Hacking array element at the end of the domains map
old_cloud = """              {
                id: 'cloud', icon: <Cloud className="text-sky-400" size={24} />, name: 'Cloud Security',
                modules: [
                  { id: 'aws', icon: '', name: 'AWS Security', subs: [] },
                  { id: 'gcp', icon: '', name: 'GCP Security', subs: [] },
                  { id: 'azure', icon: '', name: 'Azure Security', subs: [] },
                ]
              },"""

new_cloud = old_cloud + """
              {
                id: 'hardware', icon: <Cpu className="text-emerald-500" size={24} />, name: 'Hardware Hacking',
                isDirectLink: true,
                href: '/hardware',
                modules: []
              },"""

content = content.replace(old_cloud, new_cloud)

# 3. Update the renderer to handle direct links
old_render = """                  {/* Domain row  clickable */}
                  <button
                    type="button"
                    onClick={() => toggleDomain(domain.id)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--hp-primary)]/5 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{domain.icon}</span>
                      <span className="font-bold text-[var(--hp-text)] text-base">{domain.name}</span>
                      <span className="text-[11px] text-[var(--hp-text-muted)] font-mono">{domain.modules.length} modules</span>
                    </div>
                    <ChevronDown size={18} className={`text-[var(--hp-text-muted)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>"""

new_render = """                  {/* Domain row */}
                  {(domain as any).isDirectLink ? (
                    <Link 
                      href={(domain as any).href}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--hp-primary)]/5 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--hp-bg-2)]">{domain.icon}</span>
                        <span className="font-bold text-[var(--hp-text)] text-base">{domain.name}</span>
                        <span className="text-[11px] text-[var(--hp-primary)] font-mono font-bold ml-2">PUBLIC ACCESS</span>
                      </div>
                      <ExternalLink size={18} className="text-[var(--hp-text-muted)] group-hover:text-[var(--hp-primary)] transition-colors" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleDomain(domain.id)}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--hp-primary)]/5 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--hp-bg-2)]">{domain.icon}</span>
                        <span className="font-bold text-[var(--hp-text)] text-base">{domain.name}</span>
                        <span className="text-[11px] text-[var(--hp-text-muted)] font-mono">{domain.modules.length} modules</span>
                      </div>
                      <ChevronDown size={18} className={`text-[var(--hp-text-muted)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  )}"""

content = content.replace(old_render, new_render)

# We need to make sure Link is imported if not already. 
# Usually 'import Link from "next/link";' is there.

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated icons and hardware hacking link")
