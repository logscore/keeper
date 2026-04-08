import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import logoImg from "@/assets/logo.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { apiPostJson } from "@/lib/api";

interface User {
	username?: string;
	email?: string;
}

export default function DonorNav({ user }: { user: User | null }) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const initials = user?.username ? user.username[0].toUpperCase() : "D";

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
		<nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
			<div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
				<Link to="/" className="flex items-center gap-3">
					<img
						src={logoImg}
						alt="Keeper"
						className="h-9 w-9 rounded-lg object-cover"
					/>
					<span className="font-heading text-xl font-semibold text-foreground tracking-tight">
						Keeper
					</span>
				</Link>

				<div className="flex items-center gap-3">
					<div className="flex items-center gap-3 pl-4 border-l border-border">
						<div className="text-right hidden sm:block">
							<div className="font-body text-sm font-medium text-foreground">
								{user?.username || "Donor"}
							</div>
							<div className="font-body text-xs text-muted-foreground">
								{user?.email}
							</div>
						</div>
						<Avatar className="h-9 w-9">
							<AvatarFallback className="bg-primary/10 text-primary font-body text-sm font-semibold">
								{initials}
							</AvatarFallback>
						</Avatar>
					</div>
					<Button
						variant="ghost"
						size="icon"
						onClick={handleLogout}
						className="text-muted-foreground hover:text-foreground"
						title="Sign out"
					>
						<LogOut className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</nav>
	);
}
