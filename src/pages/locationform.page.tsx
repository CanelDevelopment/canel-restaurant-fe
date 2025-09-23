import {
  Box,
  Center,
  Container,
  Icon,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import React, { useState, useMemo } from "react"; // 1. Import useMemo
import Locationinput from "@/components/Location/Locationinput";
import LocationDrawer from "@/components/Location/LocationDrawer";
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

interface Branch {
  id: string;
  name: string;
  serviceTypes: string[];
  city?: {
    id: string;
    name: string;
  };
  areas?: string[];
}

const Locationform: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Data fetching hooks
  const { mutate: updateUserLocation, isPending: isUpdatingLocation } =
    useUpdateUserLocation();
  const { data: bannerImage } = useFetchBanner();
  const { data: allBranches, isLoading: isLoadingBranches } = useFetchBranch();
  const { data: links } = useFetchLinks();
  const { data: currentUser, isLoading: isUserLoading } = useFetchCurrentUser();

  // State hooks
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isLoadingCity, setIsLoadingCity] = useState(false);
  const [cityBranches, setCityBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectionStep, setSelectionStep] = useState<
    "service" | "pickup" | "delivery_branch" | "delivery_area"
  >("service");

  // 2. Memoize a unique list of cities that have branches
  const citiesWithBranches = useMemo(() => {
    if (!allBranches) return [];
    const citySet = new Set<string>();
    allBranches.forEach((branch) => {
      if (branch.city?.name) {
        citySet.add(branch.city.name);
      }
    });
    return Array.from(citySet);
  }, [allBranches]);

  if (isUserLoading) {
    return (
      <Center height="100vh" w="100vw">
        <Spinner size="xl" />
      </Center>
    );
  }

  const searchParams = new URLSearchParams(location.search);
  const isChangingLocation = searchParams.get("change") === "true";
  const userHasSavedLocation = !!(
    currentUser?.selectedCity || currentUser?.selectedBranch
  );

  if (userHasSavedLocation && !isChangingLocation) {
    return <Navigate to="/home" replace />;
  }

  if (isLoadingBranches || isLoadingCity || isUpdatingLocation) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  // 3. This function contains the main logic change
  const handleCitySelect = (cityName: string) => {
    setIsLoadingCity(true);
    if (!allBranches) {
      toast.error("Branch data is not available yet. Please wait a moment.");
      setIsLoadingCity(false);
      return;
    }

    const branchesInCity = allBranches.filter(
      (branch) => branch.city?.name.toLowerCase() === cityName.toLowerCase()
    );

    // --- START: MODIFIED LOGIC FOR SINGLE-BRANCH CITIES ---
    if (branchesInCity.length === 1) {
      const singleBranch = branchesInCity[0];
      const locationData = {
        city: cityName,
        branch: singleBranch.name,
        deliveryType: "pickup", // Force deliveryType to pickup
        area: "N/A",
      };

      toast.success(
        `Welcome to our ${cityName} branch! Pick-up has been selected automatically.`
      );

      // Handle both logged-in and logged-out users
      if (currentUser && currentUser.id) {
        updateUserLocation(locationData, {
          onSuccess: () => {
            localStorage.setItem("selectedCity", cityName);
            localStorage.setItem("selectedBranch", singleBranch.id);
            localStorage.setItem("deliveryType", "pickup");
            localStorage.removeItem("selectedArea");
            navigate("/home");
          },
        });
      } else {
        localStorage.setItem("selectedCity", cityName);
        localStorage.setItem("selectedBranch", singleBranch.id);
        localStorage.setItem("deliveryType", "pickup");
        localStorage.removeItem("selectedArea");
        navigate("/home");
      }
      return; // Exit the function after handling
    }
    // --- END: MODIFIED LOGIC ---

    if (branchesInCity.length > 1) {
      setCityBranches(branchesInCity);
      setSelectedCity(cityName);
    } else {
      // This case should no longer be reachable if the input is filtered,
      // but we keep it as a safeguard.
      toast.error(`Sorry, no branches were found in ${cityName}.`);
      localStorage.removeItem("selectedCity");
    }
    setIsLoadingCity(false);
  };

  // (The rest of the functions: handleSelectServiceType, handleSelectPickupBranch, etc. remain unchanged)
  const handleSelectServiceType = (type: "pickup" | "delivery") => {
    if (type === "pickup") setSelectionStep("pickup");
    else setSelectionStep("delivery_branch");
  };

  const handleSelectPickupBranch = (branch: Branch) => {
    if (!selectedCity) return;
    const locationData = {
      city: selectedCity,
      branch: branch.name,
      deliveryType: "pickup",
      area: "N/A",
    };
    if (currentUser && currentUser.id) {
      updateUserLocation(locationData, {
        onSuccess: () => {
          localStorage.setItem("deliveryType", "pickup");
          localStorage.setItem("selectedBranch", branch.id);
          localStorage.setItem("selectedCity", selectedCity);
          localStorage.removeItem("selectedArea");
          navigate("/home");
        },
      });
      return;
    }
    localStorage.setItem("deliveryType", "pickup");
    localStorage.setItem("selectedBranch", branch.id);
    localStorage.setItem("selectedCity", selectedCity);
    localStorage.removeItem("selectedArea");
    navigate("/home");
  };

  const handleSelectDeliveryBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setSelectionStep("delivery_area");
  };

  const handleSelectDeliveryArea = (area: string) => {
    if (selectedBranch && selectedCity) {
      const locationData = {
        city: selectedCity,
        branch: selectedBranch.name,
        deliveryType: "delivery",
        area: area,
      };
      if (currentUser && currentUser.id) {
        updateUserLocation(locationData, {
          onSuccess: () => {
            localStorage.setItem("deliveryType", "delivery");
            localStorage.setItem("selectedBranch", selectedBranch.id);
            localStorage.setItem("selectedArea", area);
            localStorage.setItem("selectedCity", selectedCity);
            navigate("/home");
          },
        });
        return;
      }
      localStorage.setItem("deliveryType", "delivery");
      localStorage.setItem("selectedBranch", selectedBranch.id);
      localStorage.setItem("selectedArea", area);
      localStorage.setItem("selectedCity", selectedCity);
      navigate("/home");
    }
  };

  const handleGoBack = () => {
    if (selectionStep === "delivery_area") setSelectionStep("delivery_branch");
    else setSelectionStep("service");
  };

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
        width="100vw"
        position="relative"
        flex={1}
        w="50%"
        display={["none", "none", "flex"]}
      >
        <Link to="/home">
          <Image src="/Logos/logo.png" alt="Logo" p={10} width={40} />
        </Link>
      </Box>

      {/* Right Side */}
      <Box flex={1} w="50%" h="100%" bgColor="#7a9f8a" position="relative">
        <Container
          position="absolute"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          right={0}
          top={[4, 6]}
          w={["100%", "100%", "auto"]}
        >
          <Link to="/home">
            <Image
              src="/Logos/logo.png"
              alt="Logo"
              width={[20, 28]}
              ml={[4, 4]}
              mt={4}
              display={["flex", "flex", "none"]}
            />
          </Link>
          <LocationDrawer />
        </Container>

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

          {selectedCity ? (
            <ServiceTypeSelector
              cityBranches={cityBranches}
              step={selectionStep}
              selectedBranch={selectedBranch}
              onSelectService={handleSelectServiceType}
              onSelectPickupBranch={handleSelectPickupBranch}
              onSelectDeliveryBranch={handleSelectDeliveryBranch}
              onSelectDeliveryArea={handleSelectDeliveryArea}
              onBack={handleGoBack}
            />
          ) : (
            <Locationinput cities={citiesWithBranches}  onCitySelect={handleCitySelect} />
          )}
        </Box>

        {/* Footer Socials (unchanged) */}
        <Box
          pl={[4, 8]}
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          gap={2}
          position="absolute"
          bottom={10}
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
