import { LineChartOutlined } from "@ant-design/icons";
import { AiOutlineUserAdd, AiOutlineUnorderedList } from "react-icons/ai";
import { CiReceipt } from "react-icons/ci";
import { IoIosCalculator } from "react-icons/io";
import { MdOutlineDiscount } from "react-icons/md";
import { FiDollarSign } from "react-icons/fi";

export const tsonkhnuud = [
  {
    key: 1,
    name: "zakhialga",
    label: "Захиалга",
    href: "/khyanalt/zakhialga",
  },
  {
    key: 2,
    name: "khyanalt",
    label: "Хяналт",
    href: "/khyanalt/hynalt",
  },
  {
    key: 3,
    name: "khereglegch",
    label: "Хэрэглэгч",
    href: "/khyanalt/emchiinBurtgel",
  },
  {
    key: 4,
    name: "posSystem",
    label: "Ажилтан пос",
    href: "/khyanalt/posSystem",
  },
  // {
  //   key: 5,
  //   name: "UilchluulegchPos",
  //   label: "Үйлчлүүлэгч пос",
  //   href: "/khyanalt/uilchluulegchPos",
  // },
  {
    key: 6,
    name: "ebarimt",
    label: "И-Баримт",
    href: "/khyanalt/eBarimt",
  },
  {
    key: 7,
    name: "baraaMatrial",
    label: "Бараа материал",
    href: "/khyanalt/aguulakh",
  },
  {
    key: 8,
    name: "toollogo",
    label: "Тооллого",
    href: "/khyanalt/toollogo",
  },
  {
    key: 9,
    name: "khariltsagch",
    label: "Харилцагч",
    href: "/khyanalt/khariltsagch",
  },
  {
    key: 10,
    name: "uramshuulal",
    label: "Урамшуулал",
    href: "/khyanalt/uramshuulal",
  },
  {
    key: 11,
    name: "avlaga",
    label: "Авлага",
    href: "/khyanalt/avlaga",
  },
  {
    key: 13,
    name: "uglug",
    label: "Өглөг",
    href: "/khyanalt/uglug",
  },
  {
    key: 14,
    name: "BaraaniiTailan",
    label: "Барааны тайлан",
    href: "/khyanalt/tailan/BaraaniiTailan",
  },
  {
    key: 15,
    name: "KhudaldagchiinTailan",
    label: "Худалдагчийн тайлан",
    href: "/khyanalt/tailan/KhudaldagchiinTailan",
  },
  {
    key: 16,
    name: "BorluulaltTailan",
    label: "Борлуулалтын тайлан",
    href: "/khyanalt/tailan/BorluulaltTailan",
  },
  {
    key: 17,
    name: "ButsaaltTailan",
    label: "Буцаалтын тайлан",
    href: "/khyanalt/tailan/ButsaaltTailan",
  },
  {
    key: 18,
    name: "barimtiinJagsaalt",
    label: "Баримтын жагсаалт",
    href: "/khyanalt/barimtiinJagsaalt",
  },
  {
    key: 19,
    name: "hudulguun",
    label: "Хөдөлгөөн",
    href: "/khyanalt/hudulguun",
  },
  {
    key: 20,
    name: "UgulugTailan",
    label: "Өглөг тайлан",
    href: "/khyanalt/tailan/UglugTailan",
  },
  {
    key: 21,
    name: "AvlagaTailan",
    label: "Авлага тайлан",
    href: "/khyanalt/tailan/AvlagaTailan",
  },
  {
    key: 22,
    name: "UramshuulalTailan",
    label: "Урамшуулал тайлан",
    href: "/khyanalt/tailan/UramshuulalTailan",
  },
  {
    key: 23,
    name: "dansniiTuluvluguu",
    label: "Дансны төлөвлөгөө",
    href: "/khyanalt/yrunhiiJurnal/dansniiTuluvluguu",
  },
  {
    key: 24,
    name: "guilgeeBurtgel",
    label: "Гүйлгээний жагсаалт",
    href: "/khyanalt/yrunhiiJurnal/guilgeeBurtgel",
  },
  {
    key: 25,
    name: "UramshuulalDelgerenguiTailan",
    label: "Урамшуулал дэлгэрэнгүй тайлан",
    href: "/khyanalt/tailan/UramshuulalDelgerenguiTailan",
  },
  {
    key: 26,
    name: "baraaOrlogodokh",
    label: "Худалдан авалт",
    href: "/khyanalt/aguulakh/baraaOrlogokh",
  },
  {
    key: 27,
    name: "dansniiTuluvluguu",
    label: "Дансны төлөвлөгөө",
    href: "/khyanalt/yrunhiiJurnal/dansniiTuluvluguu",
  },
  {
    key: 28,
    name: "guilgeeJagsaalt",
    label: "Гүйлгээ жагсаалт",
    href: "/khyanalt/yrunhiiJurnal/guilgeeJagsaalt",
  },
  {
    key: 29,
    name: "guilgeeBalance",
    label: "Гүйлгээ баланс",
    href: "/khyanalt/yrunhiiJurnal/guilgeeBalance",
  },
  {
    key: 30,
    name: "EmdKhungulultTailan",
    label: "ЭМД-н хөнгөлөлтийн тайлан",
    href: "/khyanalt/tailan/EmdKhungulultTailan",
  },
];

