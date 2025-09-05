import React, {
  useState,
  useContext,
  createContext,
  useMemo,
  useEffect,
} from "react";
import { message } from "antd";
import { setCookie, parseCookies } from "nookies";
import uilchilgee, { aldaaBarigch } from "./uilchilgee";
import { ekhniiTsonkhruuOchyo } from "tools/logic/khereglegchiinErkhiinTokhirgoo";
import useAjiltan from "hooks/useAjiltan";
import useBaiguullaga from "hooks/useBaiguullaga";
import AldaaAlert from "components/alert/AldaaAlert";
import AmjilttaiAlert from "components/alert/AmjilttaiAlert";
import AnkhaaruulgaAlert from "components/alert/AnkhaaruulgaAlert";
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const { ajiltan, ajiltanMutate } = useAjiltan(token);
  const [baiguullagiinId, setBaiguullagiinId] = useState();
  const [salbariinId, setSalbariinId] = useState();

  const { baiguullaga, baiguullagaMutate } = useBaiguullaga(
    baiguullagiinId && baiguullagiinId
  );

  useEffect(() => {
    const t = parseCookies();
    setToken(t?.emtoken);
    if (t?.baiguullagiinId !== "undefined") {
      setBaiguullagiinId(t?.baiguullagiinId);
    } else setBaiguullagiinId();

    if (t?.salbariinId !== "undefined") {
      setSalbariinId(t?.salbariinId);
    } else setSalbariinId();

    window.addEventListener("online", () =>
      AmjilttaiAlert("Интернэт ертөнцөд тавтай морил")
    );
    window.addEventListener("offline", () =>
      AnkhaaruulgaAlert("Таны интернэт тасарсан байна")
    );
    return () => {
      window.removeEventListener("online", () =>
        AmjilttaiAlert("Интернэт ертөнцөд тавтай морил")
      );
      window.removeEventListener("offline", () =>
        AnkhaaruulgaAlert("Таны интернэт тасарсан байна")
      );
    };
  }, []);

  const auth = useMemo(
    () => ({
      newterya: async (khereglech) => {
        // if (!khereglech.nevtrekhNer) {
        //   message.warning("Нэвтрэх нэр талбарыг бөглөнө үү");
        //   return;
        // }
        if (!khereglech.burtgeliinDugaar) {
          AnkhaaruulgaAlert("Нэвтрэх нэр талбарыг бөглөнө үү");
          return;
        }
        if (!khereglech.nuutsUg) {
          AnkhaaruulgaAlert("Нууц үг талбарыг бөглөнө үү");
          return;
        }
        if (khereglech.namaigsana)
          localStorage.setItem("newtrekhNerTurees", khereglech.nevtrekhNer);

        uilchilgee()
          // .post("/ajiltanNevtrey", khereglech)
          .post("/emZuichNevtrey", khereglech)
          .then(({ data, status }) => {
            if (status === 200) {
              if (!!data) {
                setCookie(null, "emtoken", data.token, {
                  maxAge: 30 * 24 * 60 * 60,
                  path: "/",
                });
                setCookie(null, "baiguullagiinId", data?.result?.emiinSanId, {
                  maxAge: 30 * 24 * 60 * 60,
                  path: "/",
                });
                var undsenSalbar = undefined;
                if (!data?.result?.salbaruud) {
                  undsenSalbar = data?.result?.emiinSanId;
                } else if (data?.result?.salbaruud.length > 0) {
                  undsenSalbar = data?.result?.salbaruud[0];
                } else undsenSalbar = data?.result?.emiinSanId;
                setCookie(null, "salbariinId", undsenSalbar, {
                  maxAge: 30 * 24 * 60 * 60,
                  path: "/",
                });
                setSalbariinId(undsenSalbar);
                setBaiguullagiinId(data?.result?.emiinSanId);
                setToken(data.token);
                ajiltanMutate(data.result);
                ekhniiTsonkhruuOchyo(data.result, khereglech.turul);
                AmjilttaiAlert("Тавтай морил");
              } else AldaaAlert("Хэрэглэгчийн мэдээлэл буруу байна");
            } else AldaaAlert("Хэрэглэгчийн мэдээлэл буруу байна");
          })
          .catch(aldaaBarigch);
      },
      garya: () => {
        window.location.href = "/";
      },
      token,
      ajiltan,
      ajiltanMutate,
      setToken,
      baiguullaga,
      baiguullagaMutate,
      baiguullagiinId,
      setBaiguullagiinId,
      setSalbariinId,
      salbariinId,
    }),
    [token, ajiltan, baiguullaga, baiguullagiinId, salbariinId]
  );

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
