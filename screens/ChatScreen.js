// components/ChatsScreen.js
import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';

// Dummy user list (Replace with actual users from Firestore in real app)
const dummyUsers = [
  { email: 'user1@example.com', name: 'User One', avatar: require('../assets/avatar1.png') },
  { email: 'user2@example.com', name: 'User Two', avatar: require('../assets/avatar2.png') },
  { email: 'user3@example.com', name: 'User Three', avatar: require('../assets/avatar3.png') },
];

export default function ChatsScreen({ navigation, user }) {
  const [query, setQuery] = useState("");

  // Filter users based on search query and exclude current user
  const filtered = dummyUsers.filter(
    u => u.email !== user.email && u.email.toLowerCase().includes(query.toLowerCase())
  );

  const openChat = (u) => {
    // Consistently generate chatId from both user emails
    const chatId = [user.email, u.email].sort().join('_');

    navigation.navigate('Chat', {
      chatId,
      receiverEmail: u.email,
      receiverName: u.name,
      receiverAvatar: u.avatar,
      currentUserEmail: user.email,
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search users by email..."
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={filtered}
        keyExtractor={item => item.email}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => openChat(item)}>
            <Image source={item.avatar} style={styles.avatar} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  search: {
    borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 10, borderRadius: 8
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    elevation: 2
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12
  },
  name: {
    fontSize: 16,
    fontWeight: '600'
  },
  email: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888'
  }
});
