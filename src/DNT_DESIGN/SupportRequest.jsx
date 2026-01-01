import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../Components/Header/Header";
import Input from "../Components/Input";
import FullwidthButton from "../Components/FullwidthButton";
import { COLORS } from "../Theme/Colors";
import { wp, hp } from "../Theme/Dimensions";
import { FONTS } from "../Theme/FontFamily";
import { useNavigation } from "@react-navigation/native";
import { apiGet, apiPost, apiPut } from "../Api/Api";

const SupportRequest = () => {
  const navigation = useNavigation();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [requests, setRequests] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch all support requests
  const getVendorRequest = async () => {
    try {
      const url = "/needhelp/";
      const result = await apiGet(url);
      console.log(result, "result is something");
      if (result.success) {
        setRequests(result.requests);
      }
    } catch (error) {
      console.log("Error fetching requests:", error);
    }
  };

  useEffect(() => {
    getVendorRequest();
  }, []);

  // Create new support request
  const handleSubmit = async () => {
    if (!subject || !message || !phone) {
      setErrorMsg("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const payload = {
        subject,
        description: message,
        phone,
      };
      const res = await apiPost("/needhelp/", payload);
      console.log(res, "res");
      if (res?.success) {
        Alert.alert("Success", "Support request submitted successfully!");
        setSubject("");
        setMessage("");
        setPhone("");
        setShowForm(false);
        getVendorRequest();
      } else {
        setErrorMsg("Failed to submit support request");
      }
    } catch (error) {
      setErrorMsg(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Update existing support request
  const handleUpdate = async () => {
    if (!subject || !message || !phone) {
      setErrorMsg("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const payload = {
        subject,
        description: message,
        phone,
      };
      const res = await apiPut(`/needhelp/${editingId}`, payload);
      console.log(res, "update res");
      if (res?.success) {
        Alert.alert("Success", "Support request updated successfully!");
        setSubject("");
        setMessage("");
        setPhone("");
        setIsEditing(false);
        setEditingId(null);
        setShowForm(false);
        getVendorRequest();
      } else {
        setErrorMsg("Failed to update support request");
      }
    } catch (error) {
      setErrorMsg(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button click
  const handleEdit = (item) => {
    setSubject(item.subject);
    setMessage(item.description);
    setPhone(item.phone);
    setIsEditing(true);
    setEditingId(item._id);
    setShowForm(true);
    setErrorMsg("");
  };

  // Cancel editing
  const handleCancel = () => {
    setSubject("");
    setMessage("");
    setPhone("");
    setIsEditing(false);
    setEditingId(null);
    setShowForm(false);
    setErrorMsg("");
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { bg: "#FFF3CD", text: "#856404" };
      case "in progress":
        return { bg: "#D1ECF1", text: "#0C5460" };
      case "resolved":
        return { bg: "#D4EDDA", text: "#155724" };
      case "closed":
        return { bg: "#F8D7DA", text: "#721C24" };
      default:
        return { bg: "#FFF3CD", text: "#856404" };
    }
  };

  // Show form if no requests exist OR if editing
  const shouldShowForm = requests.length === 0 || showForm;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: hp(20) }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {shouldShowForm ? (
            <>
              {/* FORM VIEW */}
              <View style={styles.titleContainer}>
                <Text style={styles.title}>
                  {isEditing ? "Edit Support Request" : "Need Help?"}
                </Text>
                <Text style={styles.description}>
                  {isEditing
                    ? "Update your support request details below."
                    : "Fill the form below & our support team will contact you shortly."}
                </Text>
              </View>

              {/* FORM */}
              <View style={styles.InputGap}>
                <Input
                  label="Subject *"
                  placeholder="Payment issue / App not working / Order issue"
                  value={subject}
                  onChangeText={setSubject}
                />

                <Input
                  label="Describe your issue *"
                  placeholder="Write your problem here..."
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={5}
                  style={styles.textArea}
                />

                <Input
                  label="Phone Number *"
                  placeholder="+91 - 9876543210"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />

                {errorMsg ? (
                  <Text style={styles.errorText}>{errorMsg}</Text>
                ) : null}
              </View>
            </>
          ) : (
            <>
              {/* CARDS VIEW */}
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Your Support Requests</Text>
                <Text style={styles.description}>
                  Our team is working on your issues.
                </Text>
              </View>

              {requests.map((item) => {
                const statusColors = getStatusColor(item.status);
                return (
                  <View key={item._id} style={styles.card}>
                    {/* HEADER */}
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle} numberOfLines={2}>
                        {item.subject}
                      </Text>

                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: statusColors.bg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            { color: statusColors.text },
                          ]}
                        >
                          {item.status}
                        </Text>
                      </View>
                    </View>

                    {/* DESCRIPTION */}
                    <Text style={styles.cardLabel}>Description</Text>
                    <Text style={styles.cardText} numberOfLines={3}>
                      {item.description}
                    </Text>

                    {/* PHONE */}
                    <View style={styles.cardRow}>
                      <Text style={styles.cardLabel}>Phone</Text>
                      <Text style={styles.cardText}>{item.phone}</Text>
                    </View>

                    {/* FOOTER */}
                    <View style={styles.cardFooter}>
                      <Text style={styles.dateText}>
                        {new Date(item.createdAt).toDateString()}
                      </Text>

                      <TouchableOpacity onPress={() => handleEdit(item)}>
                        <Text style={styles.editText}>Edit</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </>
          )}
        </ScrollView>

        {/* BOTTOM BUTTONS */}
        {shouldShowForm && (
          <View style={styles.bottomButton}>
            {isEditing && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}

            <FullwidthButton
              title={
                loading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : isEditing ? (
                  "Update Request"
                ) : (
                  "Submit Request"
                )
              }
              onPress={isEditing ? handleUpdate : handleSubmit}
              disabled={loading}
            />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default SupportRequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: wp(5),
  },

  titleContainer: {
    marginTop: hp(3),
    marginBottom: hp(2),
  },

  title: {
    fontFamily: FONTS.InterBold,
    fontSize: wp(5),
    color: COLORS.BlackText,
  },

  description: {
    fontFamily: FONTS.InterRegular,
    fontSize: wp(3.8),
    color: COLORS.grayText,
    marginTop: hp(1),
  },

  InputGap: {
    gap: hp(1.5),
  },

  textArea: {
    height: hp(14),
    textAlignVertical: "top",
  },

  errorText: {
    color: "red",
    fontFamily: FONTS.InterRegular,
    fontSize: wp(3.4),
    marginTop: hp(1),
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: wp(4),
    padding: wp(4),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: COLORS.border || "#EEE",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: hp(1),
  },

  cardTitle: {
    fontFamily: FONTS.InterBold,
    fontSize: wp(4.2),
    color: COLORS.BlackText,
    flex: 1,
    marginRight: wp(2),
  },

  statusBadge: {
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: wp(10),
  },

  statusText: {
    fontFamily: FONTS.InterMedium,
    fontSize: wp(3),
    textTransform: "capitalize",
  },

  cardLabel: {
    fontFamily: FONTS.InterMedium,
    fontSize: wp(3.4),
    color: COLORS.grayText,
    marginTop: hp(1),
  },

  cardText: {
    fontFamily: FONTS.InterRegular,
    fontSize: wp(3.6),
    color: COLORS.BlackText,
    marginTop: hp(0.5),
  },

  cardRow: {
    marginTop: hp(1),
  },

  cardFooter: {
    marginTop: hp(2),
    paddingTop: hp(1.5),
    borderTopWidth: 1,
    borderTopColor: COLORS.border || "#EEE",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dateText: {
    fontFamily: FONTS.InterRegular,
    fontSize: wp(3),
    color: COLORS.grayText,
  },

  editText: {
    fontFamily: FONTS.InterMedium,
    fontSize: wp(3.6),
    color: COLORS.primary,
  },

  bottomButton: {
    position: "absolute",
    bottom: hp(8),
    width: wp(90),
    alignSelf: "center",
    gap: hp(1),
  },

  cancelButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: wp(3),
    paddingVertical: hp(1.8),
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    fontFamily: FONTS.InterSemiBold,
    fontSize: wp(4),
    color: COLORS.primary,
  },
});