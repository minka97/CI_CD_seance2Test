/** @format */

export const capitalizeCases: Array<[string | null, string]> = [
  ["hello", "Hello"],
  ["WORLD", "World"],
  ["", ""],
  [null, ""],
];

export const averageCases: Array<[number[] | null, number]> = [
  [[10, 12, 14], 12],
  [[15], 15],
  [[], 0],
  [[10, 11, 12], 11],
  [null, 0],
];

export const slugifyCases: Array<[string, string]> = [
  ["Hello World", "hello-world"],
  [" Spaces Everywhere ", "spaces-everywhere"],
  ["C'est l'ete !", "cest-lete"],
  ["", ""],
];

export const clampCases: Array<[number, number, number, number]> = [
  [5, 0, 10, 5],
  [-5, 0, 10, 0],
  [15, 0, 10, 10],
  [0, 0, 0, 0],
];

export const emailCases: Array<[string | null, boolean]> = [
  ["user@example.com", true],
  ["user.name+tag@domain.co", true],
  ["invalid", false],
  ["@domain.com", false],
  ["user@", false],
  ["", false],
  [null, false],
];
type AgeInput = number | string | null;
export const ageCases: Array<[AgeInput, boolean]> = [
  [25, true],
  [0, true],
  [150, true],
  [-1, false],
  [151, false],
  [25.5, false],
  ["25", false],
  [null, false],
];

type PasswordResult = {
  valid: boolean;
  errors: string[];
};

type PasswordInput = string | null;

export const passwordCases: Array<[PasswordInput, PasswordResult]> = [
  ["Passw0rd!", { valid: true, errors: [] }],

  [
    "short",
    {
      valid: false,
      errors: [
        "Minimum 8 caracteres",
        "Au moins 1 majuscule",
        "Au moins 1 chiffre",
        "Au moins 1 caractere special",
      ],
    },
  ],

  [
    "alllowercase1!",
    {
      valid: false,
      errors: ["Au moins 1 majuscule"],
    },
  ],

  [
    "ALLUPPERCASE1!",
    {
      valid: false,
      errors: ["Au moins 1 minuscule"],
    },
  ],

  [
    "NoDigits!here",
    {
      valid: false,
      errors: ["Au moins 1 chiffre"],
    },
  ],

  [
    "NoSpecial1here",
    {
      valid: false,
      errors: ["Au moins 1 caractere special"],
    },
  ],

  [
    "",
    {
      valid: false,
      errors: [
        "Minimum 8 caracteres",
        "Au moins 1 majuscule",
        "Au moins 1 minuscule",
        "Au moins 1 chiffre",
        "Au moins 1 caractere special",
      ],
    },
  ],

  [
    null,
    {
      valid: false,
      errors: [
        "Minimum 8 caracteres",
        "Au moins 1 majuscule",
        "Au moins 1 minuscule",
        "Au moins 1 chiffre",
        "Au moins 1 caractere special",
      ],
    },
  ],
];
