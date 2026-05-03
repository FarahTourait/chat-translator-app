import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert('Login Error', error.message);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please enter name, email and password.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name
      });
      Alert.alert('Success', 'Account created! You are now logged in.');
    } catch (error) {
      console.log("Register error:", error);
      Alert.alert('Registration Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{isRegistering ? 'Create Account' : 'Login'}</Text>

      {isRegistering && (
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <TouchableOpacity
        onPress={isRegistering ? handleRegister : handleLogin}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          {isRegistering ? 'Sign Up' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.toggleText}>
        {isRegistering ? "Already have an account?" : "Don't have an account?"}
      </Text>
      <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
        <Text style={styles.linkText}>
          {isRegistering ? 'Back to Login' : 'Create Account'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 30, flex: 1, justifyContent: 'center', backgroundColor: '#fff' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, color: '#6a11cb', textAlign: 'center' },
  input: { backgroundColor: '#f1f1f1', padding: 15, borderRadius: 8, marginBottom: 20 },
  button: { backgroundColor: '#6a11cb', padding: 15, borderRadius: 8, marginTop: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  toggleText: { marginTop: 20, textAlign: 'center', color: '#666' },
  linkText: { color: '#6a11cb', textAlign: 'center', fontWeight: 'bold', marginTop: 5 },
});

export default LoginScreen;
