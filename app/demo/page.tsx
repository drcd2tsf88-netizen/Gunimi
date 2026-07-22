import DemoDashboardPage from "@/components/demo/DemoDashboardPage";

type Props = {
  searchParams: Promise<{ section?: string }>;
};

export default async function DemoPage({ searchParams }: Props) {
  const { section } = await searchParams;
  return <DemoDashboardPage initialSection={section} />;
}
