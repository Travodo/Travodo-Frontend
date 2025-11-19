import { Text, StyleSheet } from 'react-native';

function CustomText({ children, SemiBold, Medium, style, ...rest }) {
  return (
    <Text
      style={[styles.defaultFont, SemiBold && styles.boldFont, Medium && styles.Medium, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  defaultFont: {
    fontFamily: 'Pretendard-Regular',
  },
  boldFont: {
    fontFamily: 'Pretendard-SemiBold',
  },
  Medium: {
    fontFamily: 'Pretendard-Medium',
  },
});

export default CustomText;
