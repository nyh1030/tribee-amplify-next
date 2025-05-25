import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "./components/layout";
import { AmplifyConfig } from './components/common';
import { AuthProvider } from "./components/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "picklet - 장소 공유 플랫폼",
    description: "내가 좋아하는 기억/취향을 모아 작은 책으로 엮다",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko" className="h-full">
            <body className={`${inter.className} h-full`}>
                <AmplifyConfig />
                <AuthProvider>
                    <div className="flex flex-col min-h-screen">
                        <div className="flex-1 flex items-center justify-center">
                            {children}
                        </div>
                        <Navigation />
                    </div>
                </AuthProvider>
            </body>
        </html>
    );
}