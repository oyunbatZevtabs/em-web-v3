import { parseCookies } from "nookies";
import _ from "lodash";

const shalgaltKhiikh = async (ctx, ugudulAvchirya) => {
  try {
    let session = await parseCookies(ctx);
    let data = null;
    let erkh = null;
    if (_.isFunction(ugudulAvchirya)) data = await ugudulAvchirya(ctx, session);
    if (!!session?.emtoken) {
      erkh = true;
      //erkh = await erkhteiEsekh(session?.emtoken,undsenKhuudasOlyo(ctx.resolvedUrl))
    } else throw new Error("Алдаа");
    return {
      //notFound: !erkh && '/khyanalt/tokhirgoo' !== ctx.resolvedUrl,
      props: {
        token: session.emtoken || null,
        data,
        salbariinId: session.salbariinId || null,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};

export default shalgaltKhiikh;
