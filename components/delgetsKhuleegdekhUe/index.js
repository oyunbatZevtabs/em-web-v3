import React, { useEffect } from "react";
import Lottie from "lottie-web";
import loading from "../../public/testLoading.json";

export default function DelgetsKhuleegdekhUe() {
  useEffect(() => {
    Lottie.loadAnimation({
      container: document.querySelector("#testLoading"),
      animationData: loading,
    });
  }, []);
  return (
    <div className="absolute z-[999999999] flex h-[100%] w-full items-center justify-center">
      <div className="h-[50%] w-[50%]" id="testLoading" />
    </div>
  );
}
