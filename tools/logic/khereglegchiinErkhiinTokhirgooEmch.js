import { AiOutlineUserAdd } from "react-icons/ai";

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

export function ekhniiTsonkhruuOchyo(ajiltan) {
  window.location.href = "/khyanalt/jor";
  return;
  if (ajiltan?.albanTushaal === "Admin")
    window.location.href = "/khyanalt/geree/gereeBurtgel";
  else window.location.href = ajiltan.erkhuud[0];
}

const khuudasnuud = [
  {
    ner: "Эмчийн Үзлэг",
    khuudasniiNer: "jor",
    href: "/emch/jor",
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
        className="feather feather-activity d-block mx-auto"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
      </svg>
    ),
  },
  {
    ner: "Эмийн жагсаалт",
    khuudasniiNer: "em",
    href: "/emch/em",
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
        className="feather feather-database d-block mx-auto"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
      </svg>
    ),
  },
  {
    ner: "Эмчийн бүртгэл",
    khuudasniiNer: "emchiinBurtgel",
    href: "/emch/emchiinBurtgel",
    icon: <AiOutlineUserAdd className="text-2xl" />,
  },
];

function useErkh(ajiltan) {
  if (!ajiltan) return [];
  return khuudasnuud;

  // return khuudasnuud
  //   .map((x) => {
  //     if (x.href.includes("khyanalt/tokhirgoo")) return x;
  //     if (ajiltan.albanTushaal === "Admin") return x;
  //     else if (x.sub?.length > 0) {
  //       x.sub = x.sub.filter(
  //         (g) => !!ajiltan?.erkhuud.find((a) => g.href.includes(a))
  //       );
  //       if (x.sub.length > 0) return x;
  //     } else if (!!ajiltan?.erkhuud.find((a) => x.href.includes(a))) return x;
  //   })
  //   .filter((x) => !!x);
}

export default useErkh;
