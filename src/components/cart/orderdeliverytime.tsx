import { useState, useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";

function OrderDeliveryInfo() {
  const [deliveryTime, setDeliveryTime] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  useEffect(() => {
    const updateDeliveryInfo = () => {
      const now = new Date();
      const deliveryDateTime = new Date(now.getTime() + 60 * 60 * 1000);

      const optionsDate = { year: "numeric", month: "long", day: "numeric" };
      const formattedDate = deliveryDateTime.toLocaleDateString(
        "en-US",
        optionsDate as Intl.DateTimeFormatOptions
      );

      const optionsTime = { hour: "numeric", minute: "2-digit", hour12: true };
      const formattedTime = deliveryDateTime.toLocaleTimeString(
        "en-US",
        optionsTime as Intl.DateTimeFormatOptions
      );

      setDeliveryDate(formattedDate);
      setDeliveryTime(formattedTime);
    };

    // Update immediately and then every minute to keep it current
    updateDeliveryInfo();
    const intervalId = setInterval(updateDeliveryInfo, 60 * 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <Box bgColor={"#CCEEDF"} rounded={"lg"} px={4} py={3} mt={3}>
      <Text fontSize={"sm"}>
        Su orden será entregada en aproximadamente 1 hora.
        <Text as={"span"} color={"Cbutton"} fontWeight={"Black"}>
          {deliveryDate}
        </Text>{" "}
        at
        <Text as={"span"} color={"Cbutton"} fontWeight={"Black"}>
          {" "}
          {deliveryTime}
        </Text>
      </Text>
    </Box>
  );
}

export default OrderDeliveryInfo;
