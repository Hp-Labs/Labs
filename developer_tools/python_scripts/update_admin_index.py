import os

path = "src/app/admin/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace(
    '<AdminCard title="User Management" icon={Users} href="#" desc="Manage platform users (Coming Soon)" />',
    '<AdminCard title="User Management" icon={Users} href="/admin/users" desc="Manage platform users" />'
)

c = c.replace(
    '<AdminCard title="Lab Freshness" icon={Zap} href="/admin/lab-freshness" desc="Monitor and reset lab environments" />',
    '<AdminCard title="Lab Sessions" icon={Zap} href="/admin/labs" desc="Monitor active lab instances" />\n          <AdminCard title="Lab Freshness" icon={Zap} href="/admin/lab-freshness" desc="Monitor and reset lab environments" />'
)

c = c.replace(
    '<AdminCard title="System Settings" icon={Settings} href="#" desc="Global configuration and backups (Coming Soon)" />',
    ''
)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Updated admin index")
