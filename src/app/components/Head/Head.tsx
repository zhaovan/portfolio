import Head from "next/head";

type HeadTitleProps = {
  title: string;
};

export default function HeadTitle({ title }: HeadTitleProps) {
  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
}
