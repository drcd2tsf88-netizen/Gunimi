import { getNextAction } from "@/server/actions/ai/getNextAction";
import NextActionDisplay from "./NextActionDisplay";

type Props = {
  entityType: "contact" | "deal";
  entityId: string;
};

export default async function NextActionCard({ entityType, entityId }: Props) {
  const result = await getNextAction(entityType, entityId);
  if (!result) return null;
  return <NextActionDisplay suggestion={result.suggestion} />;
}
