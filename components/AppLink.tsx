import type { PropsWithChildren } from 'react';
import { Link as ChakraLink, type LinkProps } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router';

interface AppLinkProps extends LinkProps {
  href: string;
  isExternal?: boolean;
}

export function AppLink({
  children,
  href,
  isExternal,
  ...rest
}: PropsWithChildren<AppLinkProps>) {
  const { pathname } = useLocation();

  if (isExternal) {
    return (
      <ChakraLink href={href} target="_blank" rel="noreferrer" {...rest}>
        {children}
      </ChakraLink>
    );
  }

  return (
    <ChakraLink
      asChild
      fontWeight={pathname === href ? 700 : 400}
      display="inline-flex"
      {...rest}
    >
      <RouterLink to={href}>{children}</RouterLink>
    </ChakraLink>
  );
}