export const tsonknuud = [
  {
    key: "/khyanalt/ajiltan/tokhirgoo",
    ner: "Ажилтанд эрх олгох",
    tailbar: "",
    tokhirgoo: [],
    nuuya: true,
  },
  {
    key: "/khyanalt/geree/gereeBurtgel",
    ner: "Гэрээний жагсаалт",
    tailbar:
      "Нийт түрээслэгчтэй байгуулсан гэрээний төлөв хөтлөх, засвар оруулах, дэлгэрэнгүй мэдээллийг нь харах боломжтой\n",
    tokhirgoo: [],
  },
  {
    key: "/khyanalt/em",
    ner: "Эмийн бүртгэл",
    tailbar:
      "Байгууллага өөрсдийн үйлчилгээнд санал болгох гэрээний загваруудыг динамик хэлбэрээр оруулах боломжтой ба гэрээ байгуулах үед гэрээний загвар сонгож дуусгасны дараа систем тухайн гэрээний нөхцлийн дагуу хугацаа, төлбөр гэх мэт тооцоолуурууд ажиллана.\n",
  },
  {
    key: "/khyanalt/ajiltan/ajiltanBurtgel",
    ner: "Ажилтан бүртгэл",
    tailbar:
      "Барилгын үйл ажиллагааг хариуцсан ажилчдын бүртгэл мэдээлэл болон ажлын эрх үүргийг оруулж тохиргоо хийх боломжтой.\n",
    tokhirgoo: [
      {
        ner: "Ажилтан бүртгэх эрх",
        utga: "ajiltanBurtgekhEsekh",
      },
    ],
  },
  {
    key: "/khyanalt/khariltsagchBurtgel",
    ner: "Нийлүүлэгч бүртгэх",
    tailbar:
      "Гэрээ байгуулсан иргэн болон нийлүүлэгчийн дэлгэрэнгүй мэдээллийг хөтлөх, түүхийг хадгална.",
    tokhirgoo: [
      {
        ner: "Нийлүүлэгч бүртгэх эрх",
        utga: "khariltsagchBurtgekhEsekh",
      },
    ],
  },
  {
    key: "/khyanalt/medegdel",
    ner: "Мэдэгдэл",
    tailbar:
      "Мэдээ мэдээлэл, төлбөрийг мэдэгдэл, санал хүсэлтийг- Мэйл, мессеж, апп ашиглах илгээх, хүлээн авах юм.",
    tokhirgoo: [
      {
        ner: "Мэдэгдэл олноор илгээх эсэх",
        utga: "medegdelOlnoorIlgeekhEsekh",
      },
      {
        ner: "Мэдэгдэл илгээх эсэх",
        utga: "medegdelIlgeekhEsekh",
      },
      {
        ner: "Санал хүсэлт шийдвэрлэх эсэх",
        utga: "sanalKhuseltShiidverlekhEsekh",
      },
      {
        ner: "Мэйл илгээх эсэх",
        utga: "mailIlgeekhEsekh",
      },
    ],
  },
  {
    key: "/khyanalt/tailan",
    ner: "Тайлан",
    tailbar:
      "Борлуулалтын\nАшигийн тооцоо\nЗардлын тооцоо\nАвлагын насжилтаар\n",
    tokhirgoo: [],
  },
  {
    ner: "Дансны хуулга",
    key: "/khyanalt/dansniiKhuulga",
  },
];

