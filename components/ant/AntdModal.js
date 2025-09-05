import Draggable from "react-draggable";
import { Modal as ModalAnt } from "antd";
import { useRef, useState } from "react";

export const Modal = ({ huduldugModal = true, ...props }) => {
  const [disabled, setDisabled] = useState(true);
  const draggleRef = useRef(null);

  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });

  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  const customTitle = (
    <div
      onMouseOver={() => {
        if (disabled) {
          setDisabled(false);
        }
      }}
      onMouseOut={() => {
        setDisabled(true);
      }}
      onFocus={() => {}}
      onBlur={() => {}}
      className="cursor-move overflow-hidden rounded-xl text-center text-[20px] font-bold dark:text-gray-50"
    >
      {props.title}
    </div>
  );

  return huduldugModal ? (
    <ModalAnt
      modalRender={(modal) => (
        <Draggable
          disabled={disabled}
          bounds={bounds}
          nodeRef={draggleRef}
          onStart={(event, uiData) => onStart(event, uiData)}
        >
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
      bodyStyle={{ padding: "15px" }}
      maskClosable={false}
      {...props}
      title={customTitle}
    />
  ) : (
    <ModalAnt bodyStyle={{ padding: "15px" }} maskClosable={false} {...props} />
  );
};
