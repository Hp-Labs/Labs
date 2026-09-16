import os

for root, _, files in os.walk("src"):
    for file in files:
        if file.endswith(".tsx") or file.endswith(".ts"):
            path = os.path.join(root, file)
            try:
                with open(path, "r", encoding="utf-8-sig") as f:
                    content = f.read()
                    if "export function useAuth" in content or "export const useAuth" in content:
                        print(f"Found useAuth in {path}")
            except:
                pass
