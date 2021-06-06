import { PropsWithChildren } from 'react';
import NextLink from 'next/link';
import { Link, LinkProps } from '@chakra-ui/layout';

export function AppLink({
  children,
  href,
  ...rest
}: PropsWithChildren<LinkProps>) {
  return (
    <NextLink passHref href={href}>
      <Link {...rest}>{children}</Link>
    </NextLink>
  );
}
