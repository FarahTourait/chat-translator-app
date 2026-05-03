import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },

  header: {
    backgroundColor: "#6a11cb",
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -15,
  },

  headerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    flexWrap: 'wrap'
  },

  messageList: {
    flex: 1,
    padding: 10,
  },

  messageBubble: {
    maxWidth: "70%",
    padding: 12,
    marginBottom: 10,
    borderRadius: 15,
  },

  sender: {
    alignSelf: "flex-end",
    backgroundColor: "#6a11cb",
    borderBottomRightRadius: 5,
  },

  receiver: {
    alignSelf: "flex-start",
    backgroundColor: "#b0b0b0",
    borderBottomLeftRadius: 5,
  },

  darkReceiver: {
    backgroundColor: "#333",
    borderColor: "#444",
  },

  messageText: {
    color: "#fff",
    fontSize: 14,
  },

  darkMessageText: {
    color: "#fff",
  },

  inputArea: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  darkInputArea: {
    backgroundColor: "#1a120b",
    borderColor: "#3a2e1a",
  },

  input: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
    marginHorizontal: 10,
    color: "#000"
  },

  inputDark: {
    backgroundColor: "#2a2218",
    color: "#f0e6d2",
  },

  sendBtn: {
    backgroundColor: "#6a11cb",
    padding: 10,
    borderRadius: 20,
  },

  iconBtn: {
    paddingHorizontal: 5,
  }
});
