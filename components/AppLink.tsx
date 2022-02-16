import { PropsWithChildren } from 'react';
import NextLink from 'next/link';
import { Link, LinkProps } from '@chakra-ui/layout';
import { useRouter } from 'next/router';

export function AppLink({
  children,
  href,
  ...rest
}: PropsWithChildren<LinkProps>) {
  const router = useRouter();

  return (
    <NextLink passHref href={href}>
      <Link
        {...rest}
        fontWeight={router.pathname === href ? 700 : 400}
        display="inline-flex"
      >
        {children}
      </Link>
    </NextLink>
  );
}
