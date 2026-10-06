// Values match the strings in cards.json.
export enum CardKind {
  TRUTH = 'truth',
  DARE = 'dare',
  VIRUS = 'virus',
  RULE = 'rule',
  MISSION = 'mission',
}

export enum CardTag {
  KSG = 'ksg',
  PHONE = 'phone',
  OUTSIDER = 'outsider',
  PHYSICAL = 'physical',
  ROAST = 'roast',
}

// A pack is a group of cards that the lobby turns on or off.
export enum Pack {
  KSG = 'ksg',
  VIRUS = 'virus',
  RULE = 'rule',
  MISSION = 'mission',
  PHYSICAL = 'physical',
}

export enum Penalty {
  SIPS = 'sips',
  SHOT = 'shot',
}
