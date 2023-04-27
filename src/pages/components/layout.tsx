import React, { type ReactNode } from "react";

// Define the styles for the header using TailwindCSS classes
const Header = () => (
  <div className="bg-gray-900 text-white p-4">
    <h1 className="text-3xl font-bold">Header</h1>
  </div>
);

// Define the styles for the footer using TailwindCSS classes
const Footer = () => (
  <div className="bg-gray-900 text-white p-4 absolute bottom-0 w-full h-16">
    <p>Footer</p>
  </div>
);

type Props = {
  children: ReactNode;
};

// Define the overall layout of the app
export const Layout: React.FC<Props> = ({ children }: Props) => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

