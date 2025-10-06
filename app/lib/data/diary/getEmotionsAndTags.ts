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
  const [eRes, tRes] = await Promise.all([
    fetch(`${process.env.BASE_URL}/api/emotion`, {
      next: { revalidate: 3600 },
    }),
    fetch(`${process.env.BASE_URL}/api/tag`, {
      next: { revalidate: 3600 },
    }),
  ]);

  const [eJson, tJson] = await Promise.all([eRes.json(), tRes.json()]);
  if (!eJson.ok) throw new Error(`[${eJson.code}] ${eJson.message}`);
  if (!tJson.ok) throw new Error(`[${tJson.code}] ${tJson.message}`);

  const posEmotions = (eJson.data as TEmotion[]).filter(
    (e) => e.polarity === "positive" && e.emotion !== "excited"
  );

  const posTags = (tJson.data as TTag[]).filter(
    (t) => t.polarity === "positive"
  );

  return { emotions: posEmotions, tags: posTags };
}
