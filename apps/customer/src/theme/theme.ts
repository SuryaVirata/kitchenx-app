/**
 * One place for brand colour and type.
 * Screens import these names. They do not paste hex values or font names.
 *
 * Heading and buttons use the primary face (Gabriel Sans) when that file is added.
 * Body text uses the secondary face (Degular) when that file is added.
 * Until those paid files are in assets/fonts, both roles load Inter,
 * which is free (SIL Open Font License) and is the usual cross-platform UI face.
 */
export const colors = {
  orange: '#FF4F18',
  ink: '#141517',
  field: '#F2F4F7',
  white: '#FFFFFF',
} as const;

/** Splash field only. Lighter under the top cap, deeper just above the bottom cap. */
export const splashGradient = {
  top: '#EE4A16',
  mid: '#D54314',
  bottom: '#CA4013',
} as const;

export const fontRole = {
  heading: 'BrandHeading',
  body: 'BrandBody',
} as const;

export const fontChoice = {
  heading: 'Gabriel Sans',
  body: 'Degular',
  fallback: 'Inter',
} as const;
