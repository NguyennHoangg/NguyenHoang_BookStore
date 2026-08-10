import { useState } from "react";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import Button from "../components/button/button";
import { NotificationModal } from "../components/modals/notificationModal";

type NotifState = { message: string; type: "success" | "error" } | null;

export default function HomePage() {
    const [notif, setNotif] = useState<NotifState>(null);

    return (
        <div className="flex flex-col min-h-screen bg-surface">
            <Header />
            <main className="flex-grow flex items-center justify-center gap-4">
                <Button variant="primary" onClick={() => setNotif({ message: "Đặt hàng thành công!", type: "success" })}>
                    Test Success
                </Button>
                <Button variant="secondary" onClick={() => setNotif({ message: "Đã xảy ra lỗi, vui lòng thử lại!", type: "error" })}>
                    Test Error
                </Button>
            </main>
            <Footer />

            {notif && (
                <NotificationModal
                    message={notif.message}
                    type={notif.type}
                    onClose={() => setNotif(null)}
                />
            )}
        </div>
    );
}
