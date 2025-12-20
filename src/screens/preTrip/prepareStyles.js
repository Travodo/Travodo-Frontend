import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.grayscale[100] },

  pageTitle: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 7,
  },

  subTitle: {
    fontSize: 16,
    color: colors.grayscale[800],
    fontFamily: 'Pretendard-Regular',
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  fixedCard: { paddingHorizontal: 20 },

  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    marginVertical: 16,
  },

  travelerList: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
  },

  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayscale[300],
  },

  plusCenter: {
  alignItems: 'center',
  marginTop: 20,
  marginBottom: 5,
},

  buttonRow: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },

  startButton: {
    backgroundColor: colors.primary[700],
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
  },

  startText: {
    color: colors.grayscale[100],
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
  },

  endButtonWrapper: {
  marginTop: 16,
},

endButton: {
  backgroundColor: colors.primary[700],
  paddingVertical: 16,
  borderRadius: 24,
  alignItems: 'center',
  marginHorizontal: 100,
  marginVertical: 20,
},

endButtonText: {
  color: colors.grayscale[100],
  fontSize: 16,
  fontFamily: 'Pretendard-SemiBold',
},

sectionDivider: {
    height: 1.2,
    backgroundColor: colors.grayscale[300],
    marginVertical: 6,
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
  color: colors.grayscale[1000],
},

plusButton: {
  marginBottom: 24
},

});
