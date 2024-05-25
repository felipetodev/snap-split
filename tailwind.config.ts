import type { Config } from "tailwindcss";
import Typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./app/**/*.{ts,tsx,mdx}"],
  theme: {},
  plugins: [Typography],
};
export default config;
