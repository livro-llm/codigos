import { Moon, Sun, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useThemeContext } from "@/hooks/useTheme";
import { useState } from "react";

export const ModeToggle = () => {
  const { setTheme } = useThemeContext();
  const [open, setOpen] = useState(false);

  // Versão normal com Dropdown
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        aria-label="Novo Chat"
        className="cursor-pointer"
        onClick={() => {
          // Lógica para novo chat
          alert("Novo chat iniciado!");
        }}
      >
        <Edit className="w-5 h-5" />
      </Button>

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className="cursor-pointer" asChild>
          <Button variant="outline" size="icon" aria-label="Toggle theme">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setTheme("light")}
          >
            Light
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setTheme("dark")}
          >
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setTheme("system")}
          >
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