export const khereglegchiinErkhuud = [
  {
    erkh: "ZokhionBaiguulagch",
    tailbar: "Зохион байгуулагч",
    tsonkhnuud: [
      "/khyanalt/geree/gereeBurtgel",
      "/khyanalt/geree/zagvar",
      "/khyanalt/talbaiBurtgel/talbaiBurtgekh",
      "/khyanalt/khariltsagchBurtgel",
      "/khyanalt/medegdel",
      "khyanalt/anket",
      "/khyanalt/buteegdekhuun/buteegdekhuunBurtgel",
    ],
  },
  {
    erkh: "Sankhuu",
    tailbar: "Санхүү",
    tsonkhnuud: [
      "/khyanalt/tulburTootsoo",
      "/khyanalt/eBarimt",
      "/khyanalt/tulburTootsoo/khungulult",
      "/khyanalt/medegdel",
      "/khyanalt/tulburTootsoo/guilgeeniiTuukh",
    ],
  },
];

export function undsenKhuudasOlyo(url) {
  if (url.includes("khyanalt/tokhirgoo")) return "khyanalt/tokhirgoo";
  if (!!tsonknuud.find((a) => url === a.key))
    return tsonknuud.find((a) => url === a.key)?.key;
  return tsonknuud.find((a) => url.includes(a.key))?.key;
}

export function ekhniiTsonkhruuOchyo(ajiltan, turul) {
  if (turul === "emiinsan") window.location.href = "/emiinsan/em";
  else if (turul === "emch") window.location.href = "/emch/jor";
  else window.location.href = "/khyanalt/posSystem";
  return;
  if (ajiltan?.albanTushaal === "Admin")
    window.location.href = "/khyanalt/geree/gereeBurtgel";
  else window.location.href = ajiltan.erkhuud[0];
}

