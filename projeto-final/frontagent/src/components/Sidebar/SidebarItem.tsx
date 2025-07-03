import { useSidebarStore } from "@/stores/Sidebar/useSidebarStore";
import { Link } from "react-router-dom";

export default function SidebarItem({
  icon,
  label,
  isMobile,
  to,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  isMobile: boolean;
  to?: string;
  onClick?: () => void;
}) {
  const { isCollapsed } = useSidebarStore();

  const content = (
    <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded justify-start md:justify-start">
      {icon} {isMobile && label}
      {!isCollapsed && (
        <span className="text-sm hidden md:inline">{label}</span>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block" onClick={onClick}>
        {content}
      </Link>
    );
  }

  return <div onClick={onClick}>{content}</div>;
}
