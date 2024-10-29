import { Label } from "@/Components/label";
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
          path: '/',
          icon: icon('ic-analytics'),
        },
        {
          title: 'User',
          path: '/user',
          icon: icon('ic-user'),
        },
        {
          title: 'Product',
          path: '/products',
          icon: icon('ic-cart'),
        },
      ]
    }, 
    {
      title: "Others",
      data: [
        {
          title: 'Blog',
          path: '/blog',
          icon: icon('ic-blog'),
        },
        {
          title: 'Sign in',
          path: '/sign-in',
          icon: icon('ic-lock'),
        },
        {
          title: 'Not found',
          path: '/404',
          icon: icon('ic-disabled'),
        },
      ]
    }
  ];
  