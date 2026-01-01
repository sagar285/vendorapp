import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../Theme/Colors';
import { wp, hp } from '../Theme/Dimensions';
import { FONTS } from '../Theme/FontFamily';
import EditMenuItemModal from '../Components/EditMenuItemModal';
import { apiDelete, apiGet, BACKEND_URL } from '../Api/Api';
import EditCtegoryModal from '../Components/EditCtegoryModal';

const CategoryDetails = ({ navigation, route }) => {
  const category = route.params.category;
  const shopId = route.params.shopId;
  const catId = category._id;
  // console.log(category,"category")
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [catmodalVisible, setcatModalVisible] = useState(false);
  const [editItem, seteditItem] = useState(null);
  const [categoryInfo,setcategoryInfo] =useState(null);



  const getCategory =async() =>{
    const result = await apiGet(`/menu/category/getCat/${catId}`);
    console.log(result,"klddjkjdsfjkdsfjkdsdkjfh")
    if(result.category){
      setcategoryInfo(result.category)
    }
  }

  useEffect(()=>{
    getCategory();
  },[])

  const deleteCategory = async categoryId => {
    try {
      await apiDelete(`/menu/category/delete/${catId}`);
      navigation.goBack();
    } catch (err) {
      console.log('Delete category error:', err);
    }
  };

  const fetchItems = async () => {
    try {
     
      setLoading(true);
      const res = await apiGet(`/menu/item/${catId}`);
      console.log(res, 'res piGet(`/menu/item/${catId}`)');
      setItems(res?.items || []);
    } catch (err) {
      setError('Unable to load items.');
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    fetchItems();
    setcatModalVisible(false);
  };

  useEffect(() => {
    fetchItems();
  }, [catId]);

  const createAt = new Date(categoryInfo?.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    dateStyle: 'short',
  });
  const updatedAt = new Date(categoryInfo?.updatedAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    dateStyle: 'short',
  });

  const deleteItems = itemId => {
    Alert.alert('Delete Item', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiDelete(`/menu/item/delete/${itemId}`);
            setItems(prev => prev.filter(i => i._id !== itemId));
          } catch (error) {
            console.log(error);
          }
        },
      },
    ]);
  };

  const [modalVisible, setModalVisible] = useState(false);

  const openEditModal = item => {
    seteditItem(item);
    setModalVisible(true);
  };

  const renderHeader = () => (
    <View>
      <View style={styles.topDetailsContainer}>
        <View style={styles.bigIconContainer}>
          <Image
            source={{uri:`${BACKEND_URL}/${categoryInfo?.icon}`}}
            style={styles.bigCategoryIcon}
            resizeMode="cover"
          />
        </View>

        <View style={styles.detailsColumn}>
          <View style={styles.titleRow}>
            <Text style={styles.detailTitle}>{categoryInfo?.name}</Text>
            <TouchableOpacity
              onPress={deleteCategory}
              style={styles.deleteButton}
            >
              <Image
                source={require('../assets/images/Delete.png')}
                style={styles.deleteIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.metaText}>
            Created on <Text style={styles.metaTextBold}>{createAt}</Text>
          </Text>
          <Text style={styles.metaText}>
            Modified on <Text style={styles.metaTextBold}>{updatedAt}</Text>
          </Text>
          <Text style={styles.metaText}>
            Total Menu Items :{' '}
            <Text style={styles.metaTextBold}>{items?.length}</Text>
          </Text>

          <TouchableOpacity
            onPress={() => setcatModalVisible(true)}
            style={styles.editCategoryBtn}
          >
            <Text style={styles.editCategoryBtnText}>Edit Category</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Menu Items</Text>
    </View>
  );

  const renderMenuItem = ({ item }) => (
    <View style={styles.menuItemCard}>
      <View style={styles.menuIconContainer}>
        <Image
          source={{ uri: `${BACKEND_URL}/${item.image}` }}
          style={styles.smallMenuIcon}
          resizeMode="cover"
        />
      </View>

      <View style={styles.menuTextContainer}>
        <Text style={styles.menuItemName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.offerpriceText}>₹{item?.realprice}</Text>
            <Text style={styles.priceText}>₹{item?.price}</Text>
          </View>
          <View
            style={[
              styles.dotSeparator,
              { backgroundColor: item.type == 'veg' ? 'green' : 'red' },
            ]}
          />
          <Text style={styles.typeText}>
            {item?.type == 'nonveg' ? 'Non-Veg' : 'Veg'}
          </Text>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.pillEditButton}
          onPress={() => openEditModal(item)}
        >
          <Image
            source={require('../assets/images/Pen.png')}
            style={styles.pillIcon}
            resizeMode="contain"
          />
          <Text style={styles.pillEditText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => deleteItems(item._id)}
          style={styles.moreButton}
        >
          <Image
            source={require('../assets/images/Delete.png')}
            style={styles.threeDotIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
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
        <Text style={styles.headerTitle}>Category</Text>
        <View style={styles.emptyView} />
      </View>

      <FlatList
        data={items}
        renderItem={renderMenuItem}
        keyExtractor={item => item._id.toString()}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      <EditMenuItemModal
        visible={modalVisible}
        item={editItem}
        shopId={shopId}
        categoryId={catId}
        onClose={() => {
          setModalVisible(false);
          fetchItems();
        }}
      />

      <EditCtegoryModal
        visible={catmodalVisible}
        category={categoryInfo}
        onClose={() => {
          setcatModalVisible(false);
          fetchItems();
          getCategory()
        }}
      />
    </View>
  );
};

