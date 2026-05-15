import type { Role } from "@/lib/domain/role";

/** Raw complement weights W[myRole][theirRole], tune for product. */
const RAW: Record<Role, Record<Role, number>> = {
  JUNGLE: { JUNGLE: 0.45, SUPPORT: 0.82, ADC: 0.95 },
  SUPPORT: { JUNGLE: 0.88, SUPPORT: 0.5, ADC: 0.9 },
  ADC: { JUNGLE: 0.92, SUPPORT: 0.85, ADC: 0.48 },
};

const ROLES: Role[] = ["JUNGLE", "SUPPORT", "ADC"];

function maxRawForRow(role: Role): number {
  return Math.max(...ROLES.map((r) => RAW[role][r]));
}

/** S_role in [0,1] */
export function roleComplementScore(myRole: Role, theirRole: Role): number {
  const m = maxRawForRow(myRole);
  if (m <= 0) return 0;
  return RAW[myRole][theirRole] / m;
}
