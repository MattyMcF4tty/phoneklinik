import { NextPage } from 'next';

const TestPage: NextPage = async () => {
  const test = await fetch('http://localhost:3000/api/test', {
    cache: 'no-store',
  });

  const data = await test.json();

  return <div></div>;
};

export default TestPage;
