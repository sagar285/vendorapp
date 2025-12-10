import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

// Responsive helpers
export const wp = (percent) => (SCREEN_WIDTH * percent) / 100;
export const hp = (percent) => (SCREEN_HEIGHT * percent) / 100;
