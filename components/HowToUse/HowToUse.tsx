import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode';
import { Box } from '@chakra-ui/layout';
import { MDXRemote } from 'next-mdx-remote';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { ComponentProps, ReactNode } from 'react';

type MDXRemoteProps = ComponentProps<typeof MDXRemote>;

interface HowToUseFrontmatter {
  title: string;
  description: string;
}

// Custom components/renderers to pass to MDX.
// Since the MDX files aren't loaded by webpack, they have no knowledge of how
// to handle import statements. Instead, you must include components in scope
// here.
const components = {
  // It also works with dynamically-imported components, which is especially
  // useful for conditionally loading components for certain routes.
  // See the notes in README.md for more details.
  HowToUseRoomAccess: dynamic(
    () => import('../docs/mdx-components/how-to-use').then(all => all.HowToUseRoomAccess)
  ),
  HowToUseHelpMenu: dynamic(
    () => import('../docs/mdx-components/how-to-use').then(all => all.HowToUseHelpMenu)
  ),
  Demo,
  Head
};

export function HowToUse({
  source,
  frontMatter
}: {
  source: MDXRemoteProps;
  frontMatter: HowToUseFrontmatter;
}) {
  const hasFrontmatter = Object.keys(frontMatter).length > 0;

  return (
    <>
      <Box px={3} py={2} component="article">
        {hasFrontmatter && (
          <div className="post-header">
            <h1>{frontMatter.title}</h1>
            {frontMatter.description && (
              <p className="description">{frontMatter.description}</p>
            )}
          </div>
        )}

        <MDXRemote {...source} components={components} />
      </Box>

      <style jsx>{`
        .post-header h1 {
          margin-bottom: 0;
        }

        .post-header {
          margin-bottom: 2rem;
        }
        .description {
          opacity: 0.6;
        }
      `}</style>
    </>
  );
}

// Components.
function Demo({ children }: { children: ReactNode }) {
  const borderColor = useColorModeValue('gray.800', 'gray.600');

  return (
    <Box
      my={4}
      borderColor={borderColor}
      borderWidth={1}
      borderStyle="dotted"
      rounded="md"
    >
      {children}
    </Box>
  );
}
