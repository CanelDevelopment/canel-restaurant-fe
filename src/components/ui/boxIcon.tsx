import { Image } from "@chakra-ui/react";
import React from "react";

interface IconProps {
  size?: number;
  color?: string;
}

export const BoxIcon: React.FC<IconProps> = () => (
    <Image src="/Icon/carton.png" />
);

