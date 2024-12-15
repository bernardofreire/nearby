import { useEffect, useState } from 'react'
import { Alert, View, Text } from "react-native";

// Mapa
import MapView, { Callout, Marker } from 'react-native-maps'
import * as Location from 'expo-location';

import { api } from '@/services/api'
import { fontFamily, colors } from '@/styles/theme'

import { Categories, CategoriesProps } from '@/components/categories';
import { PlaceProps } from '@/components/place';
import { Places } from '@/components/places';


type MarketsProps = PlaceProps & {
    latitude: number
    longitude: number
}

const currentLocation = {
    latitude: -23.561187293883442,
    longitude: -46.656451388116494
}


export default function Home() {
    const [categories, setCategories] = useState<CategoriesProps>([])
    const [category, setCategory] = useState("")
    const [markets, setMarkets] = useState<MarketsProps[]>([])


    // Chamar a api
    async function fetchCategories() {
        try {
            const { data } = await api.get('/categories')
            setCategories(data)
            setCategory(data[0].id)
        } catch (error) {
            console.log(error)
            Alert.alert("Categorias", "Não foi possível carregar as categorias")
        }
    }

    // Dependente da mudança de categoria, ele é executado se tiver mudança a
    async function fetchMarkets() {
        try {
            if (!category) {
                return
            }

            const { data } = await api.get('/markets/category/' + category)
            setMarkets(data)
        } catch (error) {
            console.log(error)
            Alert.alert("Locais", "Não foi possível carregar os locais.")
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])


    useEffect(() => {
        fetchMarkets()
    }, [category])


    async function getCurrentLocation() {
        try {
            const { granted } = await Location.requestForegroundPermissionsAsync();

            // Se o usuario deu permissão, pega a localização dele
            if (granted) {
                const location = await Location.getCurrentPositionAsync();
                console.log(location)
            }
        } catch (error) {
            console.log(error)

        }

    }


    return (
        <View style={{ flex: 1, backgroundColor: "#CECECE" }}>
            <Categories data={categories} onSelect={setCategory} selected={category} />

            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker
                    identifier='current'
                    coordinate={{
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                    }}
                    image={require("@/assets/location.png")}
                />

                {
                    markets.map((item) => (
                        <Marker
                            key={item.id}
                            identifier={item.id}
                            coordinate={{
                                latitude: item.latitude,
                                longitude: item.longitude,
                            }}
                            image={require("@/assets/pin.png")}
                        >
                            <Callout>
                                <View>
                                    <Text style={{ fontSize: 14, color: colors.gray[600], fontFamily: fontFamily.medium }}>{item.name}</Text>
                                    <Text style={{ fontSize: 12, color: colors.gray[600], fontFamily: fontFamily.regular }}>{item.address}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))
                }

            </MapView>
            <Places data={markets} />
        </View>
    )
}