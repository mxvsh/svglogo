export type GradientStop = { color: string; position: number };

export type Background =
  | { type: "solid"; color: string }
  | {
      type: "gradient";
      direction: number;
      stops: [GradientStop, GradientStop];
    };

export interface LogoState {
  iconName: string;
  iconColor: string;
  iconBorderColor: string;
  iconBorderWidth: number; // 0–24 px
  iconSize: number; // 10–90, percent of canvas
  iconRotation: number; // 0–360 degrees
  background: Background;
  borderRadius: number; // 0–256 px
  borderWidth: number; // 0–24 px
  borderColor: string;
}

export const DEFAULT_LOGO: LogoState = {
  iconName: "lucide:heart",
  iconColor: "#FFFFFF",
  iconBorderColor: "#111111",
  iconBorderWidth: 10,
  iconSize: 60,
  iconRotation: 0,
  background: {
    type: "gradient",
    direction: 135,
    stops: [
      {
        color: "#F74562",
        position: 0,
      },
      {
        color: "#EB4BBB",
        position: 100,
      },
    ],
  },
  borderRadius: 112,
  borderWidth: 0,
  borderColor: "#ffffff",
};
