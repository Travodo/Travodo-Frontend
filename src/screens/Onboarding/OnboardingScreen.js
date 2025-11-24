import React, { useRef, useState } from "react";
import { View, FlatList, Animated, Dimensions, Text, Pressable } from "react-native";
import SlideItem from "./SlideItem";
import styles from "./styles";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    imageTop: require("../../../assets/Logo/logo1.png"),
    title: "지금 Travodo와 여행을 시작하세요!",
    imageMain: require("../../../assets/Images/onBoarding1.png"),
  },
  {
    id: "2",
    imageTop: require("../../../assets/Images/onBoarding2.png"),
    description: "Travodo와 함께라면, \n짐 싸는 설렘만 남아요!",
  },
  {
    id: "3",
    imageTop: require("../../../assets/Images/onBoarding3.png"),
    description: "흩어져도 괜찮아요, \n동행자와 연결된 여행!",
  },
  {
    id: "4",
    imageTop: require("../../../assets/Images/onBoarding4.png"),
    description: "여행 계획을 공유하고, \n수많은 꿀팁을 가져오세요!",
  },
];


export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
        flatListRef.current.scrollToIndex({ index: currentIndex + 1, animated: true })
    } else {
        navigation.replace("Home");
    }
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={({ item, index }) => <SlideItem item={item} index={index} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
      />

      <View style={styles.indicatorContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentIndex === index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.startButton} onPress={handleNext}>
          <Text style={[styles.startText, { fontFamily: "PretendardSemiBold" }]}>
            {currentIndex === slides.length - 1 ? "시작하기" : "다음"}
            </Text>
        </Pressable>
    </View>
    </View>
  );
}
