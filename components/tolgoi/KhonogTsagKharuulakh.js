import moment from "moment";
import { useState, useEffect } from "react";

function KhonogTsagKharuulakh() {
  const [odoogiinTsag, setOdoogiinTsag] = useState(
    moment().format("YYYY-MM-DD HH:mm")
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setOdoogiinTsag(moment().format("YYYY-MM-DD HH:mm"));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return odoogiinTsag;
}

export default KhonogTsagKharuulakh;
