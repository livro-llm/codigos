import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useThemeContext } from "@/hooks/useTheme";
import { useState } from "react";

interface ModeToggleProps {
  collapsed?: boolean;
}

export const ModeToggle = ({ collapsed = false }: ModeToggleProps) => {
  const { theme, setTheme } = useThemeContext();
  const [open, setOpen] = useState(false);

  const isDark = theme === "dark";

  if (collapsed) {
    // Só botão ícone que alterna direto entre light/dark (sem dropdown)
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label="Toggle theme"
        title="Alternar tema claro/escuro"
      >
        <Sun
          className={`h-[1.2rem] w-[1.2rem] transition-all ${
            isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"
          }`}
        />
        <Moon
          className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
            isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"
          }`}
        />
      </Button>
    );
  }

  // Versão normal com Dropdown
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Toggle theme">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
