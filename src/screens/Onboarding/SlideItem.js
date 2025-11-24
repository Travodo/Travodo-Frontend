import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function SlideItem({ item, index }) {
    const isFirstSlide = index === 0;

  return (
    <View style={[styles.container, { width }]}>
      {isFirstSlide ? (
        <>
          <Image source={item.imageTop} style={[ styles.logo, isFirstSlide && styles.firstLogo ]} resizeMode="contain" />
          <Text style={styles.subtitle}>{item.title}</Text>
          <Image source={item.imageMain} style={styles.mainImage} resizeMode="contain" />
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
    backgroundColor: "#fff",
    paddingTop: height * 0.005
  },

  firstLogo: {
    width: 150,
    height: 80
  },

  logo: {
    width: 120,
    height: 60,
    marginTop: height * 0.18
  },

  subtitle: {
    fontSize: 18,
    fontFamily: "PretendardRegular",
    color: "#979494",
    textAlign: "center",
    marginTop: 10
  },

  mainImage: {
    width: width * 0.8,
    height: width * 0.8,
    marginVertical: 40
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: height * 0.20
  },

  illust: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 30,
  },

  description: {
    fontSize: 20,
    color: "#22252C",
    fontFamily: "PretendardRegular",
    textAlign: "center",
    lineHeight: 26,
    marginTop: 35
  },

});
