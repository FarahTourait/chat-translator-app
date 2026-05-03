import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Switch,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  ToastAndroid,
  TextInput,
  Alert,
} from 'react-native';
import {
  FontAwesome,
  Feather,
  MaterialIcons,
  Entypo,
  MaterialIcons as MI,
} from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import DropDownPicker from 'react-native-dropdown-picker';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Settings = ({
  visible,
  onClose,
  language,
  setLanguage,
  darkMode,
  setDarkMode,
}) => {
  const [open, setOpen] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  const user = auth.currentUser;

  const items = [
    { label: 'English', value: 'en' },
    { label: 'Urdu', value: 'ur' },
    { label: 'Pashto', value: 'ps' },
    { label: 'Sindhi', value: 'sd' },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              ToastAndroid.show("You've been logged out", ToastAndroid.SHORT);
            } catch (e) {
              Alert.alert('Logout failed', e.message);
            }
          },
        },
      ]
    );
  };

  const submitFeedback = async () => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'feedback'), {
        uid: user.uid,
        email: user.email,
        rating,
        message: feedbackText,
        timestamp: serverTimestamp(),
      });

      ToastAndroid.show('Thanks for your feedback!', ToastAndroid.SHORT);
      setShowFeedback(false);
      setRating(0);
      setFeedbackText('');
    } catch (error) {
      ToastAndroid.show('Failed to submit feedback', ToastAndroid.SHORT);
    }
  };

  const handleEmailPress = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handlePhonePress = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <>
      <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
        <BlurView
          intensity={90}
          tint={darkMode ? 'dark' : 'light'}
          style={styles.blurContainer}
        >
          <View
            style={[
              styles.modalContent,
              darkMode && styles.darkModalContent,
            ]}
          >
            <Text style={[styles.title, darkMode && styles.darkTitle]}>
              Settings
            </Text>

            {/* User Email */}
            {user?.email && (
              <View style={[styles.settingRow, { justifyContent: 'flex-start' }]}>
                <FontAwesome
                  name="user"
                  size={20}
                  color={darkMode ? '#f0e6d2' : '#6a11cb'}
                />
                <Text style={[styles.label, darkMode && styles.darkText]}>
                  <Text style={{ fontWeight: 'bold' }}>User: </Text>
                  {user.email}
                </Text>
              </View>
            )}

            {/* Dark Mode */}
            <View style={styles.settingRow}>
              <View style={styles.labelContainer}>
                <FontAwesome
                  name="moon-o"
                  size={20}
                  color={darkMode ? '#f0e6d2' : '#6a11cb'}
                />
                <Text style={[styles.label, darkMode && styles.darkText]}>
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                thumbColor={darkMode ? '#f0e6d2' : '#f8f9fa'}
                trackColor={{ false: '#767577', true: '#6a11cb' }}
              />
            </View>

            {/* Language Picker */}
            <Text style={[styles.label, { marginTop: 10 }, darkMode && styles.darkText]}>
              Preferred Language
            </Text>
            <DropDownPicker
              open={open}
              value={language}
              items={items}
              setOpen={setOpen}
              setValue={(lang) => {
                setLanguage(lang);
                ToastAndroid.show("Language updated!", ToastAndroid.SHORT);
              }}
              setItems={() => {}}
              style={{
                backgroundColor: darkMode ? '#3a2e1a' : '#fff',
                borderColor: darkMode ? '#3a2e1a' : '#ccc',
                marginTop: 8,
                borderRadius: 10,
              }}
              textStyle={{
                color: darkMode ? '#f0e6d2' : '#000',
                fontWeight: 'bold',
              }}
              dropDownContainerStyle={{
                backgroundColor: darkMode ? '#3a2e1a' : '#fff',
                borderColor: darkMode ? '#3a2e1a' : '#ccc',
              }}
              zIndex={1000}
            />

            {/* Buttons */}
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: darkMode ? '#f0e6d250' : '#6a11cb', marginTop: 15 },
              ]}
              onPress={() => setShowContact(true)}
            >
              <Text style={styles.buttonText}>Contact Us</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: darkMode ? '#f0e6d250' : '#6a11cb', marginTop: 10 },
              ]}
              onPress={() => setShowFeedback(true)}
            >
              <Text style={styles.buttonText}>Give Feedback</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: darkMode ? '#f0e6d250' : '#6a11cb', marginTop: 10 },
              ]}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={[styles.closeText, darkMode && styles.darkCloseText]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>

      {/* Contact Modal */}
      <Modal visible={showContact} animationType="slide">
        <View style={[styles.fullscreen, { backgroundColor: darkMode ? '#1a120b' : '#fff' }]}>
          <ScrollView contentContainerStyle={styles.contactContent}>
            <Text style={[styles.contactTitle, darkMode && styles.darkTitle]}>
              📞 Contact Information
            </Text>
            <TouchableOpacity style={styles.contactRow} onPress={() => handleEmailPress('farha@email.com')}>
              <MaterialIcons name="email" size={20} color={darkMode ? '#f0e6d2' : '#6a11cb'} />
              <Text style={[styles.contactText, darkMode && styles.darkText]}>
                farha@email.com
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactRow} onPress={() => handlePhonePress('+92 3105772641')}>
              <Entypo name="phone" size={20} color={darkMode ? '#f0e6d2' : '#6a11cb'} />
              <Text style={[styles.contactText, darkMode && styles.darkText]}>
                +92 310 5772641
              </Text>
            </TouchableOpacity>
              <TouchableOpacity style={styles.contactRow} onPress={() => handleEmailPress('farha@email.com')}>
              <MaterialIcons name="email" size={20} color={darkMode ? '#f0e6d2' : '#6a11cb'} />
              <Text style={[styles.contactText, darkMode && styles.darkText]}>
                gull@email.com
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactRow} onPress={() => handlePhonePress('+92 3105772641')}>
              <Entypo name="phone" size={20} color={darkMode ? '#f0e6d2' : '#6a11cb'} />
              <Text style={[styles.contactText, darkMode && styles.darkText]}>
                +92 333 7485759
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { marginTop: 30, backgroundColor: darkMode ? '#f0e6d250' : '#6a11cb' }]}
              onPress={() => setShowContact(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Feedback Modal */}
      <Modal visible={showFeedback} animationType="slide">
        <View style={[styles.fullscreen, { backgroundColor: darkMode ? '#1a120b' : '#fff' }]}>
          <ScrollView contentContainerStyle={styles.contactContent}>
            <Text style={[styles.contactTitle, darkMode && styles.darkTitle]}>
              ⭐ Give Feedback
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 15 }}>
              {[1, 2, 3, 4, 5].map((val) => (
                <TouchableOpacity key={val} onPress={() => setRating(val)}>
                  <MI
                    name={val <= rating ? 'star' : 'star-border'}
                    size={30}
                    color="#f1c40f"
                    style={{ marginHorizontal: 4 }}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={[styles.input, darkMode && styles.darkInput]}
              placeholder="Write your feedback..."
              placeholderTextColor={darkMode ? '#ccc' : '#999'}
              multiline
              numberOfLines={4}
              value={feedbackText}
              onChangeText={setFeedbackText}
            />
            <TouchableOpacity
              style={[styles.button, { backgroundColor: darkMode ? '#f0e6d250' : '#6a11cb' }]}
              onPress={submitFeedback}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowFeedback(false)}>
              <Text style={[styles.closeText, darkMode && styles.darkCloseText]}>
                Close
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  blurContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContent: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 15,
    padding: 25,
    width: '85%',
    maxWidth: 380,
  },
  darkModalContent: {
    backgroundColor: 'rgba(26, 18, 11, 0.95)',
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 25, textAlign: 'center', color: '#6a11cb' },
  darkTitle: { color: '#f0e6d2' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 10 },
  labelContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { fontSize: 16, color: '#333' },
  darkText: { color: '#f0e6d2' },
  button: { padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  closeButton: { marginTop: 15, alignSelf: 'center' },
  closeText: { color: '#6a11cb', fontSize: 16, fontWeight: '600' },
  darkCloseText: { color: '#f0e6d2' },
  contactTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#6a11cb' },
  contactContent: { padding: 30 },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 12 },
  contactText: { fontSize: 16 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 20, textAlignVertical: 'top' },
  darkInput: { backgroundColor: '#3a2e1a', color: '#f0e6d2' },
  fullscreen: { flex: 1 },
});

export default Settings;
