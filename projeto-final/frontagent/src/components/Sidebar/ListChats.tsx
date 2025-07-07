import { NavLink } from "react-router-dom";
import { useAssistantsStore } from "@/stores/Chat/useAssistantsStore";
import { useState, useRef, useEffect } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Props {
  isCollapsed: boolean;
  onSelect: (id: string) => void;
}

export default function ListChats({ isCollapsed, onSelect }: Props) {
  const assistants = useAssistantsStore((state) => state.assistants);
  const updateAssistantName = useAssistantsStore(
    (state) => state.updateAssistantName
  );
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [, setDeleteId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleEdit = (assistantId: string, currentName: string) => {
    setEditingId(assistantId);
    setEditValue(currentName);
    setOpenMenuId(null);
  };

  const handleEditSubmit = () => {
    if (editingId != null) {
      updateAssistantName(editingId, editValue);
      alert("Texto editado");
      setEditingId(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
    setOpenMenuId(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isCollapsed) return null;

  return (
    <>
      <div className="flex flex-col h-full overflow-y-auto px-2 space-y-1 mt-2 min-h-0">
        {assistants.map((assistant) => {
          const encodedId = btoa(String(assistant.id));
          return (
            <div
              key={assistant.id}
              className="relative group rounded hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              {editingId === encodedId ? (
                <input
                  value={editValue}
                  autoFocus
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={handleEditSubmit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleEditSubmit();
                    }
                  }}
                  className="w-full px-2 py-2 bg-transparent outline-none border-b border-blue-500 text-sm"
                />
              ) : (
                <NavLink
                  to={`/${encodedId}`}
                  className={({ isActive }) =>
                    `block px-2 py-2 rounded ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-200 dark:hover:bg-gray-800"
                    }`
                  }
                  onClick={() => onSelect(encodedId)}
                >
                  {assistant.name}
                </NavLink>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setOpenMenuId((prev) =>
                    prev === encodedId ? null : encodedId
                  );
                }}
                className="absolute right-2 top-2 p-1 rounded cursor-pointer block group-hover:block hover:bg-gray-300 dark:hover:bg-gray-700 md:hidden md:group-hover:block"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {openMenuId === encodedId && (
                <div
                  ref={menuRef}
                  className="absolute right-2 top-8 bg-white dark:bg-gray-900 shadow-md border border-gray-300 dark:border-gray-700 rounded z-50 w-32"
                >
                  <button
                    onClick={() => handleEdit(encodedId, assistant.name)}
                    className="flex cursor-pointer items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Pencil className="w-4 h-4" /> Renomear
                  </button>
                  <hr />
                  <button
                    onClick={() => openDeleteDialog(encodedId)}
                    className="flex cursor-pointer items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" /> Deletar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja deletar este chat?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={() => {
                alert("Deletado com sucesso");
                setDeleteDialogOpen(false);
                setDeleteId(null);
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
