import { Share, Platform } from "react-native";

const onShareOrder = async (item) => {
  try {
    if (!item) return;

    const message = `
🧾 Order Summary

Customer: ${safeText(item.firstName)} ${safeText(item.lastName)}
Phone: ${safeText(item.phone)}
Shop: ${safeText(item?.shopId?.shopName)}

Total: ₹${safeText(item.grandTotal)}
Status: ${safeText(item.status)}

Items:
${Array.isArray(item.items) && item.items.length > 0
  ? item.items
      .map(
        (i) =>
          `• ${safeText(i.name)} x ${safeText(i.quantity)} = ₹${safeText(
            i.total
          )}`
      )
      .join("\n")
  : "No items"}

Order ID: ${safeText(item._id)}
    `.trim();

    if (!message) {
      console.log("Empty share message");
      return;
    }

    await Share.share(
      Platform.OS === "ios"
        ? {
            title: "Order Details",
            message,
          }
        : {
            message,
          }
    );
  } catch (error) {
    console.log("Share Error:", error);
  }
};
