import Image from "next/image";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen flex flex-col md:flex-row">
      {/* Left: Trophy Image (hidden on mobile) */}
      <div className="hidden md:block relative w-1/2 h-full bg-primary flex-shrink-0">
        <Image src="/logos/PNG/Laranja/vertical-laranja.png" alt="Vertical Anka Logo" fill className="object-cover" priority />
      </div>
      {/* Right: Login Form, fills the rest */}
      <div className="flex-1 h-full flex items-center justify-center bg-white rounded-none md:rounded-l-3xl shadow-2xl md:-ml-8 z-10">
        <div className="flex flex-col items-center justify-center px-4 md:px-12 w-full h-full">{children}</div>
      </div>
    </div>
  );
}
