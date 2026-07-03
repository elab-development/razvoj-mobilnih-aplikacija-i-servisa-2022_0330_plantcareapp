import { TextInput, TextInputProps } from 'react-native';
import { styles } from './InputFiels.styles';
import { useState } from 'react';

type InputFieldProps = TextInputProps;

export default function InputField({
  placeholder,
  onFocus,
  onBlur,
  ...props
}: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      style={styles.input}
      placeholder={isFocused ? '' : placeholder}
      placeholderTextColor="#F4F1E9"
      autoCapitalize="none"
      onFocus={(event) => {
        setIsFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setIsFocused(false);
        onBlur?.(event);
      }}
      {...props}
    />
  );
}