interface IDefaultLayoutProps {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}

interface IDefaultPageProps extends Omit<IDefaultLayoutProps, "children"> {
  searchParams: Promise<{ [string]: string | string[] | undefined }>;
}
