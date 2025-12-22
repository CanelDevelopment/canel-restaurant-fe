import { useEffect } from "react";
import { usePaymentStore } from "@/store/paymentStore";

export const useFetchConversion = () => {
  const { selectedPayment, setConversionRate } = usePaymentStore();

  useEffect(() => {
    const fetchRate = async () => {
      // In your UI: "online" corresponds to the "Bolivares" button
      if (selectedPayment === "online") {
        try {

          const res = await fetch("https://ve.dolarapi.com/v1/dolares/oficial");
          console.log(await res.json())

          if (!res.ok) throw new Error("Network response was not ok");

          const data = await res.json();

          // DolarApi returns the rate in the 'promedio' field
          if (data && data.promedio) {
            setConversionRate(data.promedio);
          } else {
            console.warn("Conversion API returned unexpected format, using fallback");
            setConversionRate(54.00); // Current approximate fallback for 2025
          }
        } catch (err) {
          console.error("Failed to fetch conversion rate:", err);
          setConversionRate(54.00); // Fallback if API is down
        }
      } else {
        // For Cash (Ref) or Zelle, the multiplier is 1 
        // because the base prices in your store are already in Ref/USD
        setConversionRate(1);
      }
    };

    fetchRate();
  }, [selectedPayment, setConversionRate]);
};