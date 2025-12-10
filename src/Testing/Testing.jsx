import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  PanResponder,
  Platform,
} from "react-native";

const BottomSheet = () => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");

  // Animated value that we will manage with offsets
  const translateY = useRef(new Animated.Value(0)).current;
  // store offset manually for extra safety
  const offsetY = useRef(0);

  // track scroll inside ScrollView (kept for potential future checks)
  const scrollOffset = useRef(0);

  const OPTIONS = [
    "Sagar Gupta",
    "anirudh ji shastri",
    "Anirudh Sastri",
    "va",
    "de",
    "Test5",
    "Test4 jdjs",
    "Test3",
    "Test2",
    "Test",
    "dhruv tiwari",
    "ggfgfwewe ptotippoitpeor",
  ];

  const filtered = OPTIONS.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  // utility to safely stop any running animation and get current value
  const getCurrentTranslateY = () =>
    new Promise((res) => {
      // stopAnimation gives current value in callback
      translateY.stopAnimation((value) => {
        res(value + offsetY.current); // include offset if any
      });
    });

    const closeModal = async (velocity = 0) => {
        // Pehle flatten karo
        try {
          translateY.flattenOffset();
        } catch (e) {}
        
        // Sheet ko neeche slide karo
        Animated.timing(translateY, {
          toValue: 900,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          // Animation COMPLETE hone ke BAAD modal close karo
          setVisible(false);
          // Cleanup - next time ke liye reset
          setTimeout(() => {
            translateY.setValue(0);
            offsetY.current = 0;
          }, 50);
        });
      };

  const snapBack = () => {
    translateY.stopAnimation();
    Animated.spring(translateY, {
      toValue: 0,
      bounciness: 6,
      useNativeDriver: true,
    }).start(() => {
      offsetY.current = 0;
      translateY.setValue(0);
    });
  };

  // PANRESPONDER attached only to header (your request)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => {
        // start when user moves finger downward enough
        return gesture.dy > 10;
      },

      onPanResponderGrant: () => {
        // stop any animation, set offset to current translateY value
        translateY.stopAnimation((val) => {
          // val is current animated value (could be mid-animation)
          // set offsetY so future setValue(gesture.dy) is relative
          offsetY.current = val || 0;
          // now setOffset on the animated value so that setValue works relative
          try {
            // Some RN versions support setOffset
            translateY.setOffset(offsetY.current);
            translateY.setValue(0);
          } catch (e) {
            // fallback: do nothing - we'll add offset manually later
            // We still keep offsetY.current and use it in getCurrentTranslateY
          }
        });
      },

      onPanResponderMove: (_, gesture) => {
        // only let the sheet move downward visually (no upward beyond 0)
        const dy = gesture.dy;
        if (dy > 0) {
          // set value relative to offset
          translateY.setValue(dy);
        } else {
          // small negative values ignored to prevent weird upward movement
          translateY.setValue(0);
        }
      },

      onPanResponderTerminationRequest: () => true,

      onPanResponderRelease: async (_, gesture) => {
        // Flatten offset
        try {
          translateY.flattenOffset();
        } catch (e) {}
      
        translateY.stopAnimation((current) => {
          const final = current ?? 0;
          const { vy } = gesture;
          const shouldClose = final > 140 || vy > 0.85;
      
          if (shouldClose) {
            // Close animation
            Animated.timing(translateY, {
              toValue: 900,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              setVisible(false);
              setTimeout(() => {
                translateY.setValue(0);
                offsetY.current = 0;
              }, 50);
            });
          } else {
            // Snap back
            Animated.spring(translateY, {
              toValue: 0,
              bounciness: 6,
              useNativeDriver: true,
            }).start(() => {
              offsetY.current = 0;
            });
          }
        });
      },
    })
  ).current;

  const toggleOption = (name) => {
    if (selected.includes(name)) {
      setSelected(selected.filter((i) => i !== name));
    } else {
      setSelected([...selected, name]);
    }
  };

  const toggleSelectAll = () => {
    if (selected.length === OPTIONS.length) setSelected([]);
    else setSelected([...OPTIONS]);
  };

  return (
    <View style={styles.center}>
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.openBtn}>
        <Text style={{ color: "#fff" }}>Open Bottom Sheet</Text>
      </TouchableOpacity>

      <Modal 
      transparent 
      visible={visible} 
      animationType="none"  // "fade" se "none" karo - ye important hai
      onRequestClose={() => closeModal()}
      >
        <View style={styles.backdrop}>
          <Animated.View
            style={[
              styles.sheet,
              {
                transform: [
                  {
                    translateY: translateY.interpolate
                      ? translateY.interpolate({
                          inputRange: [0, 1000],
                          outputRange: [0, 1000],
                        //   extrapolate: "clamp",
                        })
                      : translateY, // fallback
                  },
                ],
              },
            ]}
          >
            {/* header area ONLY receives pan handlers */}
            <View {...panResponder.panHandlers} style={styles.dragHeader}>
              <View style={styles.handle} />
              <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Created By</Text>
              </View>
            </View>

            <View style={styles.searchBox}>
              <TextInput
                placeholder="Search"
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
              />
            </View>

            <View style={styles.selectRow}>
              <TouchableOpacity onPress={toggleSelectAll} style={styles.row}>
                <View
                  style={[
                    styles.checkbox,
                    selected.length === OPTIONS.length && { backgroundColor: "#4CAF50" },
                  ]}
                />
                <Text>Select All</Text>
              </TouchableOpacity>

              <View style={styles.row}>
                <Text>Show Selected</Text>
                <View style={styles.checkbox} />
              </View>
            </View>

            <View style={styles.divider} />

            <ScrollView
              style={{ flex: 1 }}
              onScroll={(e) => {
                scrollOffset.current = e.nativeEvent.contentOffset.y;
              }}
              scrollEventThrottle={16}
            >
              {filtered.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionRow}
                  onPress={() => toggleOption(item)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      selected.includes(item) && { backgroundColor: "#4CAF50" },
                    ]}
                  />
                  <Text>{item}</Text>
                </TouchableOpacity>
              ))}

              <View style={{ height: 90 }} />
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.applyBtn} onPress={() => closeModal()}>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Apply</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  openBtn: {
    backgroundColor: "black",
    padding: 12,
    borderRadius: 6,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  sheet: {
    height: "85%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: "hidden",
  },

  dragHeader: {
    paddingTop: 8,
    // paddingBottom: 6,
    backgroundColor: "#fff",
  },

  handle: {
    width: 60,
    height: 6,
    borderRadius: 4,
    backgroundColor: "#CFCFCF",
    alignSelf: "center",
    marginVertical: 8,
  },
  headerRow: {
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  searchBox: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: "#F3F3F3",
    padding: Platform.OS === "ios" ? 12 : 10,
    borderRadius: 10,
  },

  selectRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    paddingVertical: 10,
  },
  row: { flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 6,
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginBottom: 6,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  applyBtn: {
    backgroundColor: "black",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
});
