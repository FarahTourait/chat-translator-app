import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, FlatList,
  TouchableOpacity, StyleSheet, Image
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function UsersScreen({ navigation, darkMode, onOpenSettings }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const me = auth.currentUser?.email;
    setUsers(snapshot.docs.map(d => d.data()).filter(u => u.email !== me));
  };

  const getAvatarUrl = (identifier) => {
    const seed = encodeURIComponent(identifier);
    return `https://api.dicebear.com/7.x/adventurer/png?seed=${seed}`;
  };

  return (
    <View style={[styles.container, darkMode && styles.dark]}>
      <View style={styles.header}>
        <Text style={[styles.title, darkMode && styles.titleDark]}>Chats</Text>
        <TouchableOpacity onPress={onOpenSettings}>
          <Feather name="settings" size={24} color={darkMode ? "#fff" : "#6a11cb"} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.subtitle, darkMode && styles.subtitleDark]}>
        Select a user to start chatting ✨
      </Text>

      <TextInput
        placeholder="Search users by name or email..."
        placeholderTextColor={darkMode ? "#999" : "#888"}
        style={[styles.searchInput, darkMode && styles.searchDark]}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={users.filter(u =>
          (u.displayName || "").toLowerCase().includes(search.toLowerCase()) ||
          (u.email || "").toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={item => item.email}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Chat", { selectedUser: item })}
            style={[styles.userItem, darkMode && styles.userItemDark]}
          >
            <Image
              source={{ uri: getAvatarUrl(item.displayName || item.email) }}
              style={styles.avatarImage}
            />
            <View>
              <Text style={[styles.userText, darkMode && styles.userTextDark]}>
                {item.displayName || "Unnamed User"}
              </Text>
              <Text style={[styles.emailText, darkMode && styles.userTextDark]}>
                {item.email}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, darkMode && styles.userTextDark]}>
            No users found.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f5fc',
    padding: 15,
    paddingTop: 60,
  },
  dark: {
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  titleDark: {
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 12,
  },
  subtitleDark: {
    color: "#aaa",
  },
  searchInput: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    color: "#000",
    backgroundColor: "#fff"
  },
  searchDark: {
    backgroundColor: "#2c2c2c",
    borderColor: "#444",
    color: "#fff"
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userItemDark: {
    backgroundColor: "#1f1f1f",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    elevation: 2,
  },
  avatarImage: {
    width: 55,
    height: 55,
    borderRadius: 28,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  userText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
  userTextDark: {
    color: "#fff",
  },
  emailText: {
    fontSize: 13,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});
