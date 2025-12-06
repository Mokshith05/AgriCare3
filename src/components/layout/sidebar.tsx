'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Icons } from '@/components/icons';
import {
  LayoutDashboard,
  BookOpen,
  ShieldCheck,
  ClipboardList,
  Leaf,
} from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';


export function AppSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const menuItems = [
    {
      href: '/',
      label: t('sidebar.dashboard'),
      icon: LayoutDashboard,
    },
    {
      href: '/crop-advisor',
      label: t('sidebar.cropAdvisor'),
      icon: Leaf,
    },
    {
      href: '/encyclopedia',
      label: t('sidebar.encyclopedia'),
      icon: BookOpen,
    },
    {
      href: '/preventive-care',
      label: t('sidebar.preventiveCare'),
      icon: ShieldCheck,
    },
    {
      href: '/logbook',
      label: t('sidebar.logbook'),
      icon: ClipboardList,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Icons.logo className="h-8 w-8 text-primary" />
          <span className="text-lg font-semibold text-foreground">
            {t('sidebar.appName')}
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{
                    children: item.label,
                  }}
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <div className="p-4 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
            <p>&copy; {new Date().getFullYear()} {t('sidebar.appName')}</p>
          </div>
      </SidebarFooter>
    </Sidebar>
  );
}
