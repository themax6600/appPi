import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native'

import seta from "../../assets/img/seta.png";
import locationIcon from "../../assets/img/location.png";
import phoneIcon from "../../assets/img/phone.png";
import emailIcon from "../../assets/img/email.png";


export default function Contato({ navigation }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
            >
                <Image source={seta} style={styles.logo} resizeMode="contain" />
            </TouchableOpacity>

            <View style={styles.block}>
                <Image source={locationIcon} style={styles.icon} />
                <Text style={styles.text}>
                    Rua Dr. José Pinto Rebelo Júnior, 91, Matinhos - PR, 83260-000
                </Text>
            </View>

            <View style={styles.block}>
                <Image source={phoneIcon} style={styles.icon} />
                <Text
                    style={[styles.text, styles.link]}
                >
                    (41) 3452-8800
                </Text>
            </View>

            <View style={styles.block}>
                <Image source={emailIcon} style={styles.icon} />
                <Text
                    style={styles.text}
                    onPress={() =>
                        Linking.openURL("mailto:relacionamento.caioba@sescpr.com.br")
                    }
                >
                    relacionamento.caioba@sescpr.com.br
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFC400",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 20,
    },
    block: {
        alignItems: "center",
        marginVertical: 20,
    },
    icon: {
        width: 180,
        height: 180,
        marginBottom: 10,
        resizeMode: "contain",
    },
    text: {
        color: "#ffffffff",
        fontSize: 16,
        textAlign: "center",
        width: 260,
        fontWeight: "bold",
    },
    link: {
        textDecorationLine: "underline",
    },
})