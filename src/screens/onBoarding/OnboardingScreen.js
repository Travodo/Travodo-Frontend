import React, { useRef, useState, useEffect } from 'react';
import { View, FlatList, Animated, Dimensions } from 'react-native';
import SlideItem from '../../components/SlideItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import Button from '../../components/Button';

import TravodoLogo from '../../../assets/onBoardingImage/travodo_logo.svg';
import OnBoarding1 from '../../../assets/onBoardingImage/onBoarding1.svg';
import OnBoarding2 from '../../../assets/onBoardingImage/onBoarding2.svg';
import OnBoarding3 from '../../../assets/onBoardingImage/onBoarding3.svg';
import OnBoarding4 from '../../../assets/onBoardingImage/onBoarding4.svg';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    imageTop: TravodoLogo,
    imageMain: OnBoarding1,
  },
  {
    id: '2',
    imageTop: OnBoarding2,
    description: 'Travodo와 함께라면, \n짐 싸는 설렘만 남아요!',
  },
  {
    id: '3',
    imageTop: OnBoarding3,
    description: '흩어져도 괜찮아요, \n동행자와 연결된 여행!',
  },
  {
    id: '4',
    imageTop: OnBoarding4,
    description: '여행 계획을 공유하고, \n수많은 꿀팁을 가져오세요!',
  },
];

function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      navigation.replace('Sign In');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { justifyContent: 'flex-start', paddingTop: 20 }]}>
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={({ item, index }) => <SlideItem item={item} index={index} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
          listener: handleScroll,
        })}
      />

      <View style={styles.indicatorContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.indicator, currentIndex === index && styles.activeIndicator]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          text={currentIndex === slides.length - 1 ? '시작하기' : '다음'}
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
}

export default OnboardingScreen;
