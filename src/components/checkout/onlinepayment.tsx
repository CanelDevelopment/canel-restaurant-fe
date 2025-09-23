import {
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Icon,
  Input,
  RadioGroup,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsInfo } from "react-icons/bs";

export default function OnlinePaymentUI() {
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    accountType: "CA",
    telephonePin: "",
  });

  const handleCardDataChange = (e: any) => {
    const { name, value } = e.target;
    setCardData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle changes in the RadioGroup
  const handleAccountTypeChange = (value: any) => {
    setCardData((prevData) => ({
      ...prevData,
      accountType: value,
    }));
  };

  // --- FORM SUBMISSION ---
  const handleCardPaymentSubmit = async () => {
    if (!cardData.cardNumber || !cardData.expirationDate || !cardData.cvv) {
      toast.error("Enter the info");
      return;
    }
  };

  const transactionPayload = {
    trx_type: "compra",
    payment_method: "TDC",
    card_number: cardData.cardNumber,
    customer_id: "V18366876",
    invoice_number: "INV-2025-12345",
    account_type: cardData.accountType,
    twofactor_auth: cardData.telephonePin,
    expiration_date: cardData.expirationDate,
    cvv: cardData.cvv,
    currency: "VES",
    amount: 570.99,
  };

  console.log(
    "This the payload for transacction payload:-",
    transactionPayload
  );

  return (
    <Box w="100%" mt={8}>
      <Heading as="h2" size="lg" color="#4A7C59" mb={4}>
        Online Payment
      </Heading>

      <Tabs.Root
        defaultValue="mobilePayment"
        variant="enclosed"
        colorScheme="green"
      >
        <Tabs.List mb="1em">
          <Tabs.Trigger value="mobilePayment">
            Mobile Payment (C2P)
          </Tabs.Trigger>
          <Tabs.Trigger value="cardPayment">Debit / Credit Card</Tabs.Trigger>
        </Tabs.List>

        {/* Mobile Payment Tab */}
        <Tabs.Content
          value="mobilePayment"
          bg="white"
          p={{ base: 4, md: 6 }}
          borderRadius="md"
          shadow="sm"
        >
          <VStack align="stretch">
            <Text color="gray.600">
              Make the payment using the C2P service from Mercantil or another
              bank.
            </Text>
            <Box>
              <Text color="gray.700">Your mobile phone number</Text>
              <Input placeholder="04xx-xxx-xxxx" size="lg" />
            </Box>
            <Box>
              <Text color="gray.700">Temporary Purchase Code (OTP)</Text>
              <Input placeholder="Enter the 6-digit code" size="lg" />
              <Text>
                <Icon as={BsInfo} color="blue.500" mr={2} />
                Generate this code in your bank’s application. It is a
                one-time-use code.
              </Text>
            </Box>
          </VStack>
        </Tabs.Content>

        {/* Card Payment Tab */}
        <Tabs.Content
          value="cardPayment"
          bg="white"
          p={{ base: 4, md: 6 }}
          borderRadius="md"
          shadow="sm"
        >
          <VStack align="stretch">
            <Box>
              <Text color="gray.700">Card Number</Text>
              <Input
                name="cardNumber"
                placeholder="0000 0000 0000 0000"
                size="lg"
                value={cardData.cardNumber}
                onChange={handleCardDataChange}
              />
            </Box>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <Box>
                <Text color="gray.700">Expiration Date</Text>
                <Input
                  name="expirationDate"
                  placeholder="MM/YYYY"
                  size="lg"
                  type="date"
                  value={cardData.expirationDate}
                  onChange={handleCardDataChange}
                />
              </Box>
              <Box>
                <Text color="gray.700">CVV</Text>
                <Input
                  name="cvv"
                  placeholder="123"
                  size="lg"
                  value={cardData.cvv}
                  onChange={handleCardDataChange}
                />
              </Box>
            </Grid>

            <Box>
              <Text color="gray.700">Account Type (only for Debit Card)</Text>
              <RadioGroup.Root
                name="accountType"
                // value={cardData.accountType}
                // onChange={handleAccountTypeChange}
                // value={cardData.accountType}
                onValueChange={handleAccountTypeChange}
                defaultValue={"ca"}
              >
                <HStack>
                  {items.map((item) => (
                    <RadioGroup.Item key={item.value} value={item.value}>
                      <RadioGroup.ItemHiddenInput />
                      <RadioGroup.ItemIndicator />
                      <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                    </RadioGroup.Item>
                  ))}
                </HStack>
              </RadioGroup.Root>
            </Box>

            <Box>
              <Text color="gray.700">Telephone PIN (only for Debit Card)</Text>
              <Input
                name="telephonePin"
                placeholder="Enter your telephone PIN"
                type="password"
                size="lg"
                value={cardData.telephonePin}
                onChange={handleCardDataChange}
              />
              <Text>
                <Icon as={BsInfo} color="blue.500" mr={2} />
                Required to process payments with Mercantil Debit Card.
              </Text>
            </Box>
            <Button
              colorScheme="green"
              size="lg"
              onClick={handleCardPaymentSubmit}
              mt={4}
            >
              Submit
            </Button>
          </VStack>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}

const items = [
  { label: "Checking", value: "ca" },
  { label: "Saving", value: "sa" },
];
