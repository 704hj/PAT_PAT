import { useEffect, useState } from "react";

const useEmotion = () => {
  const [emotions, setEmotions] = useState<TEmotion[]>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [tags, setTags] = useState<TTag[]>();

  async function fetchEmotion() {
    try {
      const res = await fetch("/api/emotion");
      const json = await res.json();

      if (!json.ok) {
        // 실패 처리
        setErrorMessage(`[${json.code}] ${json.message}`);
        return;
      }

      if (json.data) {
        const emotions = json.data as TEmotion[];
        const posEmotions = emotions.filter(
          (emotion) =>
            emotion.polarity === "positive" && emotion.emotion !== "excited"
        );
        setEmotions(posEmotions);
      }
    } catch (err) {
      setErrorMessage("ERROR");
    } finally {
    }
  }

  async function fetchTags() {
    try {
      const res = await fetch("/api/tag");
      const json = await res.json();

      if (!json.ok) {
        // 실패 처리
        setErrorMessage(`[${json.code}] ${json.message}`);
        return;
      }

      if (json.data) {
        const tags = json.data as TTag[];
        const posTags = tags.filter(
          (emotion) => emotion.polarity === "positive"
        );
        setTags(posTags);
      }
    } catch (err) {
      setErrorMessage("ERROR");
    } finally {
    }
  }

  useEffect(() => {
    fetchEmotion();
    fetchTags();
  }, []);

  return { emotions, errorMessage, tags };
};

export default useEmotion;
