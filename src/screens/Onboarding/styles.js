import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },

  indicatorContainer: {
    position: "absolute",
    bottom: 130,
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
    backgroundColor: "#769FFF",
    width: 20,
  },

  startButton: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    backgroundColor: "#769FFF",
    borderRadius: 12,
    paddingVertical: 16,
    width: width * 0.85,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3
  },

  startText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18
  },
});
