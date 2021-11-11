import { ComponentProps, ReactNode } from 'react';
import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode';
import { Box, BoxProps } from '@chakra-ui/layout';
import { MDXRemote } from 'next-mdx-remote';
import dynamic from 'next/dynamic';
import Head from 'next/head';

type MDXRemoteProps = ComponentProps<typeof MDXRemote>;

interface HowToUseFrontmatter {
  title: string;
  description: string;
}

const Heading2 = (props) => <Box as="h2" {...props} fontSize="1.5rem" my={4} />;
const Paragraph = (props) => <Box as="p" {...props} mb={2} />;
const Pre = (props) => <Demo as="pre" {...props} p={6} fontSize="0.875rem" />;
const Ol = (props) => <Box as="ol" {...props} ml={9} />;

// Custom components/renderers to pass to MDX.
// Since the MDX files aren't loaded by webpack, they have no knowledge of how
// to handle import statements. Instead, you must include components in scope
// here.
const components = {
  // It also works with dynamically-imported components, which is especially
  // useful for conditionally loading components for certain routes.
  // See the notes in README.md for more details.
  HowToUseRoomAccess: dynamic(() =>
    import('../docs/mdx-components/how-to-use').then(
      (all) => all.HowToUseRoomAccess
    )
  ),
  HowToUseActionsMenu: dynamic(() =>
    import('../docs/mdx-components/how-to-use').then(
      (all) => all.HowToUseActionsMenu
    )
  ),
  HowToUseAddTodoButtons: dynamic(() =>
    import('../docs/mdx-components/how-to-use').then(
      (all) => all.HowToUseAddTodoButtons
    )
  ),
  HowToUseEditTodo: dynamic(() =>
    import('../docs/mdx-components/how-to-use').then(
      (all) => all.HowToUseEditTodo
    )
  ),
  Demo,
  Head,
  h2: Heading2,
  p: Paragraph,
  pre: Pre,
  ol: Ol,
  // Admonitions.
  Tip: dynamic(() =>
    import('../docs/mdx-components/common').then((all) => all.AdmonitionTip)
  ),
  Warning: dynamic(() =>
    import('../docs/mdx-components/common').then((all) => all.AdmonitionWarning)
  )
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
function Demo({ children, ...props }: BoxProps) {
  const borderColor = useColorModeValue('gray.800', 'gray.600');

  return (
    <Box
      my={4}
      p={4}
      borderColor={borderColor}
      borderWidth={1}
      borderStyle="dotted"
      rounded="md"
      {...props}
    >
      {children}
    </Box>
  );
}
