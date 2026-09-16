path = "src/app/red-team/pentesting/[domain]/[severity]/[level]/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix the auth destructuring
bad_auth = """  const { user, addXP, completeLevel,
  } = useAuth();
  const userId = user?.id; isLevelCompleted, isSeverityUnlocked, isLevelUnlocked } = useAuth();"""
good_auth = """  const { user, addXP, completeLevel, isLevelCompleted, isSeverityUnlocked, isLevelUnlocked } = useAuth();
  const userId = user?.id;"""
content = content.replace(bad_auth, good_auth)

# Fix lab.tags.length
content = content.replace("{lab?.tags.length > 0", "{(lab?.tags?.length ?? 0) > 0")
content = content.replace("{lab?.tags?.length > 0", "{(lab?.tags?.length ?? 0) > 0")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Syntax fixed")
