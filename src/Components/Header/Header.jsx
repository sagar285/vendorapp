import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../../Theme/Colors";
import { useAppContext } from "../../Context/AppContext";
import { wp, hp } from "../../Theme/Dimensions";

const Header = () => {
  const { ActiveLoader } = useAppContext();

  return (
    <View style={styles.container}>

      {/* LEFT → Back + Title */}
      <View style={styles.leftRow}>
        <Image
          source={require("../../assets/images/backArrow.png")}
          style={styles.backIcon}
        />
        <Text style={styles.title}>Register</Text>
      </View>

      {/* RIGHT → Loader Steps */}
      <View style={styles.loaderRow}>
        {[0, 1, 2, 3, 4].map((item) => (
          <View
            key={item}
            style={[
              styles.loaderBox,
              {
                backgroundColor:
                  ActiveLoader === item
                    ? COLORS.Blue
                    : COLORS.lightGray,

                width:
                  ActiveLoader === item
                    ? wp(8)  // ✅ Active
                    : wp(4), // ✅ Inactive
              },
            ]}
          />
        ))}
      </View>

    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.5),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  backIcon: {
    width: wp(5),
    height: wp(5),
    resizeMode: "contain",
    marginRight: wp(2),
  },

  title: {
    fontSize: wp(5),
    fontWeight: "600",
    color: COLORS.BlackText,
  },

  loaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.2),
  },

  loaderBox: {
    height: hp(1.2),
    borderRadius: wp(5),
  },
});
