import shalgaltKhiikh from "services/shalgaltKhiikh";
import { useAuth } from "services/auth";
import { url } from "services/uilchilgee";
import KhuviinMedeelel from "components/pageComponents/tokhirgoo/KhuviinMedeelel";
import NuutsUgSolikh from "components/pageComponents/tokhirgoo/NuutsUgSolikh";
import UndsenMedeelel from "components/pageComponents/tokhirgoo/UndsenMedeelel";

import { useMemo, useState } from "react";
import BaraaniiAngilal from "components/pageComponents/tokhirgoo/BaraaniiAngilal";
import { AiOutlinePullRequest } from "react-icons/ai";
import TsahimJor from "components/pageComponents/tokhirgoo/TsahimJor";
import EBarimtTokhirgoo from "components/pageComponents/tokhirgoo/EBarimtTokhirgoo";
import Dans from "components/pageComponents/tokhirgoo/Dans";
import { MdLoyalty, MdSettings } from "react-icons/md";
import { FaDoorClosed } from "react-icons/fa6";
import Loyalty from "components/pageComponents/tokhirgoo/loyalty";
import Medegdel from "components/pageComponents/tokhirgoo/Medegdel";
import SalbariinMedeelel from "components/pageComponents/tokhirgoo/SalbariinMedeelel";
import { ContactsFilled } from "@ant-design/icons";
import Khaalt from "components/pageComponents/tokhirgoo/Khaalt";

