import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
	BarChart3,
	FileText,
	HandCoins,
	Home as HomeIcon,
	LayoutDashboard,
	LogOut,
	Users,
} from "lucide-react";
import logoImg from "@/assets/logo.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { apiPostJson } from "@/lib/api";

interface User {
	username?: string;
	email?: string;
}

interface NavItem {
	icon: LucideIcon;
	label: string;
	path: string;
}

const navItems: NavItem[] = [
	{ icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
	{
		icon: HandCoins,
		label: "Donors & Contributions",
		path: "/donors-contributions",
	},
	{ icon: Users, label: "Caseload Inventory", path: "/caseload" },
	{ icon: FileText, label: "Process Recordings", path: "/process-recordings" },
	{ icon: HomeIcon, label: "Home Visitations", path: "/home-visitations" },
	{ icon: BarChart3, label: "Reports & Analytics", path: "/reports" },
];

export default function AdminSidebar({ user }: { user: User | null }) {
	const location = useLocation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const currentPath = location.pathname + location.searchStr;

	const initials = user?.username ? user.username[0].toUpperCase() : "A";

	const handleLogout = async () => {
		try {
			await apiPostJson("/api/auth/logout");
		} catch {
			// Proceed with client-side logout even if the API call fails.
		}
		queryClient.clear();
		await navigate({ to: "/login" });
	};

	return (
		<aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar flex flex-col z-50">
			<div className="p-5 flex items-center gap-3 border-b border-sidebar-border">
				<img src={logoImg} alt="Keeper" className="h-9 w-9 rounded-lg" />
				<span className="font-heading text-lg font-semibold text-sidebar-foreground">
					Keeper
				</span>
			</div>

			<nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
				{navItems.map((item) => {
					const isActive =
						currentPath === item.path ||
						(item.path === "/admin" &&
							location.pathname === "/admin" &&
							!location.searchStr);
					return (
						<Link
							key={item.label}
							to={item.path}
							className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm transition-all duration-200 ${
								isActive
									? "bg-sidebar-accent text-sidebar-primary font-semibold"
									: "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
							}`}
						>
							<item.icon className="h-5 w-5 flex-shrink-0" />
							{item.label}
						</Link>
					);
				})}
			</nav>

			<div className="p-4 border-t border-sidebar-border">
				<div className="flex items-center gap-3">
					<Avatar className="h-9 w-9">
						<AvatarFallback className="bg-sidebar-accent text-sidebar-primary font-body text-sm font-semibold">
							{initials}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1 min-w-0">
						<div className="font-body text-sm font-medium text-sidebar-foreground truncate">
							{user?.username || "Admin"}
						</div>
						<div className="font-body text-xs text-sidebar-foreground/50 truncate">
							{user?.email}
						</div>
					</div>
					<button
						type="button"
						onClick={handleLogout}
						className="p-1.5 rounded-lg text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
						title="Sign out"
					>
						<LogOut className="h-4 w-4" />
					</button>
				</div>
			</div>
		</aside>
	);
}
