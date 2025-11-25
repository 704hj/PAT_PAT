import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export type TEmotion = {
  emotion: string;
  emotion_ko: string;
  polarity: "positive" | "negative";
};
export type TTag = {
  name: string;
  name_ko: string;
  polarity: "positive" | "negative";
};

export async function getEmotionsAndTags() {
  const headerList = await headers(); // 즉시 반환
  const host = headerList.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;

  const [eRes, tRes] = await Promise.all([
    fetch(`${baseUrl}/api/emotion`, {
      next: { revalidate: 3600 },
    }),
    fetch(`${baseUrl}/api/tag`, {
      next: { revalidate: 3600 },
    }),
  ]);

  const [eJson, tJson] = await Promise.all([eRes.json(), tRes.json()]);
  if (!eJson.ok) throw new Error(`[${eJson.code}] ${eJson.message}`);
  if (!tJson.ok) throw new Error(`[${tJson.code}] ${tJson.message}`);

  const posEmotions = (eJson.data as TEmotion[]).filter(
    (e) => e.polarity === "positive" && e.emotion !== "excited"
  );

  const posTage = (tJson.data as TTag[]).filter(
    (t) => t.polarity === "positive"
  );

  const nagTags = (tJson.data as TTag[]).filter(
    (t) => t.polarity === "negative"
  );

  return { emotions: posEmotions, posTage, nagTags };
}
