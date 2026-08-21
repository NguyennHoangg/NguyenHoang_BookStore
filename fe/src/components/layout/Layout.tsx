import Header from "./header";
import Footer from "./footer";
import { type ReactNode } from "react";

export interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <>
        <Header />
        <main>{children}</main>
        <Footer />
        </>
    )
}