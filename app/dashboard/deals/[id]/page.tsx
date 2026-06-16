import { notFound } from "next/navigation";

import {
  getDeal,
} from "@/server/actions/deals/getDeal";

import DealDetailView
from "@/components/deals/detail/DealDetailView";

type Props = {
  params: {
    id: string;
  };
};

export default async function DealPage({
  params,
}: Props) {
  const data =
    await getDeal(
      params.id
    );

  if (!data) {
    notFound();
  }

  return (
    <DealDetailView
      deal={data.deal}
      activities={
        data.activities
      }
    />
  );
}