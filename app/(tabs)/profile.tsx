import { useRouter } from "expo-router";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
    const router = useRouter();

    function onSairPress() {
        router.replace("/login");
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Image 
                    source={{
                        uri: "https://avatars.githubusercontent.com/u/106830297?v=4"
                    }}
                    style={styles.profileImage}
                />

                <Text style={styles.textName}>João Grande</Text>

                <Text style={styles.textBio}>
                    Eu gosto de react native
                </Text>

                <TouchableOpacity 
                    style={styles.botaoSair}
                    onPress={onSairPress}
                >
                    <Text>Sair</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },
    botaoSair: {
        marginTop: 20,
        backgroundColor: "#FF5A5F",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignItems: "center"
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10
    },
    card: {
        backgroundColor: "#FFFFFF",
        padding: 30,
        borderRadius: 15,
        alignItems: "center",

        //Sombras
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,

        width: "100%",
        maxWidth: 250
    },
    textName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10
    },
    textBio: {
        fontSize: 16,
        textAlign: "center",
        color: "#666",
        lineHeight: 22
    }
});