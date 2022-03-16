import { MouseEvent, PropsWithChildren } from 'react';
import { Link, LinkProps } from '@chakra-ui/layout';
import { useLocation, useNavigate } from 'react-router';

export function AppLink({
  children,
  href,
  isNavbarLink,
  ...rest
}: PropsWithChildren<LinkProps> & {
  isNavbarLink?: boolean;
}) {
  const navigate = useNavigate();
  const router = useLocation();

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (href === undefined) {
      return;
    }

    e.preventDefault();
    navigate(href);
  }

  return (
    <Link
      {...rest}
      onClick={onClick}
      fontWeight={
        isNavbarLink ? (router.pathname === href ? 700 : 400) : undefined
      }
      display="inline-flex"
    >
      {children}
    </Link>
  );
}
