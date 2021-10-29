import { Box } from '@chakra-ui/layout';
import { MDXRemote } from 'next-mdx-remote';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { ComponentProps } from 'react';

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
  // TestComponent: dynamic(() => import('../../components/TestComponent')),
  Head
};

export function HowToUse({
  source,
  frontMatter
}: {
  source: MDXRemoteProps;
  frontMatter: HowToUseFrontmatter;
}) {
  return (
    <>
      <Box px={3} py={2} component="article">
        <div className="post-header">
          <h1>{frontMatter.title}</h1>
          {frontMatter.description && (
            <p className="description">{frontMatter.description}</p>
          )}
        </div>

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
