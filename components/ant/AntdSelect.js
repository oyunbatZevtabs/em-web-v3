// import React, { useState } from "react";
// import { CheckOutlined } from "@ant-design/icons";
// import { Select as SelectAntd, Space, Spin, Empty } from "antd";

// const Option = SelectAntd;

// export const Select = ({
//   options,
//   className,
//   infoColor,
//   style = {},
//   shalgahTalbar,
//   size,
//   disabled,
//   ...rest
// }) => {
//   const styled = style || {};

//   const [songogdsonValue, setSongogdsonValue] = useState();

//   let time = null;
//   return (
//     <SelectAntd
//       bordered={false}
//       className={className}
//       style={styled}
//       {...rest}
//       disabled={disabled}
//       notFoundContent={
//         rest?.loading ? (
//           <div>
//             <Spin />
//           </div>
//         ) : (
//           <Empty
//             description="Хоосон байна."
//             style={{ fontSize: "14px" }}
//             imageStyle={{
//               height: "50px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           />
//         )
//       }
//       // onSearch={(e) => {
//       //   if (searchApi) {
//       //     clearTimeout(time);
//       //     time = setTimeout(() => {
//       //       searchFunction?.(e);
//       //     }, 300);
//       //   }
//       // }}
//     >
//       {options?.map((option) => (
//         <Option
//           className={`mx-2 my-1 rounded-[10px] border-[1px] border-[#4FD1C5] p-4 font-semibold ${
//             option?.value === songogdsonValue ? "selected-option" : ""
//           }`}
//           key={option?.value}
//           value={option?.value}>
//           <div className="flex !items-center justify-between px-2 !text-center font-semibold">
//             {option?.label}
//           </div>
//           <div
//             className={`songgogdsonV first-letter: !flex h-[17px] w-[17px] items-center justify-center rounded-full border-[1px] border-[#4FD1C5] ${
//               option?.value === songogdsonValue && "bg-[#4FD1C5]"
//             }`}>
//             {option?.value === songogdsonValue && (
//               <CheckOutlined
//                 style={{ color: "white" }}
//                 className="text-[8px]"
//               />
//             )}
//           </div>
//         </Option>
//       ))}
//     </SelectAntd>
//   );
// };
