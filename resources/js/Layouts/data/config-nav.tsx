import { SvgColor } from '@/Components/svg-color';

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
    {
      title: "Dashboard",
      data: [
        {
          title: 'Dashboard',
          path: '/dashboard',
          icon: icon('ic-analytics'),
        },
        {
          title: 'Product',
          path: '/products',
          icon: icon('ic-cart'),
        },
      ]
    }, 
    {
      title: "Clients",
      data: [
        {
          title: "Company",
          path: '/companies',
          icon: icon('ic-company')
        },
        {
          title: "Business Unit",
          path: '/business_units',
          icon: icon('ic-company')
        },
        {
          title: "Department",
          path: "/department",
          icon: icon("ic-department")
        }
      ]
    },
    {
      title: "Administrations",
      data: [
        {
          title: 'Packages',
          path: '/packages',
          icon: icon('ic-package'),
        },
        {
          title: 'Users',
          path: '/users',
          icon: icon('ic-user'),
        }
      ]
    }
  ];
  