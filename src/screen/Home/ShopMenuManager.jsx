import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { apiGet, apiPost, apiDelete } from '../../Api/Api';
import { useNavigation } from '@react-navigation/native';
import NavigationStrings from '../../Navigations/NavigationStrings';
import { BACKEND_URL } from '../../Api/Api';

const ShopMenuManager = ({ route }) => {
  const shopId = route?.params?.shopId;
  const [categories, setCategories] = useState([]);
  const [addCatModal, setAddCatModal] = useState(false);
  const [addMenuModal, setAddMenuModal] = useState(false);
  const [editMenuModal, setEditMenuModal] = useState(false);
  const [addCategoryLoaidng, setaddCategoryLoading] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [iconFile, setIconFile] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [menuIdToEdit, setMenuIdToEdit] = useState(null);
  const [menuName, setMenuName] = useState('');
  const [menuDesc, setMenuDesc] = useState('');
  const [menuType, setMenuType] = useState('veg');
  const [menuPrice, setMenuPrice] = useState('');
  const [menuOffer, setMenuOffer] = useState('');
  const [quantityOptions, setQuantityOptions] = useState([]);
  const [menuImage, setMenuImage] = useState(null);
  const navigation = useNavigation();

  // PICK CATEGORY ICON
  const pickIcon = async () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, response => {
      if (response.didCancel || response.errorCode) return;
      const file = response?.assets?.[0];
      if (file) {
        setIconFile({
          uri: file.uri,
          type: file.type,
          name: file.fileName || `cat-${Date.now()}.jpg`,
        });
      }
    });
  };

  // PICK MENU IMAGE
  const pickMenuImage = async () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, response => {
      if (response.didCancel || response.errorCode) return;
      const img = response?.assets?.[0];
      if (img) {
        setMenuImage({
          uri: img.uri,
          type: img.type,
          name: img.fileName || `menu-${Date.now()}.jpg`,
        });
      }
    });
  };

  // GET CATEGORIES
  const getCategories = async () => {
    try {
      const res = await apiGet(`/menu/category/${shopId}`);
      setCategories(res?.categories || []);
    } catch (err) {
      console.log('Get category error:', err);
    }
  };

  useEffect(() => {
    getCategories();
  }, [shopId]);

  // ADD CATEGORY
  const addCategory = async () => {
    if (!newCatName.trim()) return;
    setaddCategoryLoading(true)
    try {
      const form = new FormData();
      form.append('shopId', shopId);
      form.append('name', newCatName);

      if (iconFile) form.append('icon', iconFile);

      await apiPost('/menu/category/add', form, {}, true);

      setAddCatModal(false);
      setNewCatName('');
      setIconFile(null);
      getCategories();
      setaddCategoryLoading(false)
    } catch (err) {
      setaddCategoryLoading(false)
      console.log('Add category error:', err);
    }
  };

  // DELETE CATEGORY
  const deleteCategory = async categoryId => {
    try {
      await apiDelete(`/menu/category/delete/${categoryId}`);
      getCategories();
    } catch (err) {
      console.log('Delete category error:', err);
    }
  };

  // ADD MENU ITEM
  const addMenuItem = async () => {
    if (!menuName || !menuPrice || !selectedCategoryId) return;

    try {
      const form = new FormData();
      form.append('shopId', shopId);
      form.append('categoryId', selectedCategoryId);
      form.append('name', menuName);
      form.append('description', menuDesc);
      form.append('type', menuType);
      form.append('price', Number(menuPrice));
      form.append('offerPrice', Number(menuOffer));
      form.append('quantityOptions', JSON.stringify(quantityOptions));

      if (menuImage) form.append('image', menuImage);

      await apiPost('/menu/item/add', form, {}, true);

      setAddMenuModal(false);
      resetInputs();
      getCategories();
    } catch (err) {
      console.log('Add item error:', err);
    }
  };

  // DELETE MENU ITEM
  const deleteMenuItem = async itemId => {
    try {
      await apiDelete(`/menu/item/delete/${itemId}`);
      getCategories();
    } catch (err) {
      console.log('Delete item error:', err);
    }
  };

  // OPEN EDIT MODAL
  const openEditModal = (item, catId) => {
    setMenuIdToEdit(item?._id);
    setSelectedCategoryId(catId);

    setMenuName(item?.name);
    setMenuDesc(item?.description);
    setMenuType(item?.type);
    setMenuPrice(String(item?.price));
    setMenuOffer(String(item?.offerPrice));
    setQuantityOptions(item?.quantityOptions || []);

    setMenuImage(null); // new image to upload
    setEditMenuModal(true);
  };

  // UPDATE MENU ITEM
  const updateMenuItem = async () => {
    try {
      const form = new FormData();
      form.append('name', menuName);
      form.append('description', menuDesc);
      form.append('type', menuType);
      form.append('price', Number(menuPrice));
      form.append('offerPrice', Number(menuOffer));
      form.append('quantityOptions', JSON.stringify(quantityOptions));

      if (menuImage) form.append('image', menuImage);

      await apiPost(`/menu/item/edit/${menuIdToEdit}`, form, {}, true);

      setEditMenuModal(false);
      resetInputs();
      getCategories();
    } catch (err) {
      console.log('Update item error:', err);
    }
  };

  // HELPERS
  const addQuantityOption = () => {
    setQuantityOptions([...quantityOptions, { label: '', price: '' }]);
  };

  const updateQuantityOption = (index, key, value) => {
    const arr = [...quantityOptions];
    arr[index][key] = value;
    setQuantityOptions(arr);
  };

  const resetInputs = () => {
    setMenuName('');
    setMenuDesc('');
    setMenuType('veg');
    setMenuPrice('');
    setMenuOffer('');
    setSelectedCategoryId('');
    setQuantityOptions([]);
    setMenuImage(null);
  };

  // ---------------- UI ----------------
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Menu Categories</Text>

        {categories?.map(cat => (
          <View key={cat?._id} style={styles.categoryWrapper}>
            {/* Neumorphic category card */}
            <View style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryLeft}>
                  <View style={styles.iconWrapper}>
                    {cat?.icon ? (
                      <Image
                        source={{ uri: `${BACKEND_URL}/${cat.icon}` }}
                        style={styles.categoryIcon}
                      />
                    ) : (
                      <View style={styles.categoryIconPlaceholder}>
                        <Text style={styles.placeholderText}>
                          {cat?.name?.[0]?.toUpperCase() || 'C'}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.categoryName}>{cat?.name}</Text>
                    {
                      cat?.itemCount > 0 ? 
                      <Text style={styles.categorySub}>
                      {cat?.itemCount} items
                    </Text>
                      : 
                      <Text style={styles.noItem}>No items yet</Text>
                    }
                
                  </View>
                </View>

                <View style={styles.actionsRight}>
                  <TouchableOpacity
                    style={styles.viewBtn}
                    onPress={() =>
                      navigation.navigate(NavigationStrings.ViewItems, {
                        catId: cat?._id,
                      })
                    }
                  >
                    <Text style={styles.viewBtnText}>View</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => deleteCategory(cat?._id)}
                  >
                    <Text style={styles.iconBtnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Items list (neumorphic item cards) */}
           
            </View>
          </View>
        ))}

        {/* Bottom Buttons */}
        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => setAddCatModal(true)}
          >
            <Text style={styles.primaryBtnText}>+ Add Category</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => setAddMenuModal(true)}
          >
            <Text style={styles.secondaryBtnText}>+ Add Menu Item</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ADD CATEGORY MODAL */}
      <Modal transparent visible={addCatModal} animationType="slide">
        <View style={{ flex: 1, zIndex: 999, elevation: 999 }}>
          <TouchableWithoutFeedback onPress={() => setAddCatModal(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>

          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Category</Text>

            <TouchableOpacity style={styles.uploadBtn} onPress={pickIcon}>
              <Text style={styles.uploadText}>
                {iconFile ? 'Icon Selected' : 'Upload Icon'}
              </Text>
            </TouchableOpacity>

            {iconFile && (
              <Image
                source={{ uri: iconFile.uri }}
                style={styles.previewImage}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Category Name"
              value={newCatName}
              onChangeText={setNewCatName}
              placeholderTextColor="#9aa0a6"
            />

            <TouchableOpacity
              disabled={addCategoryLoaidng}
              style={styles.saveBtn}
              onPress={addCategory}
            >
              {addCategoryLoaidng ? (
                <ActivityIndicator size={'small'} color={'#fff'} />
              ) : (
                <Text style={styles.saveText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ADD MENU ITEM MODAL */}
      <Modal transparent visible={addMenuModal} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setAddMenuModal(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <ScrollView style={styles.modalContentLarge}>
          <Text style={styles.modalTitle}>Add Menu Item</Text>

          <TouchableOpacity style={styles.uploadBtn} onPress={pickMenuImage}>
            <Text style={styles.uploadText}>
              {menuImage ? 'Image Selected' : 'Upload Image'}
            </Text>
          </TouchableOpacity>

          {menuImage && (
            <Image
              source={{ uri: menuImage.uri }}
              style={styles.previewImage}
            />
          )}

          <Text style={styles.label}>Select Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 12 }}
          >
            {categories?.map(cat => (
              <TouchableOpacity
                key={cat?._id}
                onPress={() => setSelectedCategoryId(cat?._id)}
                style={[
                  styles.categorySelect,
                  selectedCategoryId === cat?._id && styles.categoryActive,
                ]}
              >
                <Text
                  style={[
                    styles.categorySelectText,
                    selectedCategoryId === cat?._id && { color: '#fff' },
                  ]}
                >
                  {cat?.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TextInput
            style={styles.input}
            placeholder="Item Name"
            value={menuName}
            onChangeText={setMenuName}
            placeholderTextColor="#9aa0a6"
          />

          <TextInput
            style={[styles.input, { height: 90 }]}
            placeholder="Description"
            value={menuDesc}
            onChangeText={setMenuDesc}
            multiline
            placeholderTextColor="#9aa0a6"
          />

          <Text style={styles.label}>Type</Text>
          <View style={styles.typeRow}>
            {['veg', 'nonveg'].map(t => (
              <TouchableOpacity
                key={t}
                onPress={() => setMenuType(t)}
                style={[styles.typeBtn, menuType === t && styles.typeActive]}
              >
                <Text
                  style={[styles.typeText, menuType === t && { color: '#fff' }]}
                >
                  {t.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Price"
            value={menuPrice}
            keyboardType="numeric"
            onChangeText={setMenuPrice}
            placeholderTextColor="#9aa0a6"
          />

          <TextInput
            style={styles.input}
            placeholder="Offer Price"
            value={menuOffer}
            keyboardType="numeric"
            onChangeText={setMenuOffer}
            placeholderTextColor="#9aa0a6"
          />

          <Text style={styles.label}>Quantity Options</Text>
          {quantityOptions.map((opt, idx) => (
            <View key={idx} style={styles.qtyRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                placeholder="Half / Full"
                value={opt.label}
                onChangeText={v => updateQuantityOption(idx, 'label', v)}
                placeholderTextColor="#9aa0a6"
              />
              <TextInput
                style={[styles.input, { width: 100 }]}
                placeholder="Price"
                value={opt.price}
                keyboardType="numeric"
                onChangeText={v => updateQuantityOption(idx, 'price', v)}
                placeholderTextColor="#9aa0a6"
              />
            </View>
          ))}

          <TouchableOpacity
            style={styles.addQtyBtn}
            onPress={addQuantityOption}
          >
            <Text style={styles.addQtyText}>+ Add Quantity Option</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveBtn} onPress={addMenuItem}>
            <Text style={styles.saveText}>Save Item</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>

      {/* EDIT MENU ITEM MODAL */}
      <Modal transparent visible={editMenuModal} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setEditMenuModal(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <ScrollView style={styles.modalContentLarge}>
          <Text style={styles.modalTitle}>Edit Menu Item</Text>

          <TouchableOpacity style={styles.uploadBtn} onPress={pickMenuImage}>
            <Text style={styles.uploadText}>
              {menuImage ? 'Change Image' : 'Upload New Image'}
            </Text>
          </TouchableOpacity>

          {menuImage && (
            <Image
              source={{ uri: menuImage.uri }}
              style={styles.previewImage}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Item Name"
            value={menuName}
            onChangeText={setMenuName}
            placeholderTextColor="#9aa0a6"
          />

          <TextInput
            style={[styles.input, { height: 90 }]}
            placeholder="Description"
            multiline
            value={menuDesc}
            onChangeText={setMenuDesc}
            placeholderTextColor="#9aa0a6"
          />

          <Text style={styles.label}>Type</Text>
          <View style={styles.typeRow}>
            {['veg', 'nonveg'].map(t => (
              <TouchableOpacity
                key={t}
                onPress={() => setMenuType(t)}
                style={[styles.typeBtn, menuType === t && styles.typeActive]}
              >
                <Text
                  style={[styles.typeText, menuType === t && { color: '#fff' }]}
                >
                  {t.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Price"
            keyboardType="numeric"
            value={menuPrice}
            onChangeText={setMenuPrice}
            placeholderTextColor="#9aa0a6"
          />

          <TextInput
            style={styles.input}
            placeholder="Offer Price"
            keyboardType="numeric"
            value={menuOffer}
            onChangeText={setMenuOffer}
            placeholderTextColor="#9aa0a6"
          />

          <Text style={styles.label}>Quantity Options</Text>
          {quantityOptions.map((opt, idx) => (
            <View key={idx} style={styles.qtyRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                placeholder="Half / Full"
                value={opt.label}
                onChangeText={v => updateQuantityOption(idx, 'label', v)}
                placeholderTextColor="#9aa0a6"
              />
              <TextInput
                style={[styles.input, { width: 100 }]}
                placeholder="Price"
                value={opt.price}
                keyboardType="numeric"
                onChangeText={v => updateQuantityOption(idx, 'price', v)}
                placeholderTextColor="#9aa0a6"
              />
            </View>
          ))}

          <TouchableOpacity
            style={styles.addQtyBtn}
            onPress={addQuantityOption}
          >
            <Text style={styles.addQtyText}>+ Add Quantity Option</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveBtn} onPress={updateMenuItem}>
            <Text style={styles.saveText}>Update Item</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
};

export default ShopMenuManager;

// ----------------------- STYLES -----------------------

const SHADOW = Platform.select({
  ios: {
    shadowColor: '#bfcfd9',
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  android: {
    elevation: 3,
  },
});

const INSET_SHADOW = Platform.select({
  ios: {
    shadowColor: '#d3dce2',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  android: {
    elevation: 1,
  },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#eef3f6' },

  scrollContainer: {
    padding: 18,
    paddingBottom: 40,
  },

  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1f3640',
    marginBottom: 16,
  },

  categoryWrapper: {
    marginBottom: 16,
  },

  // Neumorphic category card
  categoryCard: {
    backgroundColor: '#eef3f6',
    borderRadius: 16,
    padding: 14,
    // outer soft shadow
    ...SHADOW,
    // subtle inner look by layering a light inner container
    borderColor: '#e6eef2',
    borderWidth: 1,
  },

  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#f6fafb',
    alignItems: 'center',
    justifyContent: 'center',
    ...INSET_SHADOW,
  },

  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },

  categoryIconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f0f6f7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderText: {
    color: '#9aa0a6',
    fontWeight: '700',
    fontSize: 20,
  },

  categoryName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#14323a',
  },

  categorySub: {
    color: '#6d7b81',
    marginTop: 4,
    fontSize: 13,
  },

  actionsRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 64,
  },

  viewBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#2b9bf4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  viewBtnText: { color: '#fff', fontWeight: '700' },

  iconBtn: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#f2dede',
  },

  iconBtnText: { color: '#c62828', fontWeight: '700' },

  // Items list
  itemsList: { marginTop: 12 },

  itemCard: {
    backgroundColor: '#f8fbfc',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // soft shadow
    ...SHADOW,
  },

  itemImageWrap: {
    width: 78,
    height: 78,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    ...INSET_SHADOW,
  },

  itemImage: {
    width: 74,
    height: 74,
    borderRadius: 10,
  },

  itemImagePlaceholder: {
    width: 74,
    height: 74,
    borderRadius: 10,
    backgroundColor: '#f0f6f7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '800', color: '#123033' },
  itemDesc: { color: '#6b7b80', marginTop: 4, fontSize: 13 },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  itemPrice: { fontSize: 15, fontWeight: '800', color: '#0b5b52' },
  offerPrice: {
    fontSize: 13,
    color: '#8fbf9b',
    marginLeft: 8,
    textDecorationLine: 'line-through',
  },

  badge: {
    marginLeft: 10,
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  vegBadge: {
    color: '#2e7d32',
  },

  nonvegBadge: {
    color: '#c62828',
  },

  itemActions: {
    marginLeft: 10,
    alignItems: 'flex-end',
  },

  smallBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#eef7ff',
    marginBottom: 8,
  },

  smallBtnText: { color: '#0b6bd8', fontWeight: '700' },

  removeBtn: {
    backgroundColor: '#fff6f6',
    borderColor: '#f4dede',
    borderWidth: 1,
  },

  noItem: {
    color: '#7d8b8f',
    fontStyle: 'italic',
    marginTop: 8,
    paddingLeft: 6,
  },

  // Bottom
  bottomRow: {
    flexDirection: 'row',
    marginTop: 22,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  primaryBtn: {
    flex: 1,
    backgroundColor: '#2b9bf4',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginRight: 8,
    ...SHADOW,
  },

  primaryBtnText: { color: '#fff', fontWeight: '800' },

  secondaryBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#e2eef6',
    ...INSET_SHADOW,
  },

  secondaryBtnText: { color: '#1f3640', fontWeight: '800' },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000050',
  },

  modalContent: {
    backgroundColor: '#eef3f6',
    padding: 18,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    elevation: 50, // add this
    zIndex: 999,
  },

  modalContentLarge: {
    backgroundColor: '#eef3f6',
    padding: 18,
    maxHeight: '85%',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#123033',
    marginBottom: 10,
  },

  uploadBtn: {
    backgroundColor: '#f0f7fb',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5f0f6',
  },

  uploadText: { color: '#1b6fb0', fontWeight: '700' },

  previewImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginBottom: 12,
    alignSelf: 'center',
  },

  input: {
    backgroundColor: '#f6fbfc',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e6eef2',
    color: '#1b2b2e',
  },

  saveBtn: {
    backgroundColor: '#0b6bd8',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },

  saveText: { color: '#fff', fontWeight: '800' },

  label: { fontSize: 14, fontWeight: '800', marginBottom: 6, color: '#123033' },

  categorySelect: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f0f7fb',
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5f0f6',
  },

  categoryActive: { backgroundColor: '#2b9bf4' },

  categorySelectText: { fontSize: 14, color: '#123033', fontWeight: '700' },

  typeRow: { flexDirection: 'row', marginVertical: 10 },

  typeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginRight: 10,
    borderColor: '#d9eaf7',
    backgroundColor: '#f6fbfc',
  },

  typeActive: { backgroundColor: '#2b9bf4' },

  typeText: { color: '#2b9bf4', fontWeight: '800' },

  qtyRow: { flexDirection: 'row', marginBottom: 8 },

  addQtyBtn: {
    backgroundColor: '#fff',
    padding: 10,
    marginTop: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6eef2',
    alignItems: 'center',
  },

  addQtyText: { textAlign: 'center', fontWeight: '800', color: '#123033' },
});
