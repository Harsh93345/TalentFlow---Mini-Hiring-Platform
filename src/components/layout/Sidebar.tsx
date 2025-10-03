import {
    Briefcase,
    Users,
    ClipboardList,
    // BarChart3,
    // Settings,
    Home
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import {
    Sidebar as UISidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';

const navigationItems = [
    { title: 'Dashboard', url: '/', icon: Home },
    { title: 'Jobs', url: '/jobs', icon: Briefcase },
    { title: 'Candidates', url: '/candidates', icon: Users },
    { title: 'Assessments', url: '/assessments', icon: ClipboardList },
    // { title: 'Analytics', url: '/analytics', icon: BarChart3 },
    // { title: 'Settings', url: '/settings', icon: Settings },
];

export function Sidebar() {
    const { open } = useSidebar();

    return (
        <UISidebar className="border-r border-border">
        <SidebarContent className="py-4">
            <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                        <NavLink
                        to={item.url}
                        end={item.url === '/'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            }`
                        }
                        >
                        <item.icon className="w-4 h-4" />
                        {open && <span>{item.title}</span>}
                        </NavLink>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                </SidebarMenu>
            </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        </UISidebar>
    );
}