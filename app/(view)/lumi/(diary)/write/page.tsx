import { getEmotionsAndTags } from "@/app/lib/data/diary/getEmotionsAndTags";
import StarClient from "./starClient";

export default async function Page() {
  const { emotions, posTage } = await getEmotionsAndTags();
  return <StarClient emotions={emotions} tags={posTage || []} limit={200} />;
}
