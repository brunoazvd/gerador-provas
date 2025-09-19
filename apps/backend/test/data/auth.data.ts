const invalidFormats = [
  ['type = boolean', true],
  ['type = integer', 123],
  ['type = float', 123.456],
  ['type = null', null],
  ['type = undefined', undefined],
  ['type = array', []],
  ['type = object', {}],
  ['type = function', () => 'teste'],
];

export const invalidEmails = [
  ['invalid format', 'invalid-format'],
  ['no domain', 'nodomain@'],
  ['only subdomain', 'onlysubdomain@.com'],
  ['multiple @s', 'multiple-ats@.com@.com'],
  ['domain ends with dot', 'domain.ends.with.dot@.com.'],
  ['domain starts with dot', 'test@.com.com'],
  ['domain ends with dot', 'test@test.com.'],
  ['domain starts with hyphen', 'test@-com.com'],
  ['domain ends with hyphen', 'test@test.com-'],
  ['local starts with dot', '.test@test.com'],
  ['local ends with dot', 'test.@test.com'],
  ['local starts with hyphen', '-test@test.com'],
  ['local ends with hyphen', 'test-@test.com'],
  ['special characters', 'special#character$@test.com'],
  ['contain spaces', 'contains space@test.com'],
  ['contain emojis', 'contains🔥emoji@test.com'],
  ...invalidFormats,
];

export const invalidNames = [
  ['space as first character', ' João'],
  ['space as last character', 'João '],
  ['repeated spaces', 'Espaço  Repetido'],
  ['repeated hyphens', 'Hyphen--Repetido'],
  ['repeated apostrophes', "Apostrofo''repetido"],
  ['special characters', 'Sou #Especial'],
  ['non-latin characters', 'Мария'],
  ['contains digits', 'Gabe69'],
  ...invalidFormats,
];

export const invalidPasswords = [
  ['password too short', '123abc'],
  ['password too long', 'a2b4c'.repeat(13)],
  ['password has no uppercase letters', 'abcdefg123'],
  ['password has no lowercase letters', 'ABCDEFG123'],
  ['password without digits', 'nodigitsss'],
  ...invalidFormats,
];

export const invalidTokens = [
  ['invalid token format','invalid.format.attempt'],
  ['valid format but modified data','modifiedTokenzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3NTgyMTM5MTMsImV4cCI6MTc1ODIxNzUxM30.JKYT6JLihEUsuGhrxpCIh1mX7cBqeTVDaO72YaLQlQQ'],
  ...invalidFormats
]

export const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3NTgyMTM5MTMsImV4cCI6MTc1ODIxNzUxM30.JKYT6JLihEUsuGhrxpCIh1mX7cBqeTVDaO72YaLQlQQ';
