import { Image } from "antd";
import React from "react";
import uilchilgee from "services/uilchilgee";

function Zev_Image({ token, href, ...props }) {
  const [blob, setBlob] = React.useState();
  React.useEffect(() => {
    uilchilgee(token)
      .get(href, { responseType: "blob" })
      .then(({ data }) => {
        setBlob(URL.createObjectURL(data));
      });
  }, []);

  return <Image src={blob} {...props} />;
}
export default Zev_Image;
