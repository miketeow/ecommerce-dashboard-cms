import { useEffect, useState } from "react";

export const useOrigin = () => {
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    const currentOrigin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "";

    setOrigin(currentOrigin);
  }, []);

  return origin;
};
