import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../styles/colors';
import PropTypes from 'prop-types';

const { width, height } = Dimensions.get('window');

export default function SlideItem({ item, index }) {
  const isFirstSlide = index === 0;
  const Logo = item.imageTop;
  const MainImage = item.imageMain;

  return (
    <View style={[styles.container, { width }]}>
      {isFirstSlide ? (
        <>
          {Logo && (
            <View style={{ alignItems: 'center', marginTop: height * 0.1 }}>
              <Logo width={width * 0.46} height={height * 0.08} />
            </View>
          )}

          {MainImage && (
            <View style={{ alignItems: 'center', marginVertical: height * 0.04 }}>
              <MainImage width={width * 0.7} height={height * 0.32} />
            </View>
          )}
        </>
      ) : (
        <View style={styles.content}>
          {Logo && (
            <View style={{ alignItems: 'center' }}>
              <Logo width={width * 0.68} height={height * 0.3} />
            </View>
          )}
          <Text style={styles.description}>{item.description}</Text>
        </View>
      )}
    </View>
  );
}

SlideItem.propTypes = {
  item: PropTypes.shape({
    imageTop: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    imageMain: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    description: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: colors.grayscale[100],
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: height * 0.14,
  },

  description: {
    fontSize: 20,
    color: '#22252C',
    fontFamily: 'Pretendard-Regular',
    textAlign: 'center',
    lineHeight: 26,
    marginTop: height * 0.05,
    paddingHorizontal: 16,
  },
});
