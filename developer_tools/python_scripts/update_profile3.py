import os

path = "src/app/profile/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# find "export default function ProfilePage() {"
idx = c.find("export default function ProfilePage() {")
if idx != -1:
    old_func = "export default function ProfilePage() {\n  const { user } = useAuth();"
    new_func = """export default function ProfilePage() {
  const { user } = useAuth();
  const [activity, setActivity] = useState<{day: number, count: number}[]>(Array(28).fill(0).map((_, i) => ({day: i, count: 0})));

  useEffect(() => {
    if (user) {
      fetch("/api/users/activity")
        .then(r => r.json())
        .then(d => { if(d.success) setActivity(d.activity); })
        .catch(() => {});
    }
  }, [user]);"""
    c = c.replace(old_func, new_func)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
print("Updated profile hooks")
