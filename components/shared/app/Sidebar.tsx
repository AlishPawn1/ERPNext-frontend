import React, { useState } from "react";
import {
  Home,
  Users,
  Settings,
  ChevronDown,
  ChevronUp,
  Box,
  Edit,
  Tag,
  Columns,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type SidebarLink = {
  name: string;
  href?: string;
  icon: React.ElementType;
  children?: SidebarLink[];
};

const sidebarLinks: SidebarLink[] = [
  { name: "Dashboard", href: "/app/dashboard", icon: Home },
  { name: "Home", href: "/app/home", icon: Settings },
  {
    name: "Users",
    icon: Users,
    children: [
      { name: "All Users", href: "/app/users/all", icon: Users },
      { name: "Add User", href: "/app/users/add", icon: Users },
    ],
  },
  { name: "Stock", href: "/app/stock", icon: Box },
  { name: "Stock Item", href: "/app/stock-item", icon: Box },
  { name: "Stock Item Group", href: "/app/stock-item-group", icon: Tag },
  { name: "UOM", href: "/app/uom", icon: Columns },
  { name: "Customize Field", href: "/app/customize-field", icon: Edit },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4 flex flex-col sticky top-0 overflow-y-auto shadow-sm">
      <div className="text-xl font-bold mb-6">Admin Panel</div>

      <nav className="flex flex-col space-y-2">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.href === pathname ||
            link.children?.some((child) => child.href === pathname);
          const isOpen = openMenus[link.name] || false;

          return (
            <div key={link.name}>
              {/* Parent Link */}
              <div
                className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer hover:bg-gray-700 transition-colors ${
                  isActive ? "bg-gray-700" : ""
                }`}
              >
                {/* Parent link */}
                {link.href ? (
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 flex-1"
                  >
                    <Icon size={20} />
                    <span>{link.name}</span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 flex-1">
                    <Icon size={20} />
                    <span>{link.name}</span>
                  </div>
                )}

                {/* Submenu toggle */}
                {link.children && (
                  <button
                    onClick={() => toggleMenu(link.name)}
                    className="ml-2 focus:outline-none"
                    type="button"
                  >
                    {isOpen ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                )}
              </div>

              {/* Sub-menu */}
              {link.children && isOpen && (
                <div className="flex flex-col pl-6 mt-1 space-y-1">
                  {link.children.map((child) => {
                    const ChildIcon = child.icon;
                    const isChildActive = pathname === child.href;
                    const classes = `flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 transition-colors ${
                      isChildActive ? "bg-gray-700" : ""
                    }`;

                    return child.href ? (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={classes}
                      >
                        <ChildIcon size={16} />
                        <span>{child.name}</span>
                      </Link>
                    ) : (
                      <div key={child.name} className={classes}>
                        <ChildIcon size={16} />
                        <span>{child.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export { Sidebar };
