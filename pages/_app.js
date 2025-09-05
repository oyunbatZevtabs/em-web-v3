import { AuthProvider } from "../services/auth";
import { PosDataProvider } from "../services/uilchluulegchPosData";

import { ThemeProvider } from "next-themes";
import "../styles/globals.css";
import "antd/dist/antd.css";
import "suneditor/dist/css/suneditor.min.css";
import "aos/dist/aos.css";
import DelgetsKhuleegdekhUe from "components/delgetsKhuleegdekhUe";
import { useEffect, useState } from "react";
import Router from "next/router";
import { ConfigProvider } from "antd";

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
    };

    const handleComplete = () => {
      setLoading(false);
    };

    const handleError = () => {
      setLoading(false);
    };

    Router.events.on("routeChangeStart", handleStart);
    Router.events.on("routeChangeComplete", handleComplete);
    Router.events.on("routeChangeError", handleError);

    return () => {
      Router.events.off("routeChangeStart", handleStart);
      Router.events.off("routeChangeComplete", handleComplete);
      Router.events.off("routeChangeError", handleError);
    };
  }, []);
  return (
    <ConfigProvider>
      <ThemeProvider attribute="class">
        <PosDataProvider>
          <AuthProvider>
            {loading && <div>{<DelgetsKhuleegdekhUe />}</div>}
            <Component {...pageProps} />
          </AuthProvider>
        </PosDataProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
}

export default MyApp;