function Tokhirgoo({
  tokhirgooModalKhaayaa,
  setTokhirgooModal,
  setAsuukhEsekh,
}) {
  const {
    token,
    ajiltan,
    ajiltanMutate,
    baiguullagaMutate,
    baiguullagiinId,
    baiguullaga,
    salbariinId,
  } = useAuth();

  const [tsonkh, setTsonkh] = useState(null);

  const tokhirgoo = useMemo(() => {
    if (ajiltan?.albanTushaal === "Admin")
      return [
        {
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
              className="feather feather-settings mr-2 h-4 w-4"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          ),
          text: "Хаалт",
          tsonkh: (
            <UndsenMedeelel
              {...{ ajiltan, ajiltanMutate, baiguullagaMutate }}
              tokhirgooModalKhaayaa={tokhirgooModalKhaayaa}
              huwiinMedeelelKhadgalakh={huwiinMedeelelKhadgalakh}
            />
          ),
        },
      ];
    else
      return [
        {
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
              className="feather feather-activity mr-2 h-4 w-4"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          ),
          text: "Хувийн мэдээлэл",
          tsonkh: (
            <KhuviinMedeelel
              tokhirgooModalKhaayaa={tokhirgooModalKhaayaa}
              {...{ ajiltan, ajiltanMutate }}
            />
          ),
        },
        // {
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
        //       strokeLinejoin="round"
        //       className="feather feather-lock mr-2 h-4 w-4">
        //       <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        //       <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        //     </svg>
        //   ),
        //   text: "Нууц үг солих",
        //   tsonkh: (
        //     <NuutsUgSolikh
        //       tokhirgooModalKhaayaa={tokhirgooModalKhaayaa}
        //       token={token}
        //       {...{ ajiltan, ajiltanMutate }}
        //     />
        //   ),
        // },
        {
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
              icon-name="message-square"
              data-lucide="message-square"
              className="lucide lucide-message-square mr-2 h-4 w-4"
            >
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
            </svg>
          ),
          text: "Барааны ангилал",
          tsonkh: (
            <BaraaniiAngilal
              setAsuukhEsekh={setAsuukhEsekh}
              setTsonkh={setTsonkh}
              tokhirgooModalKhaayaa={tokhirgooModalKhaayaa}
              setTokhirgooModal={setTokhirgooModal}
            />
          ),
        },
        {
          icon: <AiOutlinePullRequest className="mr-2" size={16} />,
          text: "Цахим жор",
          tsonkh: (
            <TsahimJor
              {...{ ajiltan, ajiltanMutate, baiguullagiinId }}
              token={token}
            />
          ),
        },
        {
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
              className="feather feather-settings mr-2 h-4 w-4"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          ),
          text: "Мэдэгдэл",
          tsonkh: (
            <Medegdel
              baiguullaga={baiguullaga}
              baiguullagaMutate={baiguullagaMutate}
              token={token}
              tokhirgooModalKhaayaa={tokhirgooModalKhaayaa}
            />
          ),
        },
        {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              className="feather feather-settings mr-2 h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              dataLucide="stop-circle"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <rect x="9" y="9" width="6" height="6"></rect>
            </svg>
          ),
          text: "И-Баримт",
          tsonkh: (
            <EBarimtTokhirgoo
              baiguullaga={baiguullaga}
              token={token}
              baiguullagaMutate={baiguullagaMutate}
              tokhirgooModalKhaayaa={tokhirgooModalKhaayaa}
            />
          ),
        },
        {
          icon: (
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 861.000000 1024.000000"
              className="feather feather-settings mr-2 h-4 w-4"
              preserveAspectRatio="xMidYMid meet"
              stroke="currentColor"
            >
              <g
                transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)"
                fill="currentColor"
                stroke="none"
              >
                <path
                  d="M116 10218 c-5 -25 -117 -2289 -116 -2350 l0 -38 144 0 c159 0 156
         -1 156 68 0 72 41 319 76 462 129 521 383 868 779 1061 145 71 252 102 433
         128 235 34 443 41 1215 41 l747 0 0 -1809 0 -1808 -727 -318 c-401 -174 -828
         -360 -950 -413 l-223 -97 0 -312 c0 -238 3 -313 12 -313 10 0 1302 560 1791
         776 l97 43 -2 -540 -3 -541 -945 -412 -945 -412 -3 -318 c-2 -253 0 -317 10
         -313 7 3 426 185 931 405 505 221 927 404 938 407 20 7 20 5 16 -1127 -3 -769
         -8 -1168 -16 -1243 -17 -158 -49 -348 -73 -424 -65 -212 -226 -379 -459 -474
         -176 -72 -353 -97 -696 -97 l-213 0 0 -125 0 -125 2185 0 2185 0 0 125 0 125
         -207 0 c-462 0 -693 52 -908 205 -195 138 -267 316 -316 785 -8 70 -13 595
         -16 1561 l-4 1456 940 409 941 409 0 318 0 317 -32 -14 c-42 -17 -1726 -751
         -1796 -782 l-52 -23 2 540 3 540 935 408 935 407 3 318 c2 253 0 317 -10 313
         -7 -3 -422 -184 -923 -402 -500 -218 -918 -399 -927 -402 -17 -5 -18 70 -18
         1486 l0 1491 803 0 c850 0 957 -5 1173 -50 451 -93 795 -314 1023 -655 147
         -220 213 -415 287 -850 18 -110 34 -201 34 -202 0 -2 63 -3 140 -3 l140 0 0
         163 c0 147 -82 2001 -96 2175 l-6 72 -4194 0 -4194 0 -4 -22z"
                />
              </g>
            </svg>
          ),
          text: "Данс",
          tsonkh: (
            <Dans
              baiguullaga={baiguullaga}
              token={token}
              salbariinId={salbariinId}
            />
          ),
        },
        {
          icon: (
            <MdSettings
              className="mr-1 sm:mr-2 text-gray-600 dark:text-gray-300"
              size={20} // slightly bigger base size
            />
          ),
          text: (
            <span className="text-xs sm:text-sm md:text-base">Хаалт</span>
          ),
          tsonkh: (
            <Khaalt
              {...{
                ajiltan,
                ajiltanMutate,
                baiguullagiinId,
                baiguullagaMutate,
              }}
              token={token}
            />
          ),
        },
        {
          icon: <ContactsFilled className="mr-2" size={16} />,
          text: "Салбар",
          tsonkh: <SalbariinMedeelel />,
        },
      ];
  }, [ajiltan, baiguullagiinId]);
  return (
    <div className="flex h-[75vh] gap-4">
      <div className="intro-y box mt-5 w-56 lg:mt-0">
        <div className="relative flex  items-center p-5">
          <div className="image-fit h-12 w-11">
            <img
              alt={ajiltan?.ner}
              src={
                ajiltan?.zurgiinNer
                  ? `${url}/ajiltniiZuragAvya/${ajiltan?.zurgiinNer}`
                  : "/profile.svg"
              }
              className="rounded-full ring-2 ring-[rgba(22,78,99,1)] ring-opacity-50 "
            />
          </div>
          <div className="ml-4 mr-auto">
            <div className="text-base font-medium dark:text-gray-300">{`${ajiltan?.ovog} ${ajiltan?.ner}`}</div>
            <div className="text-gray-600">{ajiltan?.albanTushaal}</div>
          </div>
        </div>
        <div className="border-t border-gray-200 p-5 text-[#293050] dark:text-gray-300">
          {tokhirgoo?.map((mur) => (
            <div
              className={`mt-5 flex cursor-pointer items-center ${
                mur?.text === tsonkh?.text ? "font-medium" : ""
              } `}
              onClick={() => setTsonkh(mur)}
            >
              {mur.icon} {mur.text}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full dark:text-gray-300">{tsonkh?.tsonkh}</div>
    </div>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default Tokhirgoo;
