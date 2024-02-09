import { Audit } from "@/components";
import { Chart } from "@/components/Chart";
import { Swap } from "@/components/Swap";
import { TokenInfo } from "@/types";
import { useState } from "react";

export default function Home() {
  const [token2, setToken2] = useState<TokenInfo>();

  return (
    <div className="grid grid-cols-12 grid-rows-2 bg-black text-white p-8 gap-4">
      <Swap token2={token2} setToken2={setToken2} />
      <Chart token={token2?.address || ""} />
      <Audit token={token2?.address || ""} />
    </div>
  );
}
