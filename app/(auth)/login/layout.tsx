import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "wiZe (myLampAI) | Login",
  description: "wiZe (myLampAI) | Sign In / SignUp Page",
};

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
