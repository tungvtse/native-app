import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Modal,
    Pressable,
    FlatList,
    StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLOURS, Items } from '../data/database';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';

const FavoriteList = ({ navigation }) => {
    const [product, setProduct] = useState([]);
    const [isVisibleModal, setIsVisibleModal] = useState(false);
    const [isVisibleModalDeleteAll, setIsVisibleModalDeleteAll] = useState(false);
    const [selectedProductID, setSelectedProductID] = useState(null);

    const toggleModalDeleteAll = () => {
        setIsVisibleModalDeleteAll(!isVisibleModalDeleteAll);
    }


    const toggleModal = (id) => {
        setIsVisibleModal(!isVisibleModal);
        console.log(isVisibleModal);
        setSelectedProductID(id);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getDataFromDB();
        });

        return unsubscribe;
    }, [navigation]);

    //get data from local DB by ID
    const getDataFromDB = async () => {
        let items = await AsyncStorage.getItem('cartItems');
        items = JSON.parse(items);
        let productData = [];
        if (items) {
            Items.forEach(data => {
                if (items.includes(data.id)) {
                    productData.push(data);
                    return;
                }
            });
            setProduct(productData);
        } else {
            setProduct(false);
        }
    };

    const handleClearAll = async () => {
        console.log("clicked");
        let itemArray = await AsyncStorage.getItem('cartItems');
        itemArray = JSON.parse(itemArray);
        if (itemArray) {
            let array = [];
            await AsyncStorage.setItem('cartItems', JSON.stringify(array));
            getDataFromDB();
        }
    }

    //remove data from Cart

    const removeItemFromCart = async id => {
        let itemArray = await AsyncStorage.getItem('cartItems');
        itemArray = JSON.parse(itemArray);
        if (itemArray) {
            let array = itemArray;
            for (let index = 0; index < array.length; index++) {
                if (array[index] == id) {
                    array.splice(index, 1);
                }

                await AsyncStorage.setItem('cartItems', JSON.stringify(array));
                getDataFromDB();
            }
        }
    };

    //checkout

    const ModalConfirm = ({ id }) => {
        return (
            <Modal animationType="fade"
                transparent={true}
                visible={isVisibleModal}
            >
                <View style={{
                    margin: 20,
                    marginTop: '80%',
                    backgroundColor: 'white',
                    borderRadius: 20,
                    padding: 35,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                    height: 140,

                }}>
                    <Text>Do you want to delete this item?</Text>
                    <View style={{
                        flexDirection: 'row',
                        gap: 15,
                        marginTop: 16
                    }} >

                        <Pressable
                            style={{
                                width: 70,
                                borderRadius: 20,
                                alignItems: 'center',
                                padding: 10,
                                elevation: 2,
                                backgroundColor: '#2196F3',

                            }}
                            onPress={() => {
                                removeItemFromCart(id);
                                console.log(id);
                                setIsVisibleModal(false);
                            }}
                        >
                            <Text >Yes</Text>
                        </Pressable>
                        <Pressable
                            style={{
                                borderRadius: 20,
                                width: 70,
                                alignItems: 'center',
                                padding: 10,
                                elevation: 2,
                                backgroundColor: '#2196F3',

                            }}
                            onPress={() => {
                                setIsVisibleModal(false);
                            }}
                        >
                            <Text >No</Text>
                        </Pressable>
                    </View>

                </View>
            </Modal>
        )
    }

    const ModalDeleteAll = () => {
        return (
            <Modal animationType="fade"
                transparent={true}
                visible={isVisibleModalDeleteAll}
            >
                <View style={styles.modal}>
                    <Text>Do you want to clear the list?</Text>
                    <View style={{
                        flexDirection: 'row',
                        gap: 15,
                        marginTop: 16
                    }} >

                        <Pressable
                            style={styles.buttonModal}
                            onPress={() => {
                                handleClearAll();
                                setIsVisibleModalDeleteAll(false);
                            }}
                        >
                            <Text >Yes</Text>
                        </Pressable>
                        <Pressable
                            style={styles.buttonModal}
                            onPress={() => {
                                setIsVisibleModalDeleteAll(false);
                            }}
                        >
                            <Text >No</Text>
                        </Pressable>
                    </View>

                </View>
            </Modal>
        )
    }

    const RenderProducts = ({ data }) => {
        return (
            <TouchableOpacity
                key={data.key}
                onPress={() => navigation.navigate('Detail', { productID: data.id })}
                style={styles.item}>
                <View
                    style={styles.itemImage}>
                    <Image
                        source={data.productImage}
                        style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'contain',
                        }}
                    />
                </View>
                <View
                    style={{
                        flex: 1,
                        height: '100%',
                        justifyContent: 'space-around',
                    }}>
                    <View>
                        <Text
                            style={styles.itemName}>
                            {data.productName}
                        </Text>

                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>


                        </View>
                        <TouchableOpacity onPress={() => toggleModal(data.id)}>
                            <MaterialCommunityIcons
                                name="delete-outline"
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                {isVisibleModal && <ModalConfirm id={selectedProductID} />}
                {isVisibleModalDeleteAll && <ModalDeleteAll />}

            </TouchableOpacity>
        );
    };

    return (
        <View
            style={{
                padding: 16,
                height: '100%',
                backgroundColor: COLOURS.white
            }}
        >
            <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    paddingTop: 16,
                    paddingHorizontal: 16,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons
                        name="chevron-left"
                        style={{
                            fontSize: 18,
                            color: COLOURS.backgroundDark,
                            padding: 12,
                            backgroundColor: COLOURS.backgroundLight,
                            borderRadius: 12,
                        }}
                    />
                </TouchableOpacity>
                <View>
                    <Text
                        style={{
                            fontSize: 24,
                            color: COLOURS.black,
                            fontWeight: '500',
                            letterSpacing: 1,
                        }}>Favorite List</Text>
                </View>
                <View></View>
            </View>
            {product.length > 0 && (
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >


                    <TouchableOpacity
                        onPress={() => toggleModalDeleteAll()}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                color: COLOURS.black,
                                fontWeight: '500',
                                letterSpacing: 1,
                                padding: 18
                            }}
                        >
                            Clear All
                        </Text>
                    </TouchableOpacity>

                </View>
            )}
            {product.length == 0 && (
                <View

                    style={{
                        alignItems: 'center',
                        justifyContent: "center",
                        marginTop: '30%'
                    }}>
                    <Entypo
                        onPress={() => {
                            navigation.goBack();
                        }}
                        name="add-to-list"
                        style={{
                            fontSize: 140,

                            color: COLOURS.backgroundDark,
                            padding: 8,
                            borderRadius: 100,
                        }}
                    />
                    <Text style={{
                        fontSize: 24,
                        color: COLOURS.backgroundDark
                    }}>
                        Nothing in the list, add more!!
                    </Text>
                </View>
            )}
            <FlatList
                data={product}
                renderItem={({ item }) => <RenderProducts data={item} />}
                style={{
                    marginBottom: 16
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    modal: {
        margin: 20,
        marginTop: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: 140,
    },
    buttonModal: {
        borderRadius: 20,
        width: 70,
        alignItems: 'center',
        padding: 10,
        elevation: 2,
        backgroundColor: '#2196F3',

    },
    item: {
        width: '100%',
        height: 100,
        marginVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemImage: {
        width: '30%',
        height: 100,
        padding: 14,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOURS.backgroundLight,
        borderRadius: 10,
        marginRight: 22,
    },
    itemName: {
        fontSize: 14,
        maxWidth: '100%',
        color: COLOURS.black,
        fontWeight: '600',
        letterSpacing: 1,
    },
    icon: {
        fontSize: 16,
        color: COLOURS.backgroundDark,
        backgroundColor: COLOURS.backgroundLight,
        padding: 8,
        borderRadius: 100,
    }
})

export default FavoriteList;