"use client";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import { ModalProvider, useModal } from "@/context/ModalContext";
import ConfirmModal from "@/components/ConfirmModal";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body data-theme="light">
        <AuthProvider>
          <ModalProvider>
            {children}
            <ConfirmModalWrapper />
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
export function ConfirmModalWrapper() {
  const { modal, closeModal } = useModal();
  return (
    <ConfirmModal
      isOpen={modal.isOpen}
      onClose={closeModal}
      onConfirm={modal.onConfirm}
      title={modal.title}
      message={modal.message}
    />
  );
}
