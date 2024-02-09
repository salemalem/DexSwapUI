import { AuditDataResponse, AuditResult } from "@/types";
import { apiFetcher } from "@/utils/api";
import { useEffect, useState } from "react";

interface Props {
  token: string;
}

export function Audit({ token }: Props) {
  const [audit, setAudit] = useState<AuditResult[""] | null>(null);

  useEffect(() => {
    const getData = async () => {
      const data = await apiFetcher<AuditDataResponse>(
        `/api/audit?token=${token}`
      );
      const result = data.data.result;
      if (result) setAudit(result[token.toLowerCase()]);
    };
    getData();
  }, [token]);

  const checks = {
    "Ownership Renounce": Boolean(Number(audit?.can_take_back_ownership)),
    Blacklist: !Boolean(Number(audit?.is_blacklisted)),
    Whitelist: Boolean(Number(audit?.is_whitelisted)),
    "Honeypot Simulation": !Boolean(Number(audit?.is_honeypot)),
    "Transfer Pause": !Boolean(Number(audit?.transfer_pausable)),
    Opensource: Boolean(Number(audit?.is_open_source)),
    Proxy: !Boolean(Number(audit?.is_proxy)),
    Mintable: !Boolean(Number(audit?.is_mintable)),
  };

  return (
    <div className="bg-stone-800 h-fit rounded-md px-2 py-4 flex flex-col gap-2 col-span-4 my-auto">
      <h2 className="px-2">Quick Audit</h2>

      <div className="flex flex-col gap-4 flex-grow">
        <div className="bg-black px-4 p-2 flex flex-col">
          <span>
            {audit?.token_name} <strong>({audit?.token_symbol})</strong>
          </span>
          <span>
            Buy Tax: {Number(audit?.buy_tax) * 100}% | Sell Tax:{" "}
            {Number(audit?.sell_tax) * 100}%
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(checks).map(([entry, value], key) => (
            <div
              className="bg-black border-solid border-[1px] border-white/80 rounded-xl w-fit p-1 px-2"
              key={key}
            >
              {value ? "✔️" : "❌"}
              {entry}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
