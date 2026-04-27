/**
 * Convert an expiresIn string like `15m`, `1h`, `7d`, `30s` into seconds for cookie maxAge.
 */
export function expiresInToSeconds(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([dhms])$/);
  if (!match) {
    throw new Error(`Invalid expiresIn format: ${expiresIn}`);
  }

  const [, valueStr, unit] = match;
  if (!valueStr || !unit) {
    throw new Error(`Invalid expiresIn format: ${expiresIn}`);
  }

  const value = Number.parseInt(valueStr, 10);

  const unitMultipliers: Record<string, number> = {
    d: 86400,
    h: 3600,
    m: 60,
    s: 1,
  };

  const multiplier = unitMultipliers[unit];
  if (!multiplier) {
    throw new Error(`Invalid expiresIn unit: ${unit}`);
  }

  return value * multiplier;
}
