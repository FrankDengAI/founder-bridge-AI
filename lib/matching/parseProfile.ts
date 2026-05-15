import type { UserProfile } from "@prisma/client";
import { isRole, type Role } from "@/lib/domain/role";
import type { ParsedProfile } from "./types";

function parseJsonArray(raw: string, fallback: unknown[] = []): unknown[] {
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

export function toParsedProfile(
  userId: string,
  p: UserProfile,
): ParsedProfile {
  const role: Role = isRole(p.role) ? p.role : "ADC";
  const kw = parseJsonArray(p.skillKeywords, [])
    .filter((x): x is string => typeof x === "string");
  const roles = parseJsonArray(p.desiredPartnerRoles, [])
    .filter((x): x is Role => isRole(x));
  return {
    userId,
    role,
    budgetTier: p.budgetTier,
    intro: p.intro,
    direction: p.direction,
    skillKeywords: kw,
    desiredPartnerRoles: roles,
  };
}
