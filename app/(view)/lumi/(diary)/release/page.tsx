import { getEmotionsAndTags } from "@/app/lib/data/diary/getEmotionsAndTags";
import ReleaseClient from "./releaseClient";

export default async function Page() {
  const { nagTags } = await getEmotionsAndTags();
  return <ReleaseClient tags={nagTags || []} limit={200} />;
}
