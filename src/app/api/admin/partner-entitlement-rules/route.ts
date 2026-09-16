import { requireAdminAPI } from '@/lib/services/adminGuard';
// ============================================================
// HpLabs  Admin: Partner Entitlement Rules CRUD API
// GET    /api/admin/partner-entitlement-rules          (list all)
// POST   /api/admin/partner-entitlement-rules          (create)
// PUT    /api/admin/partner-entitlement-rules          (update by id in body)
// DELETE /api/admin/partner-entitlement-rules?id=...   (delete)
//
// INTERNAL ONLY  Admin guard enforced server-side
// ============================================================

import { NextResponse } from "next/server";
import {
  listEntitlementRules,
  createEntitlementRule,
  updateEntitlementRule,
  deleteEntitlementRule,
} from "@/lib/services/entitlementRules";

import { getSession } from '@/lib/services/sessionStore';







//  GET: list all rules 
export async function GET(req: Request) {
  
  const adminUser = await requireAdminAPI();
  if (!adminUser) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
  }
  return NextResponse.json({ success: true, rules: listEntitlementRules() });
}

//  POST: create a rule 
export async function POST(req: Request) {
  
  const adminUser = await requireAdminAPI();
  if (!adminUser) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
  }
  try {
    const { label, minCourseDurationMonths, premiumMonthsAwarded } = await req.json();

    if (!label || typeof label !== "string" || !label.trim()) {
      return NextResponse.json({ success: false, message: "label is required." }, { status: 400 });
    }
    const min = Number(minCourseDurationMonths);
    const award = Number(premiumMonthsAwarded);
    if (!Number.isFinite(min) || min < 1) {
      return NextResponse.json({ success: false, message: "minCourseDurationMonths must be a positive number." }, { status: 400 });
    }
    if (!Number.isFinite(award) || award < 1) {
      return NextResponse.json({ success: false, message: "premiumMonthsAwarded must be a positive number." }, { status: 400 });
    }

    const rule = createEntitlementRule(label.trim(), min, award);
    return NextResponse.json({ success: true, rule }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }
}

//  PUT: update an existing rule 
export async function PUT(req: Request) {
  
  const adminUser = await requireAdminAPI();
  if (!adminUser) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
  }
  try {
    const body = await req.json();
    const { id, label, minCourseDurationMonths, premiumMonthsAwarded } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "id is required." }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (label !== undefined) {
      if (typeof label !== "string" || !label.trim()) {
        return NextResponse.json({ success: false, message: "label must be a non-empty string." }, { status: 400 });
      }
      updates.label = label.trim();
    }
    if (minCourseDurationMonths !== undefined) {
      const min = Number(minCourseDurationMonths);
      if (!Number.isFinite(min) || min < 1) {
        return NextResponse.json({ success: false, message: "minCourseDurationMonths must be a positive number." }, { status: 400 });
      }
      updates.minCourseDurationMonths = min;
    }
    if (premiumMonthsAwarded !== undefined) {
      const award = Number(premiumMonthsAwarded);
      if (!Number.isFinite(award) || award < 1) {
        return NextResponse.json({ success: false, message: "premiumMonthsAwarded must be a positive number." }, { status: 400 });
      }
      updates.premiumMonthsAwarded = award;
    }

    const updated = updateEntitlementRule(id, updates as Parameters<typeof updateEntitlementRule>[1]);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Rule not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, rule: updated });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }
}

//  DELETE: remove a rule 
export async function DELETE(req: Request) {
  
  const adminUser = await requireAdminAPI();
  if (!adminUser) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ success: false, message: "id query param is required." }, { status: 400 });
  }

  const deleted = deleteEntitlementRule(id);
  if (!deleted) {
    return NextResponse.json({ success: false, message: "Rule not found." }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: "Rule deleted." });
}