const khuudasnuud = [
  {
    ner: "Захиалга",
    khuudasniiNer: "zakhialga",
    href: "/khyanalt/zakhialga",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="feather feather-clipboard d-block mx-auto"
      >
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      </svg>
    ),
  },
  {
    ner: "POS",
    khuudasniiNer: "posSystem",
    href: "/khyanalt/posSystem",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="feather feather-airplay d-block mx-auto"
      >
        <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path>
        <polygon points="12 15 17 21 7 21 12 15"></polygon>
      </svg>
    ),
  },
  // {
  //   ner: "POS /жижиг/",
  //   khuudasniiNer: "UilchluulegchPos",
  //   href: "/khyanalt/uilchluulegchPos",
  //   icon: (
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       width="24"
  //       height="24"
  //       viewBox="0 0 24 24"
  //       fill="none"
  //       stroke="currentColor"
  //       strokeWidth="1.5"
  //       strokeLinecap="round"
  //       className="feather feather-airplay d-block mx-auto">
  //       <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path>
  //       <polygon points="12 15 17 21 7 21 12 15"></polygon>
  //     </svg>
  //   ),
  // },
  {
    ner: "Агуулах",
    khuudasniiNer: "aguulakh",
    icon: (
      <svg
        width="20"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
      >
        <path d="M597.876 110.125L346.251 5.25C329.501 -1.75 310.501 -1.75 293.751 5.25L42.126 110.125C16.501 120.625 -0.124 145.625 0.001 173.25V488C0.001 501.254 10.747 512 24.001 512C37.257 512 48.001 501.254 48.001 488V173.25C48.001 165 52.876 157.5 60.501 154.375L312.251 49.625C317.251 47.5 322.876 47.5 327.876 49.625L579.501 154.375C587.126 157.625 592.001 165 592.001 173.25V488C592.001 501.254 602.747 512 616.001 512C629.257 512 640.001 501.254 640.001 488V173.25C640.126 145.625 623.501 120.625 597.876 110.125ZM512.001 352H352.001V272C352.001 254.326 337.675 240 320.001 240H128.001C110.327 240 96.001 254.326 96.001 272V480C96.001 497.672 110.327 512 112.001 512H496.001C529.675 512 544.001 497.672 544.001 480V384C544.001 366.326 529.675 352 512.001 352ZM304.001 464H144.001V400H304.001V464ZM304.001 352H144.001V288H304.001V352ZM496.001 464H352.001V400H496.001V464Z"></path>
      </svg>
    ),
    sub: [
      {
        ner: "Бараа материал",
        khuudasniiNer: "baraaMatrial",
        href: "/khyanalt/aguulakh",
      },
      {
        ner: "Худалдан авалт",
        khuudasniiNer: "baraaOrlogokh",
        href: "/khyanalt/aguulakh/baraaOrlogokh",
      },
      {
        ner: "Зарлага",
        khuudasniiNer: "zarlaga",
        href: "/khyanalt/zarlaga",
      },
      {
        ner: "Тооллого",
        khuudasniiNer: "toollogo",
        href: "/khyanalt/toollogo",
      },
      {
        ner: "Хөдөлгөөн",
        khuudasniiNer: "hudulguun",
        href: "/khyanalt/hudulguun",
      },
      {
        ner: "Урамшуулал",
        khuudasniiNer: "uramshuulal",
        href: "/khyanalt/uramshuulal",
      },
      // {
      //   ner: "Зарлага",
      //   khuudasniiNer: "zarlaga",
      //   href: "/khyanalt/zarlaga",
      // },
      {
        ner: "Баримтын жагсаалт",
        khuudasniiNer: "barimtiinJagsaalt",
        href: "/khyanalt/barimtiinJagsaalt",
      },
    ],
  },
  {
    ner: "И-Баримт",
    khuudasniiNer: "eBarimt",
    href: "/khyanalt/eBarimt",
    icon: <CiReceipt className="text-2xl" />,
  },
  {
    ner: "Тооцоо",
    khuudasniiNer: "tootsoo",
    icon: <FiDollarSign className="text-2xl" />,
    sub: [
      {
        ner: "Авлага",
        khuudasniiNer: "avlaga",
        href: "/khyanalt/avlaga",
      },
      {
        ner: "Өглөг",
        khuudasniiNer: "uglug",
        href: "/khyanalt/uglug",
      },
    ],
  },
  {
    ner: "Журнал",
    khuudasniiNer: "yrunhiiJurnal",
    icon: <LineChartOutlined className="text-2xl" />,
    sub: [
      {
        ner: "Дансны төлөвлөгөө",
        khuudasniiNer: "dansniiTuluvluguu",
        href: "/khyanalt/yrunhiiJurnal/dansniiTuluvluguu",
      },
      {
        ner: "Гүйлгээний жагсаалт",
        khuudasniiNer: "guilgeeJagsaalt",
        href: "/khyanalt/yrunhiiJurnal/guilgeeJagsaalt",
      },
      {
        ner: "Гүйлгээ баланс",
        khuudasniiNer: "GuilgeeBalanceTailan",
        href: "/khyanalt/yrunhiiJurnal/guilgeeBalance",
      },
    ],
  },
  {
    ner: "Тайлан",
    khuudasniiNer: "tailan",
    href: "/khyanalt/tailan",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
        <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
      </svg>
    ),
    sub: [
      {
        ner: "Бараа",
        khuudasniiNer: "BaraaniiTailan",
        href: "/khyanalt/tailan/BaraaniiTailan",
      },
      {
        ner: "Худалдагч",
        khuudasniiNer: "KhudaldagchiinTailan",
        href: "/khyanalt/tailan/KhudaldagchiinTailan",
      },
      {
        ner: "Борлуулалт",
        khuudasniiNer: "BorluulaltTailan",
        href: "/khyanalt/tailan/BorluulaltTailan",
      },
      // {
      //   ner: "Борлуулалт нэгтгэл",
      //   khuudasniiNer: "BorluulaltNegtgel",
      //   href: "/khyanalt/tailan/BorluulaltNegtgelTailan",
      // },
      {
        ner: "Буцаалт",
        khuudasniiNer: "ButsaaltTailan",
        href: "/khyanalt/tailan/ButsaaltTailan",
      },
      {
        ner: "Авлага",
        khuudasniiNer: "AvlagaTailan",
        href: "/khyanalt/tailan/AvlagaTailan",
      },
      {
        ner: "Өглөг",
        khuudasniiNer: "UgulugTailan",
        href: "/khyanalt/tailan/UglugTailan",
      },
      {
        ner: "Урамшуулал",
        khuudasniiNer: "UramshuulalTailan",
        href: "/khyanalt/tailan/UramshuulalTailan",
      },
      {
        ner: "Урамшуулал дэлгэрэнгүй",
        khuudasniiNer: "UramshuulalDelgerenguiTailan",
        href: "/khyanalt/tailan/UramshuulalDelgerenguiTailan",
      },
      {
        ner: "ЭМД-н хөнгөлөлтийн тайлан",
        khuudasniiNer: "EmdKhungulultTailan",
        href: "/khyanalt/tailan/EmdKhungulultTailan",
      },
      {
        ner: "Бусад зарлага тайлан",
        khuudasniiner: "BusadZarlagaTailan",
        href: "/khyanalt/tailan/BusadZarlagaTailan",
      },
    ],
  },
  {
    ner: "Хяналт",
    khuudasniiNer: "hynalt",
    href: "/khyanalt/hynalt",
    icon: <LineChartOutlined className="text-2xl" />,
  },
  {
    ner: "Харилцагч",
    khuudasniiNer: "khariltsagch",
    href: "/khyanalt/khariltsagch",
    icon: <AiOutlineUserAdd className="text-2xl" />,
  },
  {
    ner: "Хэрэглэгч",
    khuudasniiNer: "emchiinBurtgel",
    href: "/khyanalt/emchiinBurtgel",
    icon: <AiOutlineUserAdd className="text-2xl" />,
  },
];

function useErkh(ajiltan) {
  if (!ajiltan) return [];

  if (!ajiltan.AdminEsekh && ajiltan?.tsonkhniiTokhirgoo) {
    const shalgakhTsonkhnuud = tsonkhnuud.filter(
      (tsonkh) => ajiltan?.tsonkhniiTokhirgoo?.[tsonkh.name] === !!tsonkh.name
    );

    const shuusenKhuudasnuud = khuudasnuud
      .map((khuudas) => {
        if (khuudas.sub && khuudas.sub.length > 0) {
          const filterHiisenSub = khuudas.sub.filter((subItem) =>
            shalgakhTsonkhnuud.some((tsonkh) => subItem.href === tsonkh.href)
          );
          if (filterHiisenSub.length > 0) {
            return {
              ner: khuudas.ner,
              khuudasniiNer: khuudas.khuudasniiNer,
              icon: khuudas.icon,
              sub: filterHiisenSub,
            };
          }
        } else if (
          shalgakhTsonkhnuud.some((tsonkh) => khuudas.href === tsonkh.href)
        ) {
          return khuudas;
        }
        return null;
      })
      .filter(Boolean);

    return shuusenKhuudasnuud;
  } else {
    return khuudasnuud;
  }
}
export default useErkh;
