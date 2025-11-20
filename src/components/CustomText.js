import { Text, StyleSheet } from 'react-native';

function CustomText({ children, SemiBold, Medium, style, ...rest }) {
  return (
    <Text
      style={[styles.defaultFont, SemiBold && styles.semiBold, Bold && styles.Bold, style]}
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
  semiBold: {
    fontFamily: 'Pretendard-SemiBold',
  },
  bold: {
    fontFamily: 'Pretendard-Bold',
  },
});

export default CustomText;
