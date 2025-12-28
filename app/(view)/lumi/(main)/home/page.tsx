import { getHomeAction } from "@/app/actions/home/homeActon";
import HomeClient from "./component/homeClient";
import HomeSkeleton from "./component/homeSkeleton";

export default async function HomePage() {
  const res = await getHomeAction();

  if (!res.ok) {
    return <HomeSkeleton />;
  }

  return (
    <HomeClient
      profile={res.data.profile}
      starCount={res.data.starCount}
      diaryCount={res.data.diaryCount}
    />
  );
}
