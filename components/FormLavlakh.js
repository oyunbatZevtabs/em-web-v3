import React, { useState, useMemo } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import { Select } from "antd";

const searchGenerator = (search, fields) => {
  if (!!search && !!fields)
    return {
      $or: fields.map((key) => ({ [key]: { $regex: search, $options: "i" } })),
    };
  else return {};
};

const fetcherJagsaalt = (
  url,
  token,
  { search, jagsaalt, ...khuudaslalt },
  query,
  fields
) =>
  axios(token)
    .get(url, {
      params: {
        query: {
          ...searchGenerator(search, fields),
          ...query,
        },
      },
      ...khuudaslalt,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useLavlakh(lavlakh, token, query, fields) {
  const [khuudaslalt, setLavlakhKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
    search: "",
  });
  const { data, mutate } = useSWR(
    !!token ? [`/${lavlakh}`, token, khuudaslalt, query, fields] : null,
    fetcherJagsaalt,
    { revalidateOnFocus: false }
  );
  return {
    lavlakhGaralt: data,
    lavlakhMutate: mutate,
    setLavlakhKhuudaslalt,
  };
}

function FormLavlakh({
  lavlakh,
  shuukhTalbaruud,
  query,
  token,
  value,
  onChange,
  valKey = "",
  infoKey = "",
  renderItem = undefined,
  InfoComponent = () => <div></div>,
  style,
  mode,
  placeholder,
  disabled,
  className,
  setSongosonEm,
  onSelect,
  index,
}) {
  const { lavlakhGaralt, setLavlakhKhuudaslalt } = useLavlakh(
    lavlakh,
    token,
    query,
    shuukhTalbaruud
  );

  const data = useMemo(() => {
    return lavlakhGaralt?.jagsaalt?.find((a) => a[valKey] === value);
  }, [lavlakhGaralt, value, valKey]);

  return (
    <div className={className}>
      <Select
        showSearch
        value={value}
        onChange={(v) => {
          onChange(v);
          v ? setSongosonEm(data) : setSongosonEm();
        }}
        loading={!lavlakhGaralt}
        onSearch={(search) => setLavlakhKhuudaslalt((a) => ({ ...a, search }))}
        style={style}
        mode={mode}
        placeholder={placeholder}
        filterOption={false}
        disabled={disabled}
        className="w-full"
        onSelect={(v, data) => onSelect(v, data, index)}
      >
        {lavlakhGaralt?.jagsaalt?.map((a) => (
          <Select.Option key={a[valKey]} value={a[valKey]}>
            {renderItem ? renderItem(a) : a[infoKey]}
          </Select.Option>
        ))}
      </Select>
      <InfoComponent data={data} />
    </div>
  );
}

export default FormLavlakh;
