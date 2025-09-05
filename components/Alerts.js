// import React, { useEffect, useState } from "react";
// import {
//   InfoCircleOutlined,
//   CloseOutlined,
//   CheckCircleOutlined,
//   ExclamationCircleOutlined,
// } from "@ant-design/icons";

// export default function Alert({ message, text, type, setAlert }) {
//   useEffect(() => {
//     if (type) {
//       setTimeout(() => {
//         setAlert();
//       }, 8000);
//     }
//   }, [type]);

//   if (type === "anhaaruulga") {
//     return (
//       <div
//         className={`alert fixed right-5 z-[999999999] max-h-[90vh] min-h-[90px] min-w-[760px] max-w-[95vw] overflow-auto rounded-md border-l-4 border-l-[#E54545] bg-white p-5 font-bold text-black shadow-lg`}>
//         <div className='flex flex-col gap-1'>
//           <div className='flex gap-3'>
//             <div className=' flex flex-row text-xl text-[#4FD1C5]'>
//               <InfoCircleOutlined />
//             </div>
//             <div className='flex h-[24px] w-[100%] text-[16px] '>{message}</div>
//             <div className='right-5 flex flex-row'>
//               <button type='primary' onClick={() => setAlert()}>
//                 <CloseOutlined className='text-xl text-black' />
//               </button>
//             </div>
//           </div>
//           <div className='flex pl-8 text-[#838E9E]'>{text}</div>
//         </div>
//       </div>
//     );
//   } else if (type === "amjilttai") {
//     return (
//       <div
//         className={`alert fixed right-5 z-[999999999] max-h-[90vh] min-h-[90px] min-w-[760px] max-w-[95vw] overflow-auto rounded-md border-l-4 border-l-[#E54545] bg-white p-5 font-bold text-black shadow-lg`}>
//         <div className='flex flex-col gap-1'>
//           <div className='flex gap-3'>
//             <div className=' flex flex-row text-xl text-[#0F9918]'>
//               <CheckCircleOutlined />
//             </div>
//             <div className='flex h-[24px] w-[100%] text-[16px] '>{message}</div>
//             <div className='right-5 flex flex-row'>
//               <button type='primary' onClick={() => setAlert()}>
//                 <CloseOutlined className='text-xl text-black' />
//               </button>
//             </div>
//           </div>
//           <div className='flex pl-8 text-[#838E9E]'>{text}</div>
//         </div>
//       </div>
//     );
//   } else if (type === "sanamj") {
//     return (
//       <div
//         className={`alert fixed right-5 z-[999999999] max-h-[90vh] min-h-[90px] min-w-[760px] max-w-[95vw] overflow-auto rounded-md border-l-4 border-l-[#E54545] bg-white p-5 font-bold text-black shadow-lg`}>
//         <div className='flex flex-col gap-1'>
//           <div className='flex gap-3'>
//             <div className=' flex flex-row text-xl text-[#FF8800]'>
//               <ExclamationCircleOutlined />
//             </div>
//             <div className='flex h-[24px] w-[100%] text-[16px] '>{message}</div>
//             <div className='right-5 flex flex-row'>
//               <button type='primary' onClick={() => setAlert()}>
//                 <CloseOutlined className='text-xl text-black' />
//               </button>
//             </div>
//           </div>
//           <div className='flex pl-8 text-[#838E9E]'>{text}</div>
//         </div>
//       </div>
//     );
//   } else if (type === "aldaa") {
//     return (
//       <div
//         className={`alert fixed right-5 z-[999999999] max-h-[90vh] min-h-[90px] min-w-[760px] max-w-[95vw] overflow-auto rounded-md border-l-4 border-l-[#E54545] bg-white p-5 font-bold text-black shadow-lg`}>
//         <div className='flex flex-col gap-1'>
//           <div className='flex gap-3'>
//             <div className=' flex flex-row text-xl text-[#E54545]'>
//               <ExclamationCircleOutlined />
//             </div>
//             <div className='flex h-[24px] w-[100%] text-[16px] '>{message}</div>
//             <div className='right-5 flex flex-row'>
//               <button type='primary' onClick={() => setAlert()}>
//                 <CloseOutlined className='text-xl text-black' />
//               </button>
//             </div>
//           </div>
//           <div className='flex pl-8 text-[#838E9E]'>{text}</div>
//         </div>
//       </div>
//     );
//   }
// }
