import os

path = "src/lib/services/notificationService.ts"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace('Promise<boolean>', 'Promise<"sent" | "failed" | "not-configured">')
c = c.replace('return false;', 'return "failed";')
c = c.replace('return true;', 'return "sent";')
c = c.replace('return "failed";\n  }', 'return "not-configured";\n  }') # for the dev/unconfigured branches!

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Updated notification return types")
