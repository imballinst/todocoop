import fs from 'fs';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import path from 'path';

const POSTS_PATH = path.join(process.cwd(), 'components/docs');

export async function getMdxRemoteProps({
  baseMarkdownDir = POSTS_PATH,
  fileName
}: {
  baseMarkdownDir?: string;
  fileName: string;
}) {
  const postFilePath = path.join(baseMarkdownDir, fileName);
  const source = fs.readFileSync(postFilePath);

  const { content, data } = matter(source);

  const mdxSource = await serialize(content, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: []
    },
    scope: data
  });

  return {
    source: mdxSource,
    frontMatter: data
  };
}
