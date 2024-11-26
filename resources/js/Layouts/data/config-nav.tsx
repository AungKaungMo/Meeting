import { SvgColor } from '@/Components/svg-color';

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
    {
      title: "Dashboard",
      type: ['owner', 'client'],
      data: [
        {
          title: 'Dashboard',
          path: '/dashboard',
          icon: icon('ic-analytics'),
          type: ['owner', 'client'],
        },
        {
          title: 'Product',
          path: '/products',
          icon: icon('ic-cart'),
          type: ['owner'],
        },
      ]
    }, 
    {
      title: "Meeting",
      type: ['employee'],
      data: [
        {
          title: 'Invitation',
          path: '/meeting-invitations',
          icon: icon('ic-invitation'),
          type: ['employee']
        },
        {
          title: 'Attendance',
          path: '/meeting-attendances',
          icon: icon('ic-attendance'),
          type: ['employee']
        },
        {
          title: 'Minute',
          path: '/meeting-minutes',
          icon: icon('ic-meeting-minute'),
          type: ['employee']
        }
      ]
    },
    {
      title: "Master Data",
      type: ['owner', 'client'],
      data: [
        {
          title: "Region & State",
          path: '/region-states',
          icon: icon('ic-region'),
          type: ['owner'],
        },
        {
          title: "Township",
          path: '/townships',
          icon: icon('ic-region'),
          type: ['owner'],
        },
        {
          title: "Department",
          path: "/departments",
          icon: icon("ic-department"),
          type: ['client'],
        },
        {
          title: "Room Location",
          path: "/room-locations",
          icon: icon("ic-region"),
          type: ['client'],
        },
        {
          title: "Employee",
          path: "/employees",
          icon: icon("ic-user"),
          type: ['client'],
        },
        {
          title: 'Packages',
          path: '/packages',
          icon: icon('ic-package'),
          type: ['owner'],
        },
        {
          title: "Company",
          path: '/companies',
          icon: icon('ic-company'),
          type: ['owner'],
        },
      ]
    },
    {
      title: "Administrations",
      type: ['owner'],
      data: [
        {
          title: 'Users',
          path: '/users',
          icon: icon('ic-user'),
          type: ['owner'],
        }
      ]
    }
  ];
  