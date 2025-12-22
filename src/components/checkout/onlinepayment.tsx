import { authClient } from "@/provider/user.provider";
import { usePriceCalculations } from "@/store/calculationStore";
import {
  Box,
  Button,
  Heading,
  Input,
  Spinner,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { usePaymentInputs } from "react-payment-inputs";

export default function OnlinePaymentUI() {
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    accountType: "CA",
    telephonePin: "",
  });

  const [c2pData, setC2pData] = useState({
    originMobile: "",
    destinationMobile: "04241574090",
    destinationId: "412241940",
    purchaseCode: "",
  });

  function normalizePhone(phone: string) {
    const digits = phone.replace(/\D/g, "");

    return digits.slice(-11);
  }

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getCardNumberProps, getExpiryDateProps, getCVCProps } =
    usePaymentInputs();

  const summary = usePriceCalculations();

  function generateDateBasedInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const randomNumber = Math.floor(Math.random() * 10000);
    return `${year}${month}${randomNumber}`;
  }

  const { data } = authClient.useSession();

  const customerId = data?.session.id;

  async function handlePay() {
    if (!cardData.cardNumber || !cardData.expirationDate || !cardData.cvv) {
      toast.error("Fill all card details");
      return;
    }

    setIsSubmitting(true);

    const invoiceNumber = generateDateBasedInvoiceNumber();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/create-payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cardNumber: cardData.cardNumber.replace(/\s+/g, ""),
            expirationDate: (() => {
              const cleanDate = cardData.expirationDate.replace(/\s+/g, "");
              const [mm, yy] = cleanDate.split("/");
              return `20${yy}/${mm}`;
            })(),
            cvv: cardData.cvv,
            amount: summary.finalTotal,
            customerId: customerId,
            invoiceNumber: invoiceNumber,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Payment failed");
      }
      toast.success("Payment done");
    } catch (err: any) {
      console.error("Pay error:", err);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleC2PPay() {
    if (
      !c2pData.originMobile ||
      !c2pData.destinationMobile ||
      !c2pData.destinationId ||
      !c2pData.purchaseCode
    ) {
      toast.error("Fill all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/c2p`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            origin_mobile_number: normalizePhone(c2pData.originMobile),
            destination_mobile_number: c2pData.destinationMobile,
            destination_id: c2pData.destinationId,
            payment_reference: c2pData.purchaseCode,
            amount: summary.finalTotal,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "C2P Payment failed");
      toast.success("Pago C2P exitoso");
    } catch (err: any) {
      console.error("C2P error:", err);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const { placeholder: defaultCardPlace, ...cardNumberProps } =
    getCardNumberProps({
      onChange: (e: any) =>
        setCardData({ ...cardData, cardNumber: e.target.value }),
    });

  return (
    <Box w="100%" mt={8}>
      <Heading as="h2" size="lg" color="#4A7C59" mb={4}>
        Bolivares
      </Heading>

      <Tabs.Root
        defaultValue="mobilePayment"
        variant="enclosed"
        colorScheme="green"
      >
        <Tabs.List mb="1em">
          <Tabs.Trigger value="mobilePayment">Pago móvil (C2P)</Tabs.Trigger>
          <Tabs.Trigger value="cardPayment">
            Tarjeta de Débito / Crédito
          </Tabs.Trigger>
        </Tabs.List>

        {/* Pestaña de Pago Móvil */}
        <Tabs.Content
          value="mobilePayment"
          bg="white"
          p={{ base: 4, md: 6 }}
          borderRadius="md"
          shadow="sm"
        >
          <VStack align="stretch">
            <Text color="gray.600">
              Realice el pago usando el servicio C2P de Mercantil u otro banco.
            </Text>

            <Input
              placeholder="Origen (Móvil)"
              value={c2pData.originMobile}
              onChange={(e) =>
                setC2pData({ ...c2pData, originMobile: e.target.value })
              }
            />
            <Input
              placeholder="Destino (Móvil)"
              value={c2pData.destinationMobile}
              disabled
            />
            <Input
              placeholder="Identificación destino"
              value={c2pData.destinationId}
              disabled
            />
            <Input
              placeholder="Código de compra (Purchase code)"
              value={c2pData.purchaseCode}
              onChange={(e) =>
                setC2pData({ ...c2pData, purchaseCode: e.target.value })
              }
            />
            <Button colorScheme="green" onClick={handleC2PPay}>
              Realizar Pago C2P
            </Button>
          </VStack>
        </Tabs.Content>

        {/* Pestaña de Pago con Tarjeta */}
        <Tabs.Content
          value="cardPayment"
          bg="white"
          borderRadius="md"
          shadow="sm"
        >
          <Box mx="auto" p={4}>
            <Heading size="md" mb={4}>
              Pago tarjeta con 2FA
            </Heading>
            <VStack align="stretch">
              <Input
                {...cardNumberProps}
                placeholder={"Número de tarjeta"}
                value={cardData.cardNumber}
              />
              <Input
                {...getExpiryDateProps({
                  onChange: (e: any) =>
                    setCardData({
                      ...cardData,
                      expirationDate: e.target.value,
                    }),
                })}
                value={cardData.expirationDate}
              />
              <Input
                {...getCVCProps({
                  onChange: (e: any) =>
                    setCardData({ ...cardData, cvv: e.target.value }),
                })}
                value={cardData.cvv}
              />
              <Input
                name="amount"
                placeholder="Monto"
                type="number"
                value={summary.finalTotal.toFixed(2)}
                disabled
              />

              <Button colorScheme="green" onClick={handlePay}>
                {isSubmitting ? <Spinner /> : "Pagar"}
              </Button>
            </VStack>
          </Box>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
