import React from "react";
import moment from "moment";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";

function Zakhialga({ onClose, token, ...object }) {
  const { turul, message, khariltsagchiinNer, createdAt, _id } = object || {};

  function sonorduulgaKharlaa() {
    uilchilgee(token)
      .post("/sonorduulgaKharlaa", { id: _id })
      .catch(aldaaBarigch);
    onClose();
  }

  return (
    <div
      id="notification-with-split-buttons-content"
      className="flex flex-row items-center"
      onClick={sonorduulgaKharlaa}
    >
      <div className="mr-2 flex"></div>
      <div className="md:mr-40">
        <div className="flex flex-row font-medium">
          <div>
            {turul}
            {khariltsagchiinNer}
          </div>
          <div className="ml-auto mt-1 text-sm font-medium text-gray-600">
            {moment(createdAt).format("YYYY-MM-DD")}
          </div>
        </div>
        <div className="mt-1 text-gray-600">Итгэлцэлийн гэрээний хүсэлт</div>
      </div>
      <div className=" absolute bottom-0 right-0 top-0 hidden flex-col border-l border-gray-200 md:flex">
        <a
          data-dismiss="notification"
          className="flex flex-1 items-center justify-center px-6 font-medium text-gray-600"
          onClick={onClose}
        >
          Хаах
        </a>
      </div>
    </div>
  );
}

export default Zakhialga;
