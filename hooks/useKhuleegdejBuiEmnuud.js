import { useEffect, useState } from "react";
function useKhuleegdejBuiEmnuud() {
  const [khuleegdejBuiZakhialga, setKhuleegdejBuiZakhialga] = useState([]);

  useEffect(() => {
    async function getValue() {
      const value = localStorage.getItem("songogdsomEmnuud");
      if (!!value) {
        setKhuleegdejBuiZakhialga(JSON.parse(value));
      }
    }
    getValue();
  }, []);

  function zakhialgaKhuleelgeye(zakhialga) {
    khuleegdejBuiZakhialga.push(zakhialga);
    localStorage.setItem(
      "songogdsomEmnuud",
      JSON.stringify(khuleegdejBuiZakhialga)
    );
    setKhuleegdejBuiZakhialga([...khuleegdejBuiZakhialga]);
  }
  function ustgaya(index) {
    khuleegdejBuiZakhialga.splice(index, 1);
    localStorage.setItem(
      "songogdsomEmnuud",
      JSON.stringify(khuleegdejBuiZakhialga)
    );
    setKhuleegdejBuiZakhialga([...khuleegdejBuiZakhialga]);
  }
  return { khuleegdejBuiZakhialga, ustgaya, zakhialgaKhuleelgeye };
}

export default useKhuleegdejBuiEmnuud;
