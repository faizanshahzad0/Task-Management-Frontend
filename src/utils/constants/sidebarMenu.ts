import { IconType } from 'react-icons';
import { TbChecklist, TbUsers } from 'react-icons/tb';

export interface SidebarMenuItem {
  label: string;
  link: string;
  icon?: IconType;
}

export const SIDEBAR_MENU: SidebarMenuItem[] = [
  {
    label: 'Tasks',
    link: '/tasks',
    icon: TbChecklist,
  },
  {
    label: 'Users',
    link: '/users',
    icon: TbUsers,
  },
];

