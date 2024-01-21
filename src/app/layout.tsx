import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { siteConfig } from "../../config/site";

const { name: siteName, description: siteDesc} = siteConfig;
const font = Poppins({
  subsets: ["latin"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ]
})


export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`
  },
  description: siteDesc,
  icons: [
    {
      url: "/logo.svg",
      href: "/logo.svg"
    }
  ]
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}
