import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../../styles/colors";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale[100],
    alignItems: "center",
    justifyContent: "center"
  },

  indicatorContainer: {
    position: "absolute",
    bottom: 205,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  },

  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },

  activeIndicator: {
    backgroundColor: colors.primary[700],
    width: 20,
  },

  buttonContainer: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    alignItems: "center"
  }

});