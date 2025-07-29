import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Animated,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';

interface FloatingLabelInputProps extends TextInputProps {
  label: string;
  containerStyle?: ViewStyle;
  rightComponent?: React.ReactNode; 
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  value,
  onChangeText,
  containerStyle,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useState(new Animated.Value(value ? 1 : 0))[0];

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: 'absolute' as const,
    left: 10,
    top: animatedIsFocused.interpolate({ inputRange: [0, 1], outputRange: [18, -10] }),
    fontSize: animatedIsFocused.interpolate({ inputRange: [0, 1], outputRange: [14, 12] }),
    color: isFocused ? '#00CB21' : rest.placeholderTextColor || '#fff',
    backgroundColor: '#000',
    paddingHorizontal: 4,
    zIndex: 2,
  };

  const borderColor = animatedIsFocused.interpolate({
    inputRange: [0, 1],
    outputRange: ['#444', '#00CB21'],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <Animated.View style={[styles.inputContainer, { borderBottomColor: borderColor }]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={[styles.input, rest.style]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="" 
          {...rest}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%', 
    paddingTop: 18,
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%', 
  },
  input: {
    height: 40,
    fontSize: 16,
    color: '#fff',
    padding: 10, 
    backgroundColor: 'transparent',
    width: '100%', 
  },
});

export default FloatingLabelInput;