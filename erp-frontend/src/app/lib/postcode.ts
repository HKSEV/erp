// 다음(카카오) 우편번호 검색: 스크립트를 처음 쓸 때만 불러오고, 선택한 주소를 돌려줌
const SCRIPT_SRC = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

interface PostcodeData {
  address: string;
  addressType: "R" | "J";  // R: 도로명, J: 지번
  bname: string;           // 법정동 이름
  buildingName: string;
};

interface DaumPostcode {
  Postcode: new (options: {
    oncomplete: (data: PostcodeData) => void;
    onclose?: (state: "FORCE_CLOSE" | "COMPLETE_CLOSE") => void;
  }) => {open: () => void};
};

const getDaum = () => (window as unknown as {daum?: DaumPostcode}).daum;

const loadScript = () => new Promise<void>((resolve, reject) => {
  if (getDaum()?.Postcode)
    return resolve();
  const script = document.createElement("script");
  script.src = SCRIPT_SRC;
  script.onload = () => resolve();
  script.onerror = () => reject(new Error("주소 검색을 불러오지 못했습니다."));
  document.head.appendChild(script);
});

// 도로명 주소면 동 이름·건물명을 괄호로 붙임 (예: 판교역로 166 (백현동, 카카오 판교아지트))
const toFullAddress = (data: PostcodeData) => {
  if (data.addressType !== "R")
    return data.address;
  const extra = [data.bname, data.buildingName].filter(Boolean).join(", ");
  return extra ? `${data.address} (${extra})` : data.address;
};

// 주소를 고르면 주소 문자열, 창을 그냥 닫으면 null
export async function searchAddress(): Promise<string | null> {
  await loadScript();
  const daum = getDaum()!;
  return new Promise((resolve) => {
    new daum.Postcode({
      oncomplete: (data) => resolve(toFullAddress(data)),
      onclose: (state) => {
        if (state === "FORCE_CLOSE")
          resolve(null);
      },
    }).open();
  });
};
