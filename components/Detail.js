import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Image,
    Dimensions,
    Animated,
    StyleSheet
} from 'react-native';
import { COLOURS, Items } from '../data/database';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Detail = ({ route, navigation }) => {
    const { productID } = route.params;

    const [product, setProduct] = useState({});

    const width = Dimensions.get('window').width;

    const scrollX = new Animated.Value(0);

    let position = Animated.divide(scrollX, width);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getDataFromDB();
        });

        return unsubscribe;
    }, [navigation]);

    //get product data by productID

    const getDataFromDB = async () => {
        for (let index = 0; index < Items.length; index++) {
            if (Items[index].id == productID) {
                setProduct(Items[index]);
                return;
            }
        }
    };





    //product horizontal scroll product card
    const renderProduct = ({ item, index }) => {
        return (
            <View
                style={{
                    width: width,
                    height: 240,
                }}>
                <Image
                    source={item}
                    style={styles.image}
                />
            </View>
        );
    };

    return (
        <View
            style={styles.body}>
            <StatusBar
                backgroundColor={COLOURS.backgroundLight}
                barStyle="dark-content"
            />
            <ScrollView>
                <View
                    style={{
                        backgroundColor: COLOURS.backgroundLight,
                    }}>
                    <View
                        style={{
                            width: '100%',
                            flexDirection: 'row',
                            paddingTop: 16,
                            paddingLeft: 16,
                        }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Entypo
                                name="chevron-left"
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={product.productImageList ? product.productImageList : null}
                        horizontal
                        renderItem={renderProduct}
                        showsHorizontalScrollIndicator={false}
                        decelerationRate={0.8}
                        snapToInterval={width}
                        bounces={false}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: false },
                        )}
                    />
                    <View
                        style={styles.bottomBar}>
                        {product.productImageList
                            ? product.productImageList.map((data, index) => {
                                let opacity = position.interpolate({
                                    inputRange: [index - 1, index, index + 1],
                                    outputRange: [0.2, 1, 0.2],
                                    extrapolate: 'clamp',
                                });
                                return (
                                    <Animated.View
                                        key={index}
                                        style={{
                                            width: '16%',
                                            height: 2.4,
                                            backgroundColor: COLOURS.black,
                                            opacity,
                                            marginHorizontal: 4,
                                            borderRadius: 100,
                                        }}></Animated.View>
                                );
                            })
                            : null}
                    </View>
                </View>
                <View
                    style={{
                        paddingHorizontal: 16,
                        marginTop: 6,
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginVertical: 14,
                        }}>

                    </View>
                    <View
                        style={styles.textContent}>
                        <Text
                            style={styles.textName}>
                            {product.productName}
                        </Text>
                        <Ionicons
                            name="link-outline"
                            style={{
                                fontSize: 24,
                                color: COLOURS.blue,
                                backgroundColor: COLOURS.blue + 10,
                                padding: 8,
                                borderRadius: 100,
                            }}
                        />
                    </View>
                    <Text
                        style={styles.textDes}>
                        {product.description}
                    </Text>


                </View>
            </ScrollView>


        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    body: {
        width: '100%',
        height: '100%',
        backgroundColor: COLOURS.white,
        position: 'relative',
    },
    icon: {
        fontSize: 18,
        color: COLOURS.backgroundDark,
        padding: 12,
        backgroundColor: COLOURS.white,
        borderRadius: 10,
    },
    bottomBar: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        marginTop: 32,
    },
    textContent: {
        flexDirection: 'row',
        marginVertical: 4,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textName: {
        fontSize: 24,
        fontWeight: '600',
        letterSpacing: 0.5,
        marginVertical: 4,
    },
    textDes: {
        fontSize: 12,
        color: COLOURS.black,
        fontWeight: '400',
        letterSpacing: 1,
        lineHeight: 20,
        maxWidth: '85%',
        maxHeight: 44,
        marginBottom: 18,
    }
})

export default Detail;