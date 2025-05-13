// components/Button.js
import React, { useState } from 'react';
import { TouchableOpacity, Text, Platform } from 'react-native';
import styles from '../styles/ButtonStyles';

export default function Button({ title, onPress, style, textStyle, type = 'primary' }) {
  const [isHovered, setHovered] = useState(false);

  // Determine button style based on type (primary or secondary)
  const buttonStyle = [
    styles.button,
    type === 'primary' ? styles.primaryButton : styles.secondaryButton,
    isHovered && (type === 'primary' ? styles.primaryButtonHover : styles.secondaryButtonHover),
    style, // Allow custom styles to override
  ];

  const buttonTextStyle = [
    styles.buttonText,
    type === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText,
    textStyle, // Allow custom text styles to override
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      {...(Platform.OS === 'web' && {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
      })}
    >
      <Text style={buttonTextStyle}>{title}</Text>
    </TouchableOpacity>
  );
}