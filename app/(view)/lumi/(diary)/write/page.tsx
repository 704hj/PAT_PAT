import { getEmotionsAndTags } from "@/app/lib/data/diary/getEmotionsAndTags";
import StarClient from "./starClient";

export default async function Page() {
  const { emotions, tags } = await getEmotionsAndTags();
  return <StarClient emotions={emotions} tags={tags} limit={200} />;
}
