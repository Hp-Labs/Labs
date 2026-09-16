path = "src/app/dashboard/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find("export default function DashboardPage()")
end_func = content.find("\nfunction DomainCard", idx)

if end_func != -1:
    dash_comp = content[idx:end_func]
    print(dash_comp[-500:])
else:
    print("Could not find end of DashboardPage")
