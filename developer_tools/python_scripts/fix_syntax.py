path = "src/app/api/admin/partner-entitlement-rules/route.ts"
with open(path, "r", encoding="utf-8-sig") as f:
    c = f.read()

bad_snippet = """import {

import { getSession } from '@/lib/services/sessionStore';

function checkAdmin(req: Request) {
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/hplabs_session_id=([^;]+)/);
  if (!match) return false;
  const user = getSession(match[1]);
  return user && user.isAdmin;
}

  listEntitlementRules,
  createEntitlementRule,
  updateEntitlementRule,
  deleteEntitlementRule,
} from "@/lib/services/entitlementRules";"""

good_snippet = """import {
  listEntitlementRules,
  createEntitlementRule,
  updateEntitlementRule,
  deleteEntitlementRule,
} from "@/lib/services/entitlementRules";

import { getSession } from '@/lib/services/sessionStore';

function checkAdmin(req: Request) {
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/hplabs_session_id=([^;]+)/);
  if (!match) return false;
  const user = getSession(match[1]);
  return user && user.isAdmin;
}"""

c = c.replace(bad_snippet, good_snippet)
with open(path, "w", encoding="utf-8") as f:
    f.write(c)
print("Fixed route.ts syntax.")
