import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';

const sharedStyles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.grayscale[100],
    paddingTop: 10,
  },

  pageTitle: {
    fontSize: 20,
    color: colors.grayscale[1000],
    fontFamily: 'Pretendard-SemiBold',
    paddingHorizontal: 20,
    marginBottom: 6,
  },

  subTitle: {
    fontSize: 16,
    color: colors.grayscale[800],
    fontFamily: 'Pretendard-Regular',
    paddingHorizontal: 20,
    marginBottom: 8,
  },

  fixedCard: { 
    paddingHorizontal: 20, 
    paddingBottom: 8 
  },

  content: { 
    paddingHorizontal: 20, 
    paddingTop: 16, 
    paddingBottom: 80 
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    marginTop: 20,
    marginBottom: 16,
    color: colors.grayscale[1000],
  },

  travelerList: {
    flexDirection: 'row',
    gap: 6,
    flexShrink: 1,
    paddingRight: 8,
    flexWrap: 'wrap',
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },

  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    borderBottomWidth: 1,
    borderBottomColor: colors.grayscale[300],
    paddingVertical: 6,
  },

  sectionDivider: {
    height: 1.2,
    backgroundColor: colors.grayscale[300],
    marginTop: 20,
    marginBottom: 12,
  },

  memoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },

  memoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },

  memoText: { 
    fontSize: 16, 
    fontFamily: 'Pretendard-Regular', 
    color: colors.grayscale[1000] 
  },

  plusCenter: { 
    alignItems: 'center', 
    marginTop: 12 
  },

  plusButton: { 
    width: 30, 
    height: 30, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
});

export default sharedStyles;