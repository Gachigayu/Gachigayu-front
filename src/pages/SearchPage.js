import styled from "@emotion/styled";
import KakaoMap from "../components/KakaoMap";
import SearchBar from "../components/SearchBar";
import SearchCategory from "../components/SearchCategory";
import SearchPanel from "../components/SearchPanel";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { pathState } from "../store/path";

const MapContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
`;

export default function SearchPage() {
  const [path, setPath] = useRecoilState(pathState);
  useEffect(() => {
    setPath([]);
  }, []);
  return (
    <MapContainer>
      <KakaoMap />
      <SearchBar />
      <SearchCategory
        style={{
          position: "absolute",
          top: "6.51rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      />
      <SearchPanel />
    </MapContainer>
  );
}
