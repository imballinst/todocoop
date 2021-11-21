import { HowToUse } from '../components/HowToUse';
import { Layout } from '../components/Layout';

export default function HowToUsePage({ source, frontMatter }) {
  return (
    <Layout isLoggedInToARoom={false} isFetching={false} title="How to Use">
      <HowToUse />
    </Layout>
  );
}
