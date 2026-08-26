import userApi, {type Reviews } from "../api/user.api";
import { useEffect, useState } from "react";

export default function useUser() {
  const [reviews, setReviews] = useState<Reviews[]>([]);

  const getReviews = async () => {
    const res = await userApi.getReviews();
    setReviews(res ?? []);
  };

  useEffect(() => {
    getReviews();
  }, []);

  return { reviews, getReviews };
};
