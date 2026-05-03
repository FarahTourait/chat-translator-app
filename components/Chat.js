import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Alert,
  ActivityIndicator, RefreshControl, TouchableWithoutFeedback,
  Linking, Modal
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { useNetInfo } from '@react-native-community/netinfo';
import { useRoute } from '@react-navigation/native';
import { auth } from '../firebase';
import styles from './styles';

const BACKEND_URL = "http://192.168.18.43:5000";
const LANGUAGE_CODES = { en: "eng_Latn", ur: "urd_Arab", sd: "snd_Arab", ps: "pbt_Arab" };

function getChatId(user1, user2) {
  return [user1, user2].sort().join("_");
}

export default function Chat({ language, darkMode }) {
  const route = useRoute();
  const user = route.params?.selectedUser;
  if (!user) return <View style={styles.container}><Text style={{ color: 'red', padding: 20 }}>No user selected. Go back and select.</Text></View>;

  const recipientEmail = user.email;
  const currentUserEmail = auth.currentUser?.email;
  const chatId = getChatId(currentUserEmail, recipientEmail);

  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [theme, setTheme] = useState("light");

  const themeBackgrounds = {
    light: "#ffffff",
    dark: "#121212",
    cartoon: "#fceabb",
    colorful: "#d4fc79"
  };

  const scrollRef = useRef();
  const netInfo = useNetInfo();

  const fetchMessages = async () => {
    try {
      const resp = await axios.post(`${BACKEND_URL}/get_messages`, {
        chat_id: chatId,
        target_lang: LANGUAGE_CODES[language],
        current_user: currentUserEmail
      });
      setMessages(resp.data.messages);
    } catch (e) {
      console.error("Error fetching messages:", e.message);
    }
  };

  useEffect(() => {
    fetchMessages();
    const iv = setInterval(fetchMessages, 3000);
    return () => clearInterval(iv);
  }, [language]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    setIsSending(true);
    try {
      await axios.post(`${BACKEND_URL}/send_message`, {
        chat_id: chatId,
        text: inputText.trim(),
        sender: currentUserEmail
      });
      setInputText("");
      fetchMessages();
    } catch (e) {
      Alert.alert("Error", "Failed to send");
      console.error(e);
    }
    setIsSending(false);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMessages().then(() => setRefreshing(false));
  }, [language]);

  const confirmDelete = idx => Alert.alert("Delete", "Select Yes?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Yes", style: "destructive",
      onPress: () => setMessages(m => m.filter((_, i) => i !== idx))
    }
  ]);

  return (
    <View style={[styles.container, { backgroundColor: themeBackgrounds[theme] }]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Chat with {user.displayName || recipientEmail} ({language.toUpperCase()})
          {!netInfo.isConnected && " (Offline)"}
        </Text>
        <TouchableOpacity onPress={() => setShowThemeModal(true)}>
          <Feather name="settings" size={22} color={darkMode ? "#fff" : "#6a11cb"} />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated: true })}
        style={[styles.messageList]}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={darkMode ? "#fff" : "#6a11cb"} />}
      >
        {messages.map((msg, i) => (
          <TouchableWithoutFeedback key={i} onLongPress={() => confirmDelete(i)}>
            <View style={[styles.messageBubble, msg.isMe ? styles.sender : [styles.receiver, darkMode && styles.darkReceiver]]}>
              <Text style={[styles.messageText, !msg.isMe && darkMode && styles.darkMessageText]}>{msg.text}</Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>

      {/* Theme Picker Modal */}
      <Modal visible={showThemeModal} animationType="slide" transparent={true}>
        <View style={{
          backgroundColor: '#fff',
          margin: 40,
          padding: 20,
          borderRadius: 10,
          elevation: 5
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Select Theme</Text>
          {Object.keys(themeBackgrounds).map(t => (
            <TouchableOpacity key={t} onPress={() => {
              setTheme(t);
              setShowThemeModal(false);
            }} style={{ marginVertical: 8 }}>
              <Text style={{ fontSize: 16 }}>{t.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setShowThemeModal(false)} style={{ marginTop: 10 }}>
            <Text style={{ color: 'blue', fontWeight: 'bold' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={[styles.inputArea, darkMode && styles.darkInputArea]}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor={darkMode ? "#ccc" : "#888"}
          style={[styles.input, darkMode && styles.inputDark]}
          editable={!isSending}
        />
        <TouchableOpacity onPress={sendMessage} disabled={isSending || !inputText.trim()} style={styles.sendBtn}>
          {isSending ? <ActivityIndicator size="small" color="#fff" /> : <Feather name="send" size={22} color="#fff" />}
        </TouchableOpacity>
      </View>
    </View>
  );
}
