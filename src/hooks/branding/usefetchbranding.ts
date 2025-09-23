import { type ErrorWithMessage, axios } from "../../configs/axios.config";
import { useQuery } from "@tanstack/react-query";

interface LogoResponse {
  logo: string;
}

interface BannerResponse {
  banner: string;
}

interface MainSectionResponse {
  mainSection: string;
}

export const useFetchLogo = () => {
  return useQuery<LogoResponse | null, ErrorWithMessage>({
    queryKey: ["fetch-logo"],

    queryFn: async () => {
      const response = await axios.get<{ data: LogoResponse | null }>(
        "/branding/fetch-branding?field=logo"
      );
      return response.data.data;
    },

    staleTime: 1000 * 60 * 5,
  });
};

export const useFetchBanner = () => {
  return useQuery<BannerResponse | null, ErrorWithMessage>({
    queryKey: ["fetch-banner"],
    queryFn: async () => {
      const response = await axios.get<{ data: BannerResponse | null }>(
        "/branding/fetch-branding?field=banner"
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useFetchMainSection = () => {
  return useQuery<MainSectionResponse | null, ErrorWithMessage>({
    queryKey: ["fetch-main-section"],
    queryFn: async () => {
      const response = await axios.get<{ data: MainSectionResponse | null }>(
        "/branding/fetch-branding?field=mainSection"
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

interface PhoneNumberResponse {
  phoneNumber: string;
}

export const useFetchPhoneNumber = () => {
  return useQuery<PhoneNumberResponse | null, ErrorWithMessage>({
    queryKey: ["fetch-phone-number"],
    queryFn: async () => {
      const response = await axios.get<{ data: PhoneNumberResponse | null }>(
        "/branding/fetch-branding?field=phoneNumber"
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
};

interface LinksResponse {
  facebook: string;
  instagram: string;
}
export const useFetchLinks = () => {
  return useQuery<LinksResponse | null, ErrorWithMessage>({
    queryKey: ["fetch-links"],
    queryFn: async () => {
      const response = await axios.get<{ data: LinksResponse | null }>(
        "/branding/fetch-branding?field=instagram&field=facebook"
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
};

interface NameResponse {
  name: string;
}
export const useFetchName = () => {
  return useQuery<NameResponse | null, ErrorWithMessage>({
    queryKey: ["fetch-name"],
    queryFn: async () => {
      const response = await axios.get<{ data: NameResponse | null }>(
        "/branding/fetch-branding?field=name"
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
};
