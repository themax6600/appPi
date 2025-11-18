import { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "contador_notificacoes";
const NotificacaoContext = createContext();

export function NotificacaoProvider({ children }) {
    const [contador, setContador] = useState(0);

    useEffect(() => {
        (async () => {
            const salvo = await AsyncStorage.getItem(STORAGE_KEY);
            if (salvo) setContador(Number(salvo));
        })();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEY, String(contador));
    }, [contador]);

    function adicionarNotificacao() {
        setContador((prev) => prev + 1);
    }

    function zerarNotificacoes() {
        setContador(0);
    }

    return (
        <NotificacaoContext.Provider value={{ contador, adicionarNotificacao, zerarNotificacoes }}>
            {children}
        </NotificacaoContext.Provider>
    );
}

export function useNotificacao() {
    return useContext(NotificacaoContext);
}
