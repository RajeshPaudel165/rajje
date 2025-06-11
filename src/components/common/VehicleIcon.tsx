import React from "react";
import { View, Image } from "react-native";
import LogoSvg from "../../../assets/logo.svg";
import { theme } from "../../theme";

interface VehicleIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const VehicleIcon: React.FC<VehicleIconProps> = ({
  width = 140,
  height = 140,
  color = theme.colors.secondary,
}) => {
  try {
    return <LogoSvg width={width} height={height} fill={color} />;
  } catch (error) {
    return (
      <View
        style={{
          width,
          height,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../../../assets/logo.svg")}
          style={{
            width: width * 0.8,
            height: height * 0.8,
            tintColor: color,
          }}
          resizeMode="contain"
        />
      </View>
    );
  }
};

export default VehicleIcon;
