import Head from 'next/head';

type SeoProps = {
  pageName?: string;
};

export const Seo = ({ pageName }: SeoProps) => {
  const titleProps = ['Rick & Morty', pageName];

  return (
    <Head>
      <title>{titleProps.join(' | ')}</title>
    </Head>
  );
};

export default Seo;
