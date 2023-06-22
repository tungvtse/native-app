import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Pressable, Modal, ToastAndroid, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Items, COLOURS } from '../data/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';

const HomeScreen = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [cart, setCart] = useState([]);
    const [isVisibleModal, setIsVisibleModal] = useState(false);
    const [selectedProductID, setSelectedProductID] = useState(null);

    const toggleModal = (id) => {
        setIsVisibleModal(!isVisibleModal);
        setSelectedProductID(id);
    };


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getDataFromDB();
            getCartData();

        });

        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        getCartData();

    }, [cart], [navigation])

    const getDataFromDB = () => {
        setData(Items);
    };

    const getCartData = async () => {
        let itemArray = await AsyncStorage.getItem('cartItems');
        console.log(itemArray);
        setCart(itemArray);
    }


    const addToCart = async (id) => {
        let itemArray = await AsyncStorage.getItem('cartItems');
        itemArray = JSON.parse(itemArray);

        if (itemArray) {
            itemArray.push(id);
        } else {
            itemArray = [id];
        }
        setCart(itemArray);

        try {
            await AsyncStorage.setItem('cartItems', JSON.stringify(itemArray));
            console.log('Item Added Successfully to cart');
            ToastAndroid.show('Add to favorite successfully list', ToastAndroid.LONG)
            navigation.navigate('Home');
        } catch (error) {
            console.error(error);
        }
    };


    const checkInCart = (id) => {
        if (cart.length == 0) return false;
        else {
            for (let i = 0; i < cart.length; i++) {
                if (cart[i] == id)
                    return true
            }
        }
        return false;
    }


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
                ToastAndroid.show('Remove successfully', ToastAndroid.LONG)

                getDataFromDB();
            }
            setCart(array)
        }
    };

    const ModalConfirm = ({ id }) => {
        return (
            <Modal animationType="fade"
                transparent={true}
                visible={isVisibleModal}
            >
                <View style={styles.modal}>
                    <Text>Do you want to delete this item?</Text>
                    <View style={styles.contentModal} >

                        <Pressable
                            style={styles.buttonModal}
                            onPress={() => {
                                removeItemFromCart(id);
                                console.log(id);
                                setIsVisibleModal(false);
                            }}
                        >
                            <Text style={{
                                fontWeight: '600'
                            }} >Yes</Text>
                        </Pressable>
                        <Pressable
                            style={styles.buttonModal}
                            onPress={() => {
                                setIsVisibleModal(false);

                            }}
                        >
                            <Text style={{
                                fontWeight: '600'
                            }}  >No</Text>
                        </Pressable>
                    </View>

                </View>
            </Modal>
        )
    }


    const ProductCard = ({ data }) => {
        return (
            <View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Detail', { productID: data.id })}
                    style={{
                        marginVertical: 14,
                    }}
                >
                    <View
                        style={styles.item}
                    >
                        <Image
                            source={data.productImage}
                            style={styles.imageItem}
                        />
                        <View>
                            <Text
                                style={styles.textItem}
                            >
                                {data.productName}
                            </Text>
                            <Text>{data.description}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    console.log(checkInCart(data.id));
                                    checkInCart(data.id) ? toggleModal(data.id) : addToCart(data.id)
                                }}
                                style={{
                                    paddingVertical: 5,
                                    borderRadius: 5,
                                    marginTop: 5,
                                    width: 45
                                }}
                            >
                                {cart.includes(data.id) ? (
                                    <AntDesign
                                        name='heart'
                                        style={{
                                            fontSize: 18,
                                            color: COLOURS.red,
                                            padding: 12,
                                            backgroundColor: COLOURS.white,
                                            borderRadius: 10,
                                        }}
                                    />
                                ) : (
                                    <AntDesign name='hearto'
                                        style={{
                                            fontSize: 18,
                                            color: COLOURS.backgroundDark,
                                            padding: 12,
                                            backgroundColor: COLOURS.white,
                                            borderRadius: 10,
                                        }} />
                                )}

                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
                {isVisibleModal && <ModalConfirm id={selectedProductID} />}

            </View>

        );
    };

    return (
        <ScrollView
            style={{
                padding: 16,
            }}
        >

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            color: COLOURS.black,
                            fontWeight: '500',
                            letterSpacing: 1,
                        }}
                    >
                        Chi lan
                    </Text>
                </View>
            </View>
            <FlatList
                data={data.filter((data) => data.category === 'chilan')}
                renderItem={({ item }) => <ProductCard data={item} />}
                style={{
                }}
            />
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            color: COLOURS.black,
                            fontWeight: '500',
                            letterSpacing: 1,
                        }}
                    >
                        Phi điệp
                    </Text>
                </View>
            </View>
            <FlatList
                data={data.filter((data) => data.category === 'phidiep')}
                renderItem={({ item }) => <ProductCard data={item} />}
                style={{
                }}
            />
        </ScrollView>
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
    },
    buttonModal: {
        width: 70,
        borderRadius: 20,
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#2196F3',
    },
    contentModal: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 16
    },
    item: {
        width: '100%',
        height: 100,
        borderRadius: 10,
        backgroundColor: COLOURS.backgroundLight,
        marginBottom: 8,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    imageItem: {
        width: '30%',
        height: '100%',
        marginRight: 10,
        resizeMode: 'contain'
    },
    textItem: {
        fontSize: 14,
        color: COLOURS.black,
        fontWeight: '600',
        marginBottom: 2,
    }
})

export default HomeScreen;