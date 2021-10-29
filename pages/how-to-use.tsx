import { GetServerSideProps } from 'next';
import { HowToUse } from '../components/HowToUse';
import { Layout } from '../components/Layout';
import { getMdxRemoteProps } from '../lib/markdown';

export default function HowToUsePage({ source, frontMatter }) {
  return (
    <Layout isLoggedInToARoom={false} isFetching={false} title="How to Use">
      <HowToUse source={source} frontMatter={frontMatter} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const mdxRemoteProps = await getMdxRemoteProps({
    fileName: 'how-to-use.mdx'
  });

  return {
    props: mdxRemoteProps
  };
};
