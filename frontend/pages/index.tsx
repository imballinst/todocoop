import Link from 'next/link';
import { useEffect } from 'react';

export default function IndexPage() {
  useEffect(() => {
    async function test() {
      const res = await fetch('/api/rooms');
      const json = await res.json();
      console.log(json);
    }

    test();
  }, []);

  return (
    <>
      <h1>Hello Next.js 👋</h1>
      <p>
        <Link href="/about">
          <a>About</a>
        </Link>
      </p>
    </>
  );
}
