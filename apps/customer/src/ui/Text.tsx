import { StyleSheet, Text as RNText, TextInput as RNTextInput, TextInputProps, TextProps, TextStyle } from 'react-native';
import { fontRole } from '../theme/theme';

function roleFor(style: TextProps['style']): string {
  const flat = StyleSheet.flatten(style) as TextStyle | undefined;
  const weight = flat?.fontWeight;
  if (weight === 'bold' || weight === '600' || weight === '700' || weight === '800' || weight === '900') {
    return fontRole.heading;
  }
  if (typeof weight === 'number' && weight >= 600) return fontRole.heading;
  return fontRole.body;
}

export function Text({ style, ...rest }: TextProps) {
  return <RNText {...rest} style={[{ fontFamily: roleFor(style) }, style]} />;
}

export function TextInput({ style, ...rest }: TextInputProps) {
  return <RNTextInput {...rest} style={[{ fontFamily: fontRole.body }, style]} />;
}
