export type PlayerProfile = {
  age?: string;
  position?: string;
  level?: string;
  daysPerWeek?: string;
  primaryGoal?: string;
  equipment?: string;
  injuryNotes?: string;
};

export const emptyPlayerProfile: Required<PlayerProfile> = {
  age: "",
  position: "",
  level: "",
  daysPerWeek: "",
  primaryGoal: "",
  equipment: "",
  injuryNotes: "",
};

export function normalizePlayerProfile(profile: unknown): Required<PlayerProfile> {
  const value = profile && typeof profile === "object" ? (profile as PlayerProfile) : {};

  return {
    age: value.age?.trim() ?? "",
    position: value.position?.trim() ?? "",
    level: value.level?.trim() ?? "",
    daysPerWeek: value.daysPerWeek?.trim() ?? "",
    primaryGoal: value.primaryGoal?.trim() ?? "",
    equipment: value.equipment?.trim() ?? "",
    injuryNotes: value.injuryNotes?.trim() ?? "",
  };
}

export function hasPlayerProfile(profile: PlayerProfile) {
  return Object.values(normalizePlayerProfile(profile)).some(Boolean);
}

export function buildPlayerProfileHighlights(profile: PlayerProfile) {
  const normalized = normalizePlayerProfile(profile);

  return [
    normalized.position ? `Position: ${normalized.position}` : null,
    normalized.level ? `Level: ${normalized.level}` : null,
    normalized.primaryGoal ? `Goal: ${normalized.primaryGoal}` : null,
    normalized.daysPerWeek ? `Days/week: ${normalized.daysPerWeek}` : null,
  ].filter(Boolean) as string[];
}

export function buildPlayerProfileContext(profile: PlayerProfile | undefined) {
  if (!profile) return null;

  const normalized = normalizePlayerProfile(profile);
  const fields = [
    normalized.age ? `Age: ${normalized.age}` : null,
    normalized.position ? `Position: ${normalized.position}` : null,
    normalized.level ? `Level: ${normalized.level}` : null,
    normalized.daysPerWeek ? `Training days per week: ${normalized.daysPerWeek}` : null,
    normalized.primaryGoal ? `Primary goal: ${normalized.primaryGoal}` : null,
    normalized.equipment ? `Equipment access: ${normalized.equipment}` : null,
    normalized.injuryNotes ? `Injury or recovery notes: ${normalized.injuryNotes}` : null,
  ].filter(Boolean);

  if (fields.length === 0) return null;

  return [
    "Use this athlete profile to personalize every recommendation unless the user overrides it:",
    ...fields,
  ].join("\n");
}
