import "./globals.css";
import Providers from "@/components/ui/Providers";

export const metadata = {
  title: "Proben | Healthcare Coordination Platform",
  description: "B2B Healthcare Services Coordination",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
