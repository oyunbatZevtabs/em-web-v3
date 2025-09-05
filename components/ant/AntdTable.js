import React, { useEffect, useState } from "react";
import { Empty, Spin, Table as TableAntd } from "antd";

const Table = ({
  columns,
  className,
  data,
  rowSelection,
  loading,
  emptyText,
  numbers,
  pageNum,
  pageSize,
  numbersFixed,
  unshijBaina,
  ...props
}) => {
  var locale = {
    ...props,
    pagination: {
      ...props.pagination,
      locale: { items_per_page: "/Хуудас" },
    },
  };

  if (props.pagination === false) {
    locale.pagination = false;
  }

  return (
    <>
      <TableAntd
        size="small"
        bordered={false}
        locale={{
          emptyText: (
            <>
              <Empty description={emptyText || "Хоосон байна"} />
            </>
          ),
        }}
        className={className}
        dataSource={data}
        columns={columns}
        rowSelection={rowSelection}
        loading={{
          indicator: (
            <div>
              <Spin />
            </div>
          ),
          spinning: unshijBaina !== void 0 ? unshijBaina : !props?.dataSource,
        }}
        {...locale}
      />
    </>
  );
};

export default Table;
