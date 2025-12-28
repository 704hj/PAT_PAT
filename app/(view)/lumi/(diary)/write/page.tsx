import { getTagsAction } from "@/app/actions/tag";
import StarWrite from "./components/starWrite";

type Props = {
  searchParams: Promise<{ date?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const tagData = await getTagsAction();
  return <StarWrite tags={tagData} editDate={params.date} />;
}
