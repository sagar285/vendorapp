import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import FullwidthButton from '../Components/FullwidthButton';
import { COLORS } from '../Theme/Colors';
import { wp, hp } from '../Theme/Dimensions';
import { FONTS } from '../Theme/FontFamily';
import EditAddMenuiIemModal from '../Components/EditAddMenuiIemModal';
import { apiDelete, apiGet, BACKEND_URL } from '../Api/Api';
import { AddMenu } from '../screen';
import NavigationStrings from '../Navigations/NavigationStrings';
import CategoryModal from '../Components/CategoryModal';
import { useFocusEffect } from '@react-navigation/native';
const CategoryMenu = ({ navigation, route }) => {
  const shopId = route.params.shopId;
  const [categories, setCategories] = useState([
    { id: 1, name: 'Category Name #1', items: 0 },
    { id: 2, name: 'Category Name #2', items: 2 },
    { id: 3, name: 'Category Name #3', items: 11 },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [catmodalVisible, setcatModalVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // console.log(hhhhhh);

  const getCategories = async () => {
    try {
      const res = await apiGet(`/menu/category/${shopId}`);
      console.log(res, 'categoriesssss');
      setCategories(res?.categories || []);
    } catch (err) {
      console.log('Get category error:', err);
    }
  };

  const addMenuItem = id => {
    setSelectedCategoryId(id);
    setModalVisible(true);
  };

  useFocusEffect(
    useCallback(() => {
      getCategories();
    }, []),
  );

   const deleteCategory = async categoryId => {
        try {
          await apiDelete(`/menu/category/delete/${categoryId}`);
          getCategories()
        } catch (err) {
          console.log('Delete category error:', err);
        }
      };

  const onClose = () => {
    getCategories();
    setcatModalVisible(false);
  };

  const onCloseItem = () => {
    getCategories();
    setModalVisible(false);
  };

  const renderCategoryItem = ({ item }) => (
    <View style={styles.categoryCard}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(NavigationStrings.DNT_Categoris, {
            category: item,
            shopId:shopId
          })
        }
        style={styles.categoryContent}
      >
        {/* Gray Background Box */}
        <View style={styles.CategoryiconContainer}>
          <Image
            source={{ uri: `${BACKEND_URL}/${item.icon}` }}
            style={styles.categoryIcon}
            resizeMode="cover"
          />
        </View>

        {/* Text Section */}
        <View style={styles.categoryTextContainer}>
          <Text style={styles.categoryName}>{item.name}</Text>
          <Text style={styles.categoryItems}>
            {item.itemCount === 0
              ? 'No Items'
              : `${item.itemCount} ${item.itemCount === 1 ? 'Item' : 'Items'}`}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.categoryActions}>
        <TouchableOpacity
          onPress={() => addMenuItem(item._id)}
          style={styles.addItemsButton}
        >
          <Text style={styles.addItemsText}>+ Add Items</Text>
        </TouchableOpacity>
        <TouchableOpacity
        onPress={()=>deleteCategory(item._id)}
        style={styles.menuButtonContainer}>
          <Image
            source={require('../assets/images/Delete.png')}
            style={styles.menuIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Custom Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonContainer}
        >
          <Image
            source={require('../assets/images/LeftArrow.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories & Menu</Text>
        <View style={styles.emptyView} />
      </View>

      {/* Categories List */}
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        // keyExtractor={(item) => item.id.toString()}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      {/* Bottom Button */}
      <View style={styles.footer}>
        <FullwidthButton
          title="Add Category"
          onPress={() => setcatModalVisible(true)}
        />
      </View>
      <EditAddMenuiIemModal
        visible={modalVisible}
        onClose={() => onCloseItem()}
        title="Your Title"
        selectedCategoryId={selectedCategoryId}
        shopId={shopId}
      />

      <CategoryModal
        visible={catmodalVisible}
        onClose={() => onClose()}
        title="Your Title"
        shopId={shopId}
      />
    </View>
  );
};

export default CategoryMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: wp(4), // Increased slightly for side margins
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(2.5),
  },
  backButtonContainer: {
    padding: wp(1),
  },
  backIcon: {
    width: wp(6),
    height: wp(6),
  },
  headerTitle: {
    fontSize: wp(4.5),
    color: COLORS.BlackText,
    textAlign: 'center',
    fontFamily: FONTS.InterSemiBold,
  },
  emptyView: {
    width: wp(6),
  },
  listContainer: {
    paddingTop: hp(1),
    paddingBottom: hp(2),
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Removed horizontal padding here to align strictly with the edges
    paddingVertical: hp(1),
    marginBottom: hp(1.5),
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  // --- UPDATED SECTION ---
  CategoryiconContainer: {
    backgroundColor: COLORS.CategoryIconBg || '#F6F8fa', // Fallback color if undefined
    width: wp(13), // Fixed width for perfect square
    height: wp(13), // Fixed height for perfect square
    borderRadius: wp(3.5), // Rounded corners
    justifyContent: 'center', // Center vertical
    alignItems: 'center', // Center horizontal
    marginRight: wp(3.5), // Space between box and text
  },
  categoryIcon: {
    width: wp(13),
    height: wp(13),
    borderRadius: wp(3.5),
    // tintColor: '#202020', // Ensures icon is dark gray/black
  },
  // -----------------------
  categoryTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: wp(4),
    fontFamily: FONTS.InterSemiBold,
    color: COLORS.BlackText,
    marginBottom: hp(0.5),
  },
  categoryItems: {
    fontSize: wp(3.2),
    fontFamily: FONTS.InterRegular,
    color: '#999999',
  },
  categoryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  addItemsButton: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    backgroundColor: COLORS.Blue10 || '#E8F1FF', // Fallback light blue
    borderRadius: wp(100),
  },
  addItemsText: {
    fontSize: wp(3),
    fontFamily: FONTS.InterSemiBold,
    color: '#2B7FFF',
  },
  menuButtonContainer: {
    padding: wp(1.5),
  },
  menuIcon: {
    width: wp(4),
    height: wp(4),
    tintColor: '#FF5C40', // Usually gray in these designs
  },
  footer: {
    paddingBottom: hp(9),
    marginTop: 'auto',
  },
});
