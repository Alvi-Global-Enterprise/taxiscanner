import Image from "next/image";

export function Logo({
  className = "",
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const logoSrc = variant === "dark" ? "/images/logo-white.png" : "/images/logo.png";

  return (
    <a href="#home" className={`inline-flex items-center transition-opacity hover:opacity-90 ${className}`}>
      <Image
        src={logoSrc}
        alt="TaxiScanner Logo"
        width={210}
        height={58}
        priority
        style={{ height: "54px", width: "auto", objectFit: "contain" }}
      />
    </a>
  );
}
