import { Pressable, Text, type PressableProps, type StyleProp, type ViewStyle, type TextStyle } from 'react-native';
import { styles } from './AppButton.styles';

type AppButtonProps = Omit<PressableProps, 'style'> & {
  title: string;
  variant?: 'primary' | 'outline';
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function AppButton({
  title,
  variant = 'primary',
  buttonStyle,
  textStyle,
  ...props
}: AppButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        variant === 'outline' && styles.outlineButton,
        pressed && styles.pressed,
        buttonStyle,
      ]}
      {...props}
    >
      <Text
        style={[
         styles.buttonText, textStyle
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}