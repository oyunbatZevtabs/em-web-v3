import { useEffect, useRef } from "react";
import { useAuth } from "services/auth";
import uilchilgee from "services/uilchilgee";

export function useZurag(path, type) {
  const ref = useRef(null);
  const { token } = useAuth();

  useEffect(() => {
    token &&
      uilchilgee(token)
        .get(`/file?path=${type === "tmp" ? "tmp/" : ""}${path}`, {
          responseType: "blob",
        })
        .then(({ data }) => {
          ref.current.src = URL.createObjectURL(data);
        });
  }, [token, path, type]);

  return ref;
}

export default useZurag;
