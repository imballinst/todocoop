import { Layout } from '~/components/Layout';
import { CommonMdxComponentsProvider } from '~/components/docs/mdx-components/common';
import Component from '~/components/docs/how-to-use.mdx';

export default function HowToUse() {
  return (
    <Layout isFetching={false} isLoggedInToARoom={false}>
      <CommonMdxComponentsProvider>
        <Component />
      </CommonMdxComponentsProvider>
    </Layout>
  );
}
