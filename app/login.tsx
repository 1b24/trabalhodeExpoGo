import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
    const router = useRouter();

    const [secureText, setSecureText] = useState(true);

    function trocarEstadoSenha() {
        if (secureText === true) {
            setSecureText(false);
        }else {
            setSecureText(true);
        }
    }

    function logar() {
        router.replace("/(tabs)/home")
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.innerContainer}>
                <Ionicons 
                    name="apps-outline" 
                    size={64} 
                    color={"#007AFF"}
                    style={styles.logo} 
                />
                <Text style={styles.title}>Acesse sua conta</Text>

                <Text style={styles.label}>E-mail</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="email@example.com"
                    keyboardType="email-address"
                />

                <Text style={styles.label}>Senha</Text>
                <View style={styles.passwordContainer}>
                    <TextInput 
                        style={styles.passwordInput}
                        placeholder="*********"
                        secureTextEntry={secureText} 
                    />
                    <TouchableOpacity 
                        onPress={trocarEstadoSenha}
                        style={styles.iconContainer}
                    >
                        <Ionicons
                            name={secureText ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color={"#8e8e93"}
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={logar}
                >
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>

            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    },
    innerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingBottom: 40
    },
    logo: {
        marginBottom: 10
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1c1c1e",
        marginBottom: 30 
    },
    label: {
        alignSelf: "flex-start",
        fontSize: 14,
        fontWeight: '600',
        color: '#8e8e93',
        marginBottom: 5,
    },
    input: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#e5e5ea",
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        color: "#1c1c1e",
        backgroundColor: "#fbfbfd",
        marginBottom: 15
    },
    passwordContainer: {
        flexDirection: "row",
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#e5e5ea",
        borderRadius: 12,
        backgroundColor: "#fbfbfd",
        marginBottom: 10,
        overflow: "hidden"
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 15,
        fontSize: 16,
        color: "#1c1c1e"
    },
    iconContainer: {
        justifyContent: "center",
        paddingHorizontal: 15
    },
    button: {
        width: "100%",
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: "#007AFF"
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "#FFF"
    }
})