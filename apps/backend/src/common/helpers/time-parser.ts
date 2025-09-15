export const parseTimeToMs = (duration: string): number => {
  const regex = /^(\d+)(ms|s|m|h|d|w)$/i;
  const match: RegExpMatchArray | null = duration.trim().match(regex);
  if (!match || match.length !== 3) {
    throw new Error('Duração inválida.');
  }
  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = {
    ms: 1,
    s: 1000,
    m: 1000 * 60,
    h: 1000 * 60 * 60,
    d: 1000 * 60 * 60 * 24,
    w: 1000 * 60 * 60 * 24 * 7,
  };
  return value * multipliers[unit];
};
