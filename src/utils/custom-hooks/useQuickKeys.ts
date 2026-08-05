import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useQuickKeys = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleModal = () => setIsModalOpen((prev) => !prev);
  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Alt + Key combinations
      if (event.altKey) {
        switch (event.key.toLowerCase()) {
          case "p":
            event.preventDefault();
            navigate("/patient-list?currentPage=1"); // Adjust path if needed
            break;
          case "a":
            event.preventDefault();
            navigate("/appointment-list?currentPage=1"); // Adjust path if needed
            break;
          case "h":
            event.preventDefault();
            navigate("/dashboard");
            break;
          case "n":
            event.preventDefault();
            navigate("/appointment-list/appointment-form"); // Adjust path if needed, guessing here based on common patterns
            break;
        }
      }

      // Shift + ? for Help
      if (event.shiftKey && event.key === "?") {
        event.preventDefault();
        toggleModal();
      }

      // Esc to close
      if (event.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, isModalOpen]);

  return { isModalOpen, closeModal, openModal };
};
