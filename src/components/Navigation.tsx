
import { cn } from "@/lib/utils";
import { BarChart, Home, List, Plus } from "lucide-react";
import { NavLink } from "react-router-dom";

interface NavigationProps {
  onItemClick?: () => void;
}

const Navigation = ({ onItemClick }: NavigationProps) => {
  const navItems = [
    {
      name: "Início",
      path: "/",
      icon: <Home size={20} />,
    },
    {
      name: "Nova Entrega",
      path: "/nova-entrega",
      icon: <Plus size={20} />,
    },
    {
      name: "Entregas",
      path: "/entregas",
      icon: <List size={20} />,
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <BarChart size={20} />,
    },
  ];

  return (
    <nav className="flex-1 p-4">
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              onClick={onItemClick}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="mt-8 px-4">
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <h3 className="font-medium text-primary mb-2">Ajuda</h3>
          <p className="text-sm text-muted-foreground">
            Precisa de ajuda com o sistema Reciclafy? Consulte nossa documentação completa.
          </p>
          <a
            href="#"
            className="mt-2 text-sm text-primary font-medium inline-flex items-center"
          >
            Ver documentação
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
