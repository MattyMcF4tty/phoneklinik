import { NextPage } from 'next';

interface NotFoundPageProps {}

const NotFoundPage: NextPage<NotFoundPageProps> = async ({}) => {
  return <div className="w-full flex grow bg-red-400">sut</div>;
};

export default NotFoundPage;
