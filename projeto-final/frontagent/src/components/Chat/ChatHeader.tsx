import { ModeToggle } from "@/components/Reusable/ThemeToggle";

export default function ChatHeader() {
  return (
    <header className="hidden md:flex mb-4 items-center justify-end">
      <ModeToggle />
    </header>
  );
}
