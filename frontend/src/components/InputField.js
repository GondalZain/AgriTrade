// components/InputField.js
import React from 'react';
import { TextInput } from 'react-native';
import styles from '../styles/InputFieldStyles';

export default function InputField({
  style,
  placeholder,
  placeholderTextColor,
  value,
  onChangeText,
  secureTextEntry,
  onFocus,
  onBlur,
}) {
  return (
    <TextInput
      style={[styles.input, style]} // Allow external styles to override
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor || styles.placeholder.color} // Use default placeholder color if not provided
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}