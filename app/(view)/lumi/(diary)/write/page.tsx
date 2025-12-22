import { getTagsAction } from "@/app/actions/tag";
import StarWrite from "./components/starWrite";

export default async function Page() {
  // const { emotions, posTage } = await getEmotionsAndTags();
  // return <StarClient emotions={emotions} tags={posTage || []} limit={200} />;
  const tagData = await getTagsAction();
  return <StarWrite tags={tagData} />;
}
