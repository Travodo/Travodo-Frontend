import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { colors } from "../../styles/colors";

const { width, height } = Dimensions.get("window");

export default function SlideItem({ item, index }) {
    const isFirstSlide = index === 0;

  return (
    <View style={[styles.container, { width }]}>
      {isFirstSlide ? (
        <>
          <Image source={item.imageTop} style={styles.logo} resizeMode="contain" />
          <Image source={item.imageMain} style={styles.firstMainImage} resizeMode="contain" />
        </>
      ) : (

        <View style={styles.content}>
          <Image
            source={item.imageTop}
            style={styles.illust}
            resizeMode="contain"
          />
          <Text style={styles.description}>{item.description}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    alignItems: "center",
    flex: 1,
    backgroundColor: colors.grayscale[100]
  },

  logo: {
    width: width * 0.1,
    aspectRatio: 3.8,
    marginBottom: height * 0.03,
    marginTop: height * 0.1,
    height: height * 0.08
  },

  firstMainImage: {
    width: width * 0.7,
    aspectRatio: 1,
    maxHeight: height * 0.32,
    marginVertical: height * 0.04,
    marginTop: height * 0.05
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: height * 0.14,
  },

  illust: {
    width: width * 0.68,
    marginBottom: height * 0.02,
    maxHeight: height * 0.3,
    aspectRatio: 1
  },

  description: {
    fontSize: 20,
    color: "#22252C",
    fontFamily: "PretendardRegular",
    textAlign: "center",
    lineHeight: 26,
    marginTop: height * 0.05,
    paddingHorizontal: 16
  },

});