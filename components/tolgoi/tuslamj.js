import {
  CloseCircleOutlined,
  LeftOutlined,
  SettingFilled,
} from "@ant-design/icons";
import { FaFileContract } from "@react-icons/all-files/fa/FaFileContract";
import { GiArrowDunk } from "@react-icons/all-files/gi/GiArrowDunk";
import { ImUserPlus } from "@react-icons/all-files/im/ImUserPlus";
import { RiFolderUserFill } from "@react-icons/all-files/ri/RiFolderUserFill";
import React, { useEffect, useState } from "react";
import Aos from "aos";
import { Image } from "antd";
import Link from "next/link";
import { useAuth } from "services/auth";

function Tuslamj() {
  const [songogdsonAlkham, setSongogdsonAlkham] = useState(0);
  const [daragdsanTokhirgooMedeelel, setDaragdsanTokhirgooMedeelel] =
    useState(0);

  useEffect(() => {
    Aos.init({ once: true });
  }, []);
  const { ajiltan } = useAuth();

  return (
    <div className="h-full w-full overflow-hidden px-5">
      <div className="p-2 text-center text-xl font-semibold">
        Систем нэвтрүүлэлтийн алхам
      </div>
      <div className="relative h-[90vh] space-y-10 py-10">
        <div
          className={`absolute z-30 text-sm  transition-all duration-500 ${
            songogdsonAlkham === 0 ? "left-full" : "left-0 "
          }`}
        >
          <LeftOutlined
            className={`-mt-[5px] ml-2 rounded-full border-2 p-1 transition-all duration-500 hover:bg-slate-400 ${
              songogdsonAlkham === 0 ? "invisible opacity-0" : "opacity-100"
            }`}
            onClick={() => setSongogdsonAlkham(0)}
          />
        </div>
        <div
          className={`group relative flex h-32 w-full cursor-pointer items-center rounded-full bg-[rgba(22,78,99,1)] p-1 transition-all duration-500 hover:scale-95 hover:bg-[#2f718a] ${
            songogdsonAlkham === 0
              ? "right-0 top-0 opacity-100"
              : songogdsonAlkham === 1
              ? "absolute -right-3/4 -top-10 z-50 opacity-100"
              : "invisible absolute -top-96 opacity-0"
          }`}
          onClick={
            songogdsonAlkham === 1
              ? () => setSongogdsonAlkham(0)
              : () => setSongogdsonAlkham(1)
          }
        >
          <div className="flex min-h-[120px] min-w-[120px] items-center justify-center rounded-full bg-white ">
            <div className="text-6xl text-[rgba(22,78,99,1)]">
              <SettingFilled className="group-hover:animate-spin-mid" />
            </div>
          </div>
          <div
            className={` w-full py-2 pl-3 pr-6 transition-opacity duration-700 ${
              songogdsonAlkham === 1 ? "opacity-0" : "opacity-100"
            }`}
          >
            <h1 className="pl-8 text-2xl font-semibold text-white">Тохиргоо</h1>
            <p className="text-white">
              Систем ашиглахтай холбоотой байгууллагын үндсэн зарчмыг оруулах
              шаардлага, түүний дагуу гэрээний ажиллагаанд хяналт үүсэх
              боломжтой.
            </p>
          </div>
          <div className="absolute -bottom-11 -right-2 text-6xl text-[#60afcc]">
            <GiArrowDunk className="rotate-[80deg]" />
          </div>
        </div>
        <div
          className={`group relative flex h-32 w-full cursor-pointer items-center rounded-full bg-[rgba(22,78,99,1)] p-1 transition-all duration-500 hover:scale-95 hover:bg-[#2f718a] ${
            songogdsonAlkham === 0
              ? "right-0 top-0 opacity-100"
              : songogdsonAlkham === 2
              ? "absolute -right-3/4 -top-64 z-50 opacity-100"
              : "invisible absolute -top-96 opacity-0"
          }`}
          onClick={
            songogdsonAlkham === 2
              ? () => setSongogdsonAlkham(0)
              : () => setSongogdsonAlkham(2)
          }
        >
          <div className="flex min-h-[120px] min-w-[120px] items-center justify-center rounded-full bg-white ">
            <div className="text-6xl text-[rgba(22,78,99,1)]">
              <RiFolderUserFill className="group-hover:mt-4 group-hover:animate-bounce" />
            </div>
          </div>
          <div
            className={` w-full py-2 pl-3 pr-6 transition-opacity duration-700 `}
          >
            <h1
              className={`pl-8 text-2xl font-semibold text-white transition-all duration-500 ${
                songogdsonAlkham === 2
                  ? "absolute -left-[290px] top-6 -z-50 rounded-l-full bg-[rgba(22,78,99,1)] px-10 py-6 pr-20"
                  : "left-0 top-10 rounded-sm p-0 px-0 py-0 pr-0"
              }`}
            >
              Ажилтан бүртгэл
            </h1>
            <p
              className={`text-white ${
                songogdsonAlkham === 2 ? "opacity-0" : "opacity-100"
              }`}
            >
              Системд ажилчдыг бүртгэлжүүлэх, Ажилтан системд нэвтрэх эрх олгох
              боломжтой.
            </p>
          </div>
          <div
            className={`absolute -bottom-11 -left-3 text-6xl text-[#60afcc] transition-opacity duration-500 ${
              songogdsonAlkham === 2 ? "opacity-0" : "opacity-100"
            }`}
          >
            <GiArrowDunk className="-rotate-[80deg] -scale-x-100" />
          </div>
        </div>
        <div
          className={`group relative flex h-32 w-full cursor-pointer items-center rounded-full bg-[rgba(22,78,99,1)] p-1 transition-all duration-500 hover:scale-95 hover:bg-[#2f718a] ${
            songogdsonAlkham === 0
              ? "right-0 top-0 opacity-100"
              : songogdsonAlkham === 3
              ? "absolute -right-3/4 -top-[420px] z-50 opacity-100"
              : "invisible absolute -top-96 opacity-0"
          }`}
          onClick={
            songogdsonAlkham === 3
              ? () => setSongogdsonAlkham(0)
              : () => setSongogdsonAlkham(3)
          }
        >
          <div className="flex min-h-[120px] min-w-[120px] items-center justify-center rounded-full bg-white ">
            <div className="text-6xl text-[rgba(22,78,99,1)]">
              <FaFileContract className="group-hover:mt-5 group-hover:animate-bounce" />
            </div>
          </div>
          <div
            className={` w-full py-2 pl-3 pr-6 transition-opacity duration-700 `}
          >
            <h1
              className={`pl-8 text-2xl font-semibold text-white transition-all duration-500 ${
                songogdsonAlkham === 3
                  ? "absolute -left-[310px] top-6 -z-50 rounded-l-full bg-[rgba(22,78,99,1)] px-10 py-6 pr-20"
                  : "left-0 top-10 rounded-sm p-0 px-0 py-0 pr-0"
              }`}
            >
              Гэрээний удирдлага
            </h1>
            <p
              className={`text-white ${
                songogdsonAlkham === 3 ? "opacity-0" : "opacity-100"
              }`}
            >
              Харилцагчтай байгуулсан гэрээний хугацаа, зээлийн дүн, хуваарь
              болон бусад тохиролцоог зохицуулна.
            </p>
          </div>
          <div className="absolute -bottom-11 -right-2 text-6xl text-[#60afcc]">
            <GiArrowDunk className="rotate-[80deg]" />
          </div>
        </div>
        <div
          className={`group relative z-10 flex h-32 w-full cursor-pointer items-center rounded-full bg-[rgba(22,78,99,1)] p-1 transition-all duration-500 hover:scale-95 hover:bg-[#2f718a] ${
            songogdsonAlkham === 0
              ? "right-0 top-0 opacity-100"
              : songogdsonAlkham === 4
              ? "absolute -right-3/4 -top-[588px] z-50 opacity-100"
              : "invisible absolute -top-96 opacity-0"
          }`}
          onClick={
            songogdsonAlkham === 4
              ? () => setSongogdsonAlkham(0)
              : () => setSongogdsonAlkham(4)
          }
        >
          <div className="z-30 flex min-h-[120px] min-w-[120px] items-center justify-center rounded-full bg-white ">
            <div className="text-6xl text-[rgba(22,78,99,1)]">
              <ImUserPlus className="group-hover:mt-5 group-hover:animate-bounce" />
            </div>
          </div>
          <div
            className={` w-full py-2 pl-3 pr-6 transition-opacity duration-700 `}
          >
            <h1
              className={`pl-8 text-2xl font-semibold text-white transition-all duration-500 ${
                songogdsonAlkham === 4
                  ? "absolute -left-[310px] top-6 -z-50 rounded-l-full bg-[rgba(22,78,99,1)] px-10 py-6 pr-12"
                  : "left-0 top-10 rounded-sm p-0 px-0 py-0 pr-0"
              }`}
            >
              Харилцагчийн бүртгэл
            </h1>
            <p
              className={`text-white ${
                songogdsonAlkham === 4 ? "opacity-0" : "opacity-100"
              }`}
            >
              Хэрэглэгчдийн мэдээллийг бүртгэлжүүлэн түүх болгон хадгалах.
            </p>
          </div>
        </div>
        {songogdsonAlkham === 1 ? (
          <div
            data-aos="fade-right"
            data-aos-delay="200"
            className="absolute -top-1 z-10 h-full w-full overflow-y-auto "
          >
            <div className=" pl-20 text-xl  ">Тохиргоо</div>
            <div className="mt-5 pl-5 pr-10">
              <div
                onClick={() => setDaragdsanTokhirgooMedeelel(0)}
                className="flex h-28 items-center gap-5"
              >
                <img
                  alt={ajiltan?.ner}
                  src={
                    ajiltan?.zurgiinNer
                      ? `${url}/ajiltniiZuragAvya/${ajiltan?.zurgiinNer}`
                      : "/profile.svg"
                  }
                  className="h-12 w-12 rounded-full ring-2 ring-[rgba(22,78,99,1)] ring-opacity-50"
                />
                <div className="text-base font-medium">{`${ajiltan?.ovog} ${ajiltan?.ner}`}</div>
              </div>
              <div
                className={`w-full overflow-hidden rounded-xl border-2 border-y-0 transition-all duration-300 ${
                  daragdsanTokhirgooMedeelel === 1 ? "h-32" : "h-12"
                }`}
              >
                <div
                  onClick={
                    daragdsanTokhirgooMedeelel === 1
                      ? () => setDaragdsanTokhirgooMedeelel(0)
                      : () => setDaragdsanTokhirgooMedeelel(1)
                  }
                  className="flex cursor-pointer items-center justify-between pr-5"
                >
                  <img src="/tokhirgoo1.png" />
                  <LeftOutlined
                    className={`transition-all duration-300 ${
                      daragdsanTokhirgooMedeelel === 1
                        ? "-rotate-90"
                        : "rotate-0"
                    }`}
                  />
                </div>
                <p
                  className={`px-5 text-opacity-80${
                    daragdsanTokhirgooMedeelel === 1 ? "" : "hidden"
                  }`}
                >
                  Байгууллагын нэр болон лого солих боломтжой. Энэ нь гар утасны
                  АПП дээр бүтээгдэхүүний лого болон харагдана.
                </p>
              </div>
              <div
                className={`w-full overflow-hidden rounded-xl border-2 border-y-0 transition-all duration-300 ${
                  daragdsanTokhirgooMedeelel === 2 ? "h-32" : "h-12"
                }`}
              >
                <div
                  onClick={
                    daragdsanTokhirgooMedeelel === 2
                      ? () => setDaragdsanTokhirgooMedeelel(0)
                      : () => setDaragdsanTokhirgooMedeelel(2)
                  }
                  className="flex cursor-pointer items-center justify-between pr-5"
                >
                  <img src="/tokhirgoo2.png" />
                  <LeftOutlined
                    className={`transition-all duration-300 ${
                      daragdsanTokhirgooMedeelel === 2
                        ? "-rotate-90"
                        : "rotate-0"
                    }`}
                  />
                </div>
                <p
                  className={`px-5 text-opacity-80 ${
                    daragdsanTokhirgooMedeelel === 2 ? "" : "hidden"
                  }`}
                >
                  Систем хэрэглэгчийн бүртгэл, утас, нууц үг гэх мэт үндсэн
                  мэдээллийн засварлах боломжтой.
                </p>
              </div>
              <img
                onClick={() => setDaragdsanTokhirgooMedeelel(0)}
                src="/tokhirgoo3.png"
              />
              <p></p>
              <div
                className={`w-full overflow-hidden rounded-xl border-2 border-y-0 transition-all duration-300 ${
                  daragdsanTokhirgooMedeelel === 4 ? "h-36" : "h-12"
                }`}
              >
                <div
                  onClick={
                    daragdsanTokhirgooMedeelel === 4
                      ? () => setDaragdsanTokhirgooMedeelel(0)
                      : () => setDaragdsanTokhirgooMedeelel(4)
                  }
                  className="flex cursor-pointer items-center justify-between pr-5"
                >
                  <img src="/tokhirgoo4.png" />
                  <LeftOutlined
                    className={`transition-all duration-300 ${
                      daragdsanTokhirgooMedeelel === 4
                        ? "-rotate-90"
                        : "rotate-0"
                    }`}
                  />
                </div>
                <p
                  className={`px-5 text-opacity-80 ${
                    daragdsanTokhirgooMedeelel === 4 ? "" : "hidden"
                  }`}
                >
                  Мэдээ мэдээлэл, нэхэмжлэл илгээх Мэйл -н мэдээллийг оруулна.
                  Түүнийг систем ашиглагч оператор ххк -с авна.
                </p>
              </div>
              <div
                className={`w-full overflow-hidden rounded-xl border-2 border-y-0 transition-all duration-300 ${
                  daragdsanTokhirgooMedeelel === 5 ? "h-36" : "h-12 "
                }`}
              >
                <div
                  onClick={
                    daragdsanTokhirgooMedeelel === 5
                      ? () => setDaragdsanTokhirgooMedeelel(0)
                      : () => setDaragdsanTokhirgooMedeelel(5)
                  }
                  className="flex cursor-pointer items-center justify-between pr-5"
                >
                  <img src="/tokhirgoo5.png" />
                  <LeftOutlined
                    className={`transition-all duration-300 ${
                      daragdsanTokhirgooMedeelel === 5
                        ? "-rotate-90"
                        : "rotate-0"
                    }`}
                  />
                </div>
                <p
                  className={`px-5 text-opacity-80 ${
                    daragdsanTokhirgooMedeelel === 5 ? "" : "hidden"
                  }`}
                >
                  Тусгай дугаараас мэдээлэл илгээхтэй холбоотой дугаарын
                  тохиргоо оруулж өгнө. Түүнийг систем ашиглагч оператор ххк -с
                  авна.
                </p>
              </div>
              <div
                className={`w-full overflow-hidden rounded-xl border-2 border-y-0 transition-all duration-300 ${
                  daragdsanTokhirgooMedeelel === 6 ? "h-36 " : "h-12 "
                }`}
              >
                <div
                  onClick={
                    daragdsanTokhirgooMedeelel === 6
                      ? () => setDaragdsanTokhirgooMedeelel(0)
                      : () => setDaragdsanTokhirgooMedeelel(6)
                  }
                  className="flex cursor-pointer items-center justify-between pr-5"
                >
                  <img src="/tokhirgoo6.png" />
                  <LeftOutlined
                    className={`transition-all duration-300 ${
                      daragdsanTokhirgooMedeelel === 6
                        ? "-rotate-90"
                        : "rotate-0"
                    }`}
                  />
                </div>
                <p
                  className={`px-5 text-opacity-80 ${
                    daragdsanTokhirgooMedeelel === 6 ? "" : "hidden"
                  }`}
                >
                  Дансны хуулга автоматаар давтамжтай татах үед банкны данс
                  холбогдсон байх шаардлагатай. Түүнийг систем ашиглагч банк
                  талаас эрх авна.
                </p>
              </div>
              <div
                className={`w-full overflow-hidden rounded-xl border-2 border-y-0 transition-all duration-300 ${
                  daragdsanTokhirgooMedeelel === 7 ? "h-36 " : "h-12"
                }`}
              >
                <div
                  onClick={
                    daragdsanTokhirgooMedeelel === 7
                      ? () => setDaragdsanTokhirgooMedeelel(0)
                      : () => setDaragdsanTokhirgooMedeelel(7)
                  }
                  className="flex cursor-pointer items-center justify-between pr-5"
                >
                  <img src="/tokhirgoo7.png" />
                  <LeftOutlined
                    className={`transition-all duration-300 ${
                      daragdsanTokhirgooMedeelel === 7
                        ? "-rotate-90"
                        : "rotate-0"
                    }`}
                  />
                </div>
                <p
                  className={`px-5 text-opacity-80 transition-all ${
                    daragdsanTokhirgooMedeelel === 7 ? "" : "hidden"
                  }`}
                >
                  Түрээслэгч өөрийн апп -аар дамжуулан төлбөрөө Qpay -ээр төлөх
                  тохиолдолд хийгдэх тохиргоо юм. Түүнийг систем ашиглагч Qpay
                  талаас эрх авна.
                </p>
              </div>
              <div
                className={`w-full overflow-hidden rounded-xl border-2 border-y-0 transition-all duration-300 ${
                  daragdsanTokhirgooMedeelel === 8 ? "h-32" : "h-12"
                }`}
              >
                <div
                  onClick={
                    daragdsanTokhirgooMedeelel === 8
                      ? () => setDaragdsanTokhirgooMedeelel(0)
                      : () => setDaragdsanTokhirgooMedeelel(8)
                  }
                  className="flex cursor-pointer items-center justify-between pr-5"
                >
                  <img src="/tokhirgoo8.png" />
                  <LeftOutlined
                    className={`transition-all duration-300 ${
                      daragdsanTokhirgooMedeelel === 8
                        ? "-rotate-90"
                        : "rotate-0"
                    }`}
                  />
                </div>
                <p
                  className={`px-5 text-opacity-80${
                    daragdsanTokhirgooMedeelel === 8 ? "" : "hidden"
                  }`}
                >
                  Уг тохиргоо нь зээлдэгч нарт төлөлт болох өдрөөс хэд хоногийн
                  өмнө төлөлт сануулга явуулахыг сонгож өгдөг ба өглөө бүр 9:00
                  -д шүүлт хийн нийтээр мэдэгдэл илгээнэ.
                </p>
              </div>
            </div>
            <div className="pt-3">
              <Link href={"/khyanalt/tokhirgoo"}>
                Тохиргооний хуудасруу шилжих
              </Link>
            </div>
          </div>
        ) : null}
        {songogdsonAlkham === 2 ? (
          <div
            data-aos="zoom-in-right"
            data-aos-delay="200"
            className="absolute -top-1 z-10   "
          >
            <div className="mt-24 h-full w-full space-y-5 overflow-y-auto px-10">
              <div className=" rounded-3xl border-2 p-2">
                <p className="text-center">Ажилтан бүртгэл</p>
                <Image src="/ajiltanBurtgel.png" />
                <p>
                  Системд ажиллах ажилтны хувийн мэдээллийг бүртгэх мөн системд
                  нэвтрэх хаяг буюу нэвтрэх нэр, нууц үг үүсгэх.
                </p>
              </div>
              <div className=" rounded-3xl border-2 p-2">
                <p className="text-center">Ажилтанд эрх өгөх</p>
                <Image src="/ajiltanTokhirgoo.png" />
                <p>
                  Бүртгэсэн ажилтанд системд ажиллах тус тусын цонхны эрхийг
                  өгөх боломжтой.
                </p>
              </div>
            </div>
          </div>
        ) : null}
        {songogdsonAlkham === 3 ? (
          <div
            data-aos="fade-right"
            data-aos-delay="200"
            className="absolute -top-1 z-10 h-full w-full   px-2 pr-5 "
          >
            <div className="mt-[90px] h-full space-y-5 overflow-y-auto pb-24 pr-5">
              <div className=" rounded-3xl border-2 p-2">
                <p className="text-center">Гэрээ байгуулах</p>
                <Image src="/gereeBaiguulakh.PNG" />

                <p>
                  {" "}
                  Нийлүүлэгч тус бүрээр гэрээ байгуулан төлөлтийн хуваарь хүүний
                  бодолт зэргийг харах боломжтой.
                </p>
              </div>
              <div className="rounded-3xl border-2 p-2">
                <p className="text-center">Гэрээний загвар</p>
                <Image src="/gereeniiZagvar.PNG" />

                <p>
                  Гэрээний загвар үүсгэснээр цаашид харилцагч тус бүрээр автомат
                  гэрээ байгуулагдах боломжтой. Олон гэрээний загвар үүсгэх
                  боломжтой ба үүсгэсэн загвараа хуулбарлах эсвэл устгах
                  боломжтой.
                </p>
              </div>
              <div className=" rounded-3xl border-2 p-2">
                <p className="text-center">Dashboard</p>
                <Image src="/gereeJagsaalt.PNG" />

                <p>
                  Нийт хийгдсэн гэрээний дагуу явцын мэдээллийг удирдах
                  боломжтой. Хугацаа дууссан, төлбөр дутуу, цуцлагдсан гэх
                  мэдээллүүдийг Дашборд дээр дарснаар шүүн харах боломжтой.
                </p>
              </div>
            </div>
          </div>
        ) : null}
        {songogdsonAlkham === 4 ? (
          <div
            data-aos="zoom-in-right"
            data-aos-delay="200"
            className="absolute -top-1 z-10   "
          >
            <div className="mt-24 h-full w-full space-y-5 overflow-y-auto px-10">
              <div className=" rounded-3xl border-2 p-2">
                <p className="text-center">Нийлүүлэгчдийн бүртгэл</p>
                <Image src="/khariltsgchBurtgel.png" />
                <p>
                  Нийлүүлэгчдийн зээлж болох нийт дүн, боломжит дүн, зээлийн
                  үнэлгээ зэрэг хувийн мэдээллүүдийг бүртгэлжүүлнэ.
                </p>
              </div>
              <div className=" rounded-3xl border-2 p-2">
                <p className="text-center">Эксел загвар</p>
                <Image src="/khariltsagchExel.PNG" />
                <p>
                  Олноор нь эксел ашиглан системд оруулах эсвэл татаж авах
                  боломжтой.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default React.forwardRef(Tuslamj);
