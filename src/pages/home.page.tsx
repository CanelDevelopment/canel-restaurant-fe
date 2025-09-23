import React, { useEffect, useMemo, useState } from "react";
import Footer from "@/components/footer/Footer";
import { Headingsolid } from "@/components/Home/Headingsolid";
import { Heronav } from "@/components/Home/Heronav";
import Homenav from "@/components/Home/Homenav";
import { HeroSection } from "@/components/Home/HeroSection";
import { HomeFavorites } from "@/components/Home/HomeFavorites";
import { Center, Spinner, Text, Box } from "@chakra-ui/react";
import { ProductSection } from "@/components/Home/productsection";
import { useFetchMenu } from "@/hooks/product/usefetchmenu";
import SearchBar from "@/components/Home/SearchBar"; // <-- Import SearchBar
import { authClient } from "@/provider/user.provider";

// Define types for better readability
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  discount: number;
  branchId: string | null;
};

interface Category {
  id: string;
  name: string;
  products: Product[];
}

const Home: React.FC = () => {
  const { data: originalCategories, isLoading, error } = useFetchMenu();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    if (!originalCategories) return [];
    if (!searchQuery) return originalCategories;
    const lowercasedQuery = searchQuery.toLowerCase();

    return originalCategories
      .map((category: Category) => {
        const filteredProducts = category.products.filter((product) =>
          product.name.toLowerCase().includes(lowercasedQuery)
        );
        return { ...category, products: filteredProducts };
      })
      .filter((category: Category) => category.products.length > 0);
  }, [originalCategories, searchQuery]);

  const favoriteProducts = useMemo(() => {
    const favoritesCategory = filteredCategories.find(
      (category: Category) => category.name.toLowerCase() === "los favoritos"
    );
    return favoritesCategory ? favoritesCategory.products : [];
  }, [filteredCategories]);

  const renderDynamicContent = () => {
    if (isLoading) {
      return (
        <Center py={20}>
          <Spinner size={"xl"} />
        </Center>
      );
    }

    if (error) {
      return (
        <Center p={20}>
          <Text color="red.500">Could not load menu.</Text>
        </Center>
      );
    }

    const selectedBranchId = localStorage.getItem("selectedBranch");

    return filteredCategories
      .filter(
        (category: Category) => category.name.toLowerCase() !== "los favoritos"
      )
      .map((category: Category) => {
        const filteredProductsByBranch = category.products.filter(
          (product) =>
            product.branchId === selectedBranchId || product.branchId === null
        );

        if (filteredProductsByBranch.length > 0) {
          return (
            <Box
              key={category.id}
              id={category.name.replace(/\s+/g, "-").toLowerCase()}
            >
              <Headingsolid title={category.name.toUpperCase()} />
              <ProductSection products={filteredProductsByBranch} />
            </Box>
          );
        }

        return null;
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await authClient.getSession();
      console.log("data", data);
    };
    fetchData();
  }, []);

  return (
    <>
      <Homenav />
      <HeroSection />
      <Heronav />

      {/* The SearchBar is now part of the Home component */}
      <Box bg="Cbutton" px={4}>
        <SearchBar onSearch={setSearchQuery} />
      </Box>

      {/* Pass the pre-filtered favorites and loading/error states */}
      <HomeFavorites
        products={favoriteProducts}
        isLoading={isLoading}
        error={error}
      />

      {/* This will now render the remaining, pre-filtered products */}
      {renderDynamicContent()}

      <Footer />
    </>
  );
};

export default Home;