export default CategoryDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: wp(4),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(2.5),
  },
  backButtonContainer: { padding: wp(1) },
  backIcon: { width: wp(6), height: wp(6) },
  headerTitle: {
    fontSize: wp(4.5),
    color: COLORS.BlackText,
    fontFamily: FONTS.InterSemiBold,
  },
  emptyView: { width: wp(6) },

  topDetailsContainer: {
    flexDirection: 'row',
    marginBottom: hp(3),
    marginTop: hp(1),
  },
  bigIconContainer: {
    width: wp(28),
    height: wp(28),
    backgroundColor: '#F6F8FA',
    borderRadius: wp(4),
    // justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(4),
  },
  bigCategoryIcon: {
    width: wp(28),
    height: wp(28),
    borderRadius: wp(4),
    resizeMode:"contain"
    // tintColor: '#202020',
  },
  detailsColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(0.5),
  },
  detailTitle: {
    fontSize: wp(4.2),
    fontFamily: FONTS.InterSemiBold,
    color: COLORS.BlackText,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
    padding: wp(1.5),
    borderRadius: wp(100),
    marginLeft: wp(2),
  },
  deleteIcon: {
    width: wp(4),
    height: wp(4),
    tintColor: '#FF5C40',
  },
  metaText: {
    fontSize: wp(3),
    fontFamily: FONTS.InterRegular,
    color: '#888888',
    marginBottom: hp(0.3),
  },
  metaTextBold: {
    fontFamily: FONTS.InterSemiBold,
    color: '#444',
  },
  editCategoryBtn: {
    backgroundColor: '#FF5630',
    paddingVertical: hp(1),
    borderRadius: wp(2),
    alignItems: 'center',
    marginTop: hp(1.5),
    width: '100%',
  },
  editCategoryBtnText: {
    color: '#FFF',
    fontSize: wp(3.5),
    fontFamily: FONTS.InterMedium,
  },

  sectionTitle: {
    fontSize: wp(3.8),
    color: '#999',
    fontFamily: FONTS.InterRegular,
    marginBottom: hp(2),
  },

  listContainer: {
    paddingBottom: hp(5),
  },
  menuItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2.5),
  },
  menuIconContainer: {
    width: wp(13),
    height: wp(13),
    borderRadius: wp(3),
    backgroundColor: '#F6F8FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3.5),
  },
  smallMenuIcon: {
    width: wp(13),
    height: wp(13),
    borderRadius: wp(3),
    // tintColor: '#202020',
  },
  menuTextContainer: {
    flex: 1,
    paddingRight: wp(2),
  },
  menuItemName: {
    fontSize: wp(3.8),
    fontFamily: FONTS.InterSemiBold,
    color: COLORS.BlackText,
    marginBottom: hp(0.5),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: wp(3.5),
    color: '#666',
    fontFamily: FONTS.InterMedium,
    textDecorationLine: 'line-through',
  },
  offerpriceText: {
    fontSize: wp(3.5),
    color: '#666',
    fontFamily: FONTS.InterMedium,
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF5630',
    marginHorizontal: wp(2),
  },
  typeText: {
    fontSize: wp(3.5),
    color: '#888',
    fontFamily: FONTS.InterRegular,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillEditButton: {
    backgroundColor: '#E8F1FF',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: wp(100),
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp(2),
  },
  pillIcon: {
    width: wp(3),
    height: wp(3),
    marginRight: wp(1.5),
    tintColor: '#2B7FFF',
  },
  pillEditText: {
    color: '#2B7FFF',
    fontSize: wp(3),
    fontFamily: FONTS.InterMedium,
  },
  moreButton: {
    padding: wp(1),
    backgroundColor: COLORS.orange10,
    borderRadius: 100,
  },
  threeDotIcon: {
    width: wp(1),
    height: wp(4),
    paddingHorizontal: wp(2),
    tintColor: COLORS.orange,
  },
});
