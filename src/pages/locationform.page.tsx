import { Box, Center, Icon, Image, Spinner, Text } from "@chakra-ui/react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import React from "react";
import Locationinput from "@/components/Location/Locationinput";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ServiceTypeSelector } from "@/components/Location/servicetype";
import { useFetchBranch } from "@/hooks/branch/usefetchbranch";
import toast from "react-hot-toast";
import {
  useFetchBanner,
  useFetchLinks,
} from "@/hooks/branding/usefetchbranding";
import { useUpdateUserLocation } from "@/hooks/user/useupdatelocation";
import { useFetchCurrentUser } from "@/hooks/user/usefetchuser";
import { useMemo, useState } from "react";

export interface Branch {
  id: string;
  name: string;
  city?: { id: string; name: string };
  orderType: "pickup" | "delivery" | "both";
  deliveryRates: { min: number; max: number; price: number }[];
}

const Locationform: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { mutate: updateUserLocation, isPending: isUpdatingLocation } =
    useUpdateUserLocation();
  const { data: bannerImage } = useFetchBanner();
  const { data: allBranches, isLoading: isLoadingBranches } = useFetchBranch();
  const { data: links } = useFetchLinks();
  const { data: currentUser, isLoading: isUserLoading } = useFetchCurrentUser();

  // --- State Management ---
  const [view, setView] = useState<"city" | "branch">("city");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [cityBranches, setCityBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const branchesWithOrderType: Branch[] = useMemo(() => {
    if (!allBranches) return [];

    return allBranches.map((b: any) => ({
      ...b,
      orderType: b.orderType || "pickup",
    }));
  }, [allBranches]);

  const citiesWithBranches = useMemo(() => {
    const citySet = new Set<string>();
    branchesWithOrderType.forEach((branch) => {
      if (branch.city?.name) citySet.add(branch.city.name);
    });
    return Array.from(citySet);
  }, [branchesWithOrderType]);

  // --- Loading State ---
  if (isUserLoading || isLoadingBranches || isUpdatingLocation || isLoading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  // --- Redirect Logic ---
  const searchParams = new URLSearchParams(location.search);
  const isChangingLocation = searchParams.get("change") === "true";
  const userHasSavedLocation = !!(
    currentUser?.selectedCity || currentUser?.selectedBranch
  );

  if (userHasSavedLocation && !isChangingLocation) {
    return <Navigate to="/home" replace />;
  }

  // --- Handlers ---
  const handleCitySelect = (cityName: string) => {
    setIsLoading(true);

    const branchesInCity = branchesWithOrderType.filter(
      (branch) => branch.city?.name.toLowerCase() === cityName.toLowerCase()
    );

    if (branchesInCity.length === 1) {
      const singleBranch = branchesInCity[0];
      const deliveryType =
        singleBranch.orderType === "delivery" ? "delivery" : "pickup";
      handleFinalSelection(cityName, singleBranch, deliveryType);
      return;
    }

    if (branchesInCity.length > 1) {
      setSelectedCity(cityName);
      setCityBranches(branchesInCity);
      setView("branch");
    } else {
      toast.error(`Lo sentimos, no se encontraron sucursales en ${cityName}.`);
    }

    setIsLoading(false);
  };

  const handleBranchSelect = (branch: Branch) => {
    if (!selectedCity) return;
    const deliveryType =
      branch.orderType === "delivery" ? "delivery" : "pickup";
    handleFinalSelection(selectedCity, branch, deliveryType);
  };

  /**
   * MODIFIED: This function now stores the entire branch object from the backend
   * into local storage.
   */
  const handleFinalSelection = (
    city: string,
    branch: Branch,
    deliveryType: "pickup" | "delivery"
  ) => {
    setIsLoading(true);

    const locationData = {
      city,
      branch: branch.name,
      deliveryType,
    };

    const saveToLocalStorage = () => {
      localStorage.setItem("selectedBranch", JSON.stringify(branch));

      localStorage.setItem("selectedCity", city);
      localStorage.setItem("deliveryType", deliveryType);

      navigate("/home");
    };

    if (currentUser && currentUser.id) {
      updateUserLocation(locationData, { onSuccess: saveToLocalStorage });
    } else {
      saveToLocalStorage();
    }
  };

  const handleGoBack = () => {
    if (view === "branch") {
      setSelectedCity(null);
      setCityBranches([]);
      setView("city");
    }
  };

  const renderContent = () => {
    switch (view) {
      case "branch":
        return (
          <ServiceTypeSelector
            view={view}
            cityBranches={cityBranches}
            selectedBranch={null}
            onSelectBranch={handleBranchSelect}
            onSelectService={() => {}}
            onBack={handleGoBack}
          />
        );
      case "city":
      default:
        return (
          <Locationinput
            cities={citiesWithBranches}
            onCitySelect={handleCitySelect}
          />
        );
    }
  };

  // --- JSX Return ---
  return (
    <Box display={"flex"} height="100vh">
      <Box
        bgImage={
          bannerImage?.banner
            ? `url(${bannerImage.banner})`
            : "url(/locationbg.png)"
        }
        bgSize="cover"
        bgRepeat="no-repeat"
        bgPos="center"
        height="100vh"
        width="50%"
        display={["none", "none", "flex"]}
      >
        <Link to="/home">
          <Image src="/Logos/logo.png" alt="Logo" p={10} width={40} />
        </Link>
      </Box>

      <Box flex={1} w="50%" h="100%" bgColor="#7a9f8a" position="relative">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="flex-start"
          minHeight="80vh"
          ml={[4, 8]}
          mt={10}
        >
          <Text
            fontFamily="AmsiProCond-Black"
            color="white"
            fontSize={["2xl", "3xl", "5xl"]}
          >
            Escoge tu sede más cercana:
          </Text>
          <Text
            fontFamily="AmsiProCond"
            fontWeight="normal"
            fontSize={["md", "xl", "2xl"]}
            color="white"
          >
            porque te lo mereces...
          </Text>

          {renderContent()}
        </Box>

        <Box
          pl={[4, 8]}
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          gap={2}
          position="absolute"
          bottom={[1, 5]}
        >
          <Text fontFamily="AmsiProCond" fontSize="xl" color="white">
            Síguenos:
          </Text>
          <Box display="flex" gap={2} pt={1}>
            <Icon
              as={FaInstagram}
              color="white"
              size={"md"}
              href={links?.instagram}
            />
            <Icon
              as={FaFacebook}
              color="white"
              size={"md"}
              href={links?.facebook}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Locationform;
