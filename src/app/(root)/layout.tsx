import { Suspense } from "react";
import { onBoardUser } from "@/features/auth/actions";

async function UserOnboarding() {
  await onBoardUser();
  return null;
}

export default function RootGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Suspense fallback={null}>
        <UserOnboarding />
      </Suspense>
      {children}
    </>
  );
}
