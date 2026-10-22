import { HowToUse } from '../../components/HowToUse';
import { Layout } from '../../components/Layout';

export function meta() {
  return [{ title: 'How to Use - TodoCoop' }];
}

export default function HowToUseRoute() {
  return (
    <Layout isLoggedInToARoom={false} isFetching={false}>
      <HowToUse />
    </Layout>
  );
}
