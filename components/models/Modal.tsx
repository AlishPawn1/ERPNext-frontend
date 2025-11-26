"use client";

import { AnimatePresence, easeInOut, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

type ModalProps = {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
};

export const Modal = ({
  children,
  isOpen,
  className = "",
  onClose,
}: ModalProps) => {
  const tracked = useRef(false);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const update = (delta: number) => {
      const count = Math.max(
        0,
        parseInt(document.body.dataset.modalCount || "0", 10) + delta
      );
      document.body.classList.toggle("overflow-hidden", count > 0);
      if (count) {
        document.body.dataset.modalCount = String(count);
      } else {
        delete document.body.dataset.modalCount;
      }
    };

    if (isOpen && !tracked.current) {
      update(1);
      tracked.current = true;
    } else if (!isOpen && tracked.current) {
      update(-1);
      tracked.current = false;
    }

    return () => {
      if (tracked.current) update(-1);
    };
  }, [isOpen]);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="bg-neutral-darker/20 fixed inset-0 z-40 mb-0 flex items-center justify-center overflow-y-auto p-4"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.3, ease: easeInOut }}
            className={`section relative flex max-h-[90vh] max-w-4xl flex-col overflow-y-auto bg-gray-100 ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            <X
              onClick={onClose}
              className="text-neutral-dark hover:text-neutral-darker absolute cursor-pointer self-end transition-all duration-300 active:scale-90"
            />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
