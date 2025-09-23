import {
  Image,
  Box,
  Text,
  Flex,
  Center,
  Select,
  createListCollection,
  Portal,
  Skeleton,
} from "@chakra-ui/react";
import { ChartSectionHeader } from "./chart/chartSectionHeader";
import { Tracking } from "./tracking/tracking";
import { useStepper, type UseStepper } from "@/hooks/usestepper";
import { DashLogoButtons } from "./dashlogobuttons";
import type { DashboardSteps } from "@/pages/dashboard.page";
import { useFetchBranch } from "@/hooks/branch/usefetchbranch";
import { useState, useMemo, useEffect } from "react";
import { useFetchCurrentUser } from "@/hooks/user/usefetchuser";

export type DashboardHeaderProps = {
  steps?: DashboardSteps[];
} & UseStepper<DashboardSteps>;

export const DashboardHeader = () => {
  const { data: user, isLoading: isAuthLoading } = useFetchCurrentUser();
  const { data: allBranches, isLoading: areBranchesLoading } = useFetchBranch();

  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [selectedBranchText, setSelectedBranchText] = useState<string>("");
  const steps: DashboardSteps[] = ["dashboard", "tracking"];
  const stepperProps = useStepper<DashboardSteps>(steps);

  const availableBranches = useMemo(() => {
    if (!user || !allBranches) return [];

    if (user.role.toLowerCase() === "admin") {
      return allBranches;
    }

    if (user.role.toLowerCase() === "manager" && user.id) {
      const assignedBranch = allBranches.find(
        (branch) => branch.manager?.id === user.id
      );
      return assignedBranch ? [assignedBranch] : [];
    }

    return [];
  }, [user, allBranches]);

  const branchOptions = createListCollection({
    items: [
      ...(user && user.role.toLowerCase() === "admin"
        ? [{ key: "all", textValue: "All Branches", children: "All Branches" }]
        : []),
      ...(availableBranches?.map((branch) => ({
        key: branch.id,
        textValue: branch.name,
        children: branch.name,
      })) || []),
    ],
  });

  useEffect(() => {
    if (isAuthLoading || areBranchesLoading || !user) return;

    if (user.role.toLowerCase() === "admin") {
      setSelectedBranchId("all");
      setSelectedBranchText("All Branches");
    } else if (
      user.role.toLowerCase() === "manager" &&
      availableBranches.length > 0
    ) {
      setSelectedBranchId(availableBranches[0].id);
      setSelectedBranchText(availableBranches[0].name);
    } else {
      setSelectedBranchText("No branch assigned");
    }
  }, [user, availableBranches, isAuthLoading, areBranchesLoading]);

  return (
    <Box width={["100%"]} bg="white">
      <DashLogoButtons />

      <Flex
        px={[3, 4, 10]}
        gap={2}
        py={6}
        flexDirection={["column"]}
        bg={"Dgreen"}
      >
        <Center
          justifyContent={["space-between", "space-between", "space-between"]}
          fontFamily={"AmsiProCond"}
          flexDirection={["column", "row"]}
          alignItems={["start", "center"]}
          w={"full"}
          gapY={2}
        >
          <Text
            fontSize={["2xl", "3xl"]}
            fontFamily={"AmsiProCond-Black"}
            color={"Cbutton"}
          >
            {stepperProps.isStepActive("dashboard")
              ? "TABLEAU DE BORD"
              : "SEGUIMIENTO"}
          </Text>
        </Center>
        {stepperProps.isStepActive("dashboard") ? (
          <Text
            fontSize={["11px", "xs", "sm"]}
            width={["100%", "100%", "72%"]}
            fontWeight={"normal"}
            color={"black"}
            marginTop={0}
            lineHeight={1.2}
            fontFamily={"AmsiProCond"}
            mt={[4, 0]}
          >
            Merci d'avoir choisi Canel Restaurante. Notre système intelligent et
            convivial est conçu pour optimiser vos opérations, booster vos
            ventes en ligne et améliorer votre rentabilité.
          </Text>
        ) : null}
      </Flex>

      {stepperProps.step === "dashboard" && (
        <>
          <Image
            loading="lazy"
            src="/admin/Ad4.png"
            alt="Logo"
            height={["22%"]}
            width={["100%"]}
          />
          <Box width={"100%"} bg={"white"} px={[3, 3, 10]} py={6}>
            <Box width={["100%", "100%", "30%"]}>
              {isAuthLoading || areBranchesLoading ? (
                <Box h="42px">
                  <Skeleton height="40px" width="100px" />
                </Box>
              ) : (
                <Select.Root
                  collection={branchOptions}
                  value={[selectedBranchId]}
                  onValueChange={(details) => {
                    const selectedItem = branchOptions.items.find(
                      (item) => item.key === details?.value[0]
                    );
                    if (selectedItem) {
                      setSelectedBranchId(selectedItem.key);
                      setSelectedBranchText(selectedItem.textValue);
                    }
                  }}
                >
                  <Select.Control>
                    <Select.Trigger bg="#ebebeb" h="42px" border="none">
                      <Select.ValueText placeholder="Seleccionar Sucursal">
                        {selectedBranchText}
                      </Select.ValueText>
                      <Select.Indicator color={"#575757"} />
                    </Select.Trigger>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner zIndex={2000}>
                      <Select.Content zIndex={2000}>
                        {branchOptions.items.map((item) => (
                          <Select.Item key={item.key} item={item.key}>
                            {item.textValue}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              )}
            </Box>
          </Box>
          <ChartSectionHeader
            selectedBranchId={selectedBranchId}
            {...stepperProps}
          />
        </>
      )}
      {stepperProps.step === "tracking" && <Tracking />}
    </Box>
  );
};
