import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Pressable, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Items, COLOURS } from '../data/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
                                    backgroundColor: cart.includes(data.id) ? COLOURS.red : COLOURS.blue,
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    borderRadius: 5,
                                    marginTop: 5,
                                    width: 70,
                                    alignItems: 'center'
                                }}
                            >
                                <Text
                                    style={{
                                        color: COLOURS.white,
                                        fontSize: 12,
                                        fontWeight: '600',
                                    }}
                                >
                                    {cart.includes(data.id) ? 'remove' : 'add'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
                {isVisibleModal && <ModalConfirm id={selectedProductID} />}

            </View>

        );
    };

    return (
        <View
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
                        Products
                    </Text>
                </View>
            </View>
            <FlatList
                data={data}
                renderItem={({ item }) => <ProductCard data={item} />}
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
        height: '80%',
        resizeMode: 'contain',
    },
    textItem: {
        fontSize: 12,
        color: COLOURS.black,
        fontWeight: '600',
        marginBottom: 2,
    }
})

export default HomeScreen;