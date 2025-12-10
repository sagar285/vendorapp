import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Image,
  Platform
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { apiGet, apiDelete, apiPut } from "../../Api/Api";
import { BACKEND_URL } from "../../Api/Api";

const ViewItems = () => {
  const route = useRoute();
  const catId = route?.params?.catId;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    offerPrice: "",
  });

  const openEditModal = (item) => {
    setEditItem(item);
    setForm({
      name: item?.name,
      description: item?.description,
      price: String(item?.price),
      offerPrice: String(item?.offerPrice),
    });
    setEditModalVisible(true);
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await apiGet(`/menu/item/${catId}`);
      setItems(res?.items || []);
    } catch (err) {
      setError("Unable to load items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [catId]);

  const deleteItems = (itemId) => {
    Alert.alert("Delete Item", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await apiDelete(`/menu/item/delete/${itemId}`);
            setItems((prev) => prev.filter((i) => i._id !== itemId));
          } catch (error) {
            console.log(error);
          }
        },
      },
    ]);
  };

  const saveUpdates = async () => {
    if (!form.name.trim() || !form.price.trim()) {
      return Alert.alert("Name & Price are required");
    }

    try {
      setSaving(true);
      await apiPut(`/menu/item/edit/${editItem._id}`, {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        offerPrice: Number(form.offerPrice),
        categoryId: editItem.categoryId,
        shopId: editItem.shopId,
        type: editItem.type,
        isAvailable: editItem.isAvailable,
      });

      fetchItems();
      setEditModalVisible(false);
    } catch (err) {
      Alert.alert("Unable to update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      {/* HEADER */}
      {/* <View style={styles.headerBox}>
        <Text style={styles.headerTitle}>Items</Text>
        <Text style={styles.headerSub}>Category ID: {catId}</Text>
      </View> */}

      {/* MAIN CONTENT */}
      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#0b6bd8" />
        </View>
      ) : error ? (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.centerBox}>
          <Text style={styles.noData}>No items found.</Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 18 }}>
          {items.map((item) => (
            <View key={item._id} style={styles.itemCard}>
              {/* IMAGE */}
              <View style={styles.imageWrap}>
                {item?.image ? (
                  <Image
                    source={{ uri: `${BACKEND_URL}/${item.image}` }}
                    style={styles.itemImage}
                  />
                ) : (
                  <View style={styles.itemImagePlaceholder}></View>
                )}
              </View>

              {/* TEXT */}
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDesc}>{item.description}</Text>

              <View style={styles.priceRow}>
                <Text style={styles.offerPrice}>₹{item.offerPrice}</Text>
                <Text style={styles.cutPrice}>₹{item.price}</Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: "#0b6bd8" }]}
                  onPress={() => openEditModal(item)}
                >
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: "#c62828" }]}
                  onPress={() => deleteItems(item._id)}
                >
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* EDIT MODAL */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalWrapper}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Item</Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={form.name}
              onChangeText={(t) => setForm({ ...form, name: t })}
            />

            <TextInput
              style={[styles.input, { height: 90 }]}
              placeholder="Description"
              value={form.description}
              multiline
              onChangeText={(t) => setForm({ ...form, description: t })}
            />

            <TextInput
              style={styles.input}
              placeholder="Price"
              keyboardType="numeric"
              value={form.price}
              onChangeText={(t) => setForm({ ...form, price: t })}
            />

            <TextInput
              style={styles.input}
              placeholder="Offer Price"
              keyboardType="numeric"
              value={form.offerPrice}
              onChangeText={(t) => setForm({ ...form, offerPrice: t })}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                style={[styles.modalBtn, { backgroundColor: "#555" }]}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={saveUpdates}
                style={[styles.modalBtn, { backgroundColor: "#0b6bd8" }]}
              >
                <Text style={styles.modalBtnText}>
                  {saving ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ViewItems;

/* ---------------- STYLES ---------------- */

const SHADOW = Platform.select({
  ios: {
    shadowColor: "#bfcfd9",
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  android: {
    elevation: 4,
  },
});

const INSET = Platform.select({
  ios: {
    shadowColor: "#d3dce2",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  android: {
    elevation: 1,
  },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#eef3f6" },

  /* HEADER */
  headerBox: {
    backgroundColor: "#eef3f6",
    padding: 18,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderColor: "#e6eef2",
    ...SHADOW,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#123033",
  },
  headerSub: {
    fontSize: 13,
    color: "#6d7b81",
    marginTop: 2,
  },

  centerBox: { flex: 1, justifyContent: "center", alignItems: "center" },

  noData: { color: "#555", fontSize: 16 },
  errorText: { color: "red", fontWeight: "700" },

  /* ITEM CARD */
  itemCard: {
    backgroundColor: "#eef3f6",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#e6eef2",
    ...SHADOW,
  },

  imageWrap: {
    width: "100%",
    height: 150,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
    ...INSET,
  },
  itemImage: { width: "100%", height: "100%", resizeMode: "cover" },

  itemName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#123033",
  },
  itemDesc: {
    color: "#6a7c82",
    marginTop: 4,
    fontWeight: "500",
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  offerPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0b6bd8",
  },
  cutPrice: {
    marginLeft: 10,
    color: "#8e9aa0",
    textDecorationLine: "line-through",
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    marginHorizontal: 6,
    ...SHADOW,
  },
  actionText: { color: "#fff", fontWeight: "800" },

  /* MODAL */
  modalWrapper: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },

  modalBox: {
    backgroundColor: "#eef3f6",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e6eef2",
    ...SHADOW,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
    color: "#123033",
  },

  input: {
    backgroundColor: "#f6fbfc",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dfe8ec",
    marginBottom: 12,
    color: "#1c2b2d",
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 6,
  },
  modalBtnText: { color: "#fff", fontWeight: "800" },
});
