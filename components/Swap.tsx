import { TokenInfo } from "@/types";
import { apiFetcher } from "@/utils/api";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TokenSelector } from "./TokenSelector";
import { Tokenslist } from "./TokensList";
import { Arrow } from "./Arrow";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { wagmiAbi } from "@/abi/abi";
import uniswapV2routerABI from "@/abi/uniswapV2router.abi.json";
import viem from "viem";

interface Props {
  token2: TokenInfo | undefined;
  setToken2: Dispatch<SetStateAction<TokenInfo | undefined>>;
}

export function Swap({ token2, setToken2 }: Props) {
  const [token1, setToken1] = useState<TokenInfo>();
  const [tokensList, setTokensList] = useState<TokenInfo[]>([]);
  const [showTokensList, setShowTokensList] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] = useState<"1" | "2">("1");
  const [token1Amount, setToken1Amount] = useState<number>(0);
  const [token2Amount, setToken2Amount] = useState<number>(0);

  useEffect(() => {
    const getTokensList = async () => {
      const mainListPromise = apiFetcher(
        "https://raw.githubusercontent.com/wiseapedev/TokenList/main/list.json"
      );

      const compoundListPromise = apiFetcher(
        "https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json"
      );

      const [mainList, compoundList] = await Promise.all([
        mainListPromise,
        compoundListPromise,
      ]);

      // @ts-ignore
      const allTokens = mainList.data.tokens.concat(
        // @ts-ignore
        compoundList.data.tokens
      ) as TokenInfo[];

      const weth: TokenInfo = {
        address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        chainId: 1,
        decimals: 18,
        logoURI:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
        name: "Wrapped Ether",
        symbol: "WETH",
      };
      allTokens.push(weth);

      const token1 = allTokens.find(
        ({ address }) =>
          address === "0xdAC17F958D2ee523a2206206994597C13D831ec7"
      );

      setToken1(token1);

      // const token2 = allTokens.find(
      //   ({ address }) =>
      //     address === "0xdAC17F958D2ee523a2206206994597C13D831ec7"
      // );

      setToken2(weth);
      setTokensList(allTokens);
    };

    getTokensList();
  }, [setToken2]);

  const reverse = () => {
    const oldToken1 = token1;
    setToken1(token2);
    setToken2(oldToken1);
  };

  const contractAddress = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
  const amountOutMin = 0;
  const recipientAddress = "0x0e614fc008eDf917B5Fc1faFe204c37f2b6EfB6e";
  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: uniswapV2routerABI,
    functionName: "swapExactTokensForTokens",
    chainId: 1,
    args: [
      token1Amount * 10 ** (token1?.decimals || 0), // amountIn
      amountOutMin, // amountOutMin
      [token1?.address, token2?.address], // path
      recipientAddress // to
    ],
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);
  const executeSwap = () => {
    console.log("Executing swap");
    console.log(data);
    console.log(isLoading);
    console.log(isSuccess);
    if (!isLoading && !isSuccess) {
      if (write) {
        write(); // Execute the swap
      }
    }
  };

  const calculateOutputPrice = async () => {
    return;
    if (!token1 || !token2 || token1Amount <= 0) {
      console.log("Invalid input");
      return;
    }
  
    const fromTokenAddress = token1.address; // The contract address of the input token
    const toTokenAddress = token2.address; // The contract address of the output token
    const amount = token1Amount * 10 ** (token1?.decimals || 18); // Convert the token amount to the smallest unit based on its decimals
    const side = 'SELL'; // Assuming you're selling the srcToken for destToken
    const network = 1; // Assuming Ethereum Mainnet
  
    // Adjust the URL to point to your Next.js API route
    const url = `/api/getSwapQuote?srcToken=${fromTokenAddress}&destToken=${toTokenAddress}&amount=${amount}&side=${side}&network=${network}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data && data.priceRoute && data.priceRoute.destAmount) {
        // Using destAmount from the priceRoute for output amount
        const outputAmount = parseInt(data.priceRoute.destAmount) / 10 ** (token2?.decimals || 18); // Adjust based on the destination token's decimals
        setToken2Amount(outputAmount);
        console.log(`Output price: ${outputAmount}`);
      } else {
        console.error("Failed to calculate output price.");
      }
    } catch (error) {
      console.error("Error fetching output price: ", error);
    }
  };

  return (
    <>
      {showTokensList && (
        <Tokenslist
          tokensList={tokensList}
          setShowTokensList={setShowTokensList}
          selectedToken={selectedToken}
          setToken1={setToken1}
          setToken2={setToken2}
        />
      )}

      <div className="bg-stone-800 h-fit rounded-md p-2 py-4 flex flex-col gap-3 col-span-4">
        <div className="flex justify-between items-center">
          <h2 className="px-2">Swap</h2>
          <ConnectButton chainStatus={"icon"} />
        </div>

        <div className="relative flex flex-col gap-1 flex-grow">
          <div className="relative">
            <input
              type="number"
              className="px-4 h-24 bg-black w-full text-4xl appearance-none rounded-md outline-none flex-grow"
              placeholder="0"
              value={token1Amount}
              onChange={(e) => {
                const number = Number(e.target.value);
                if (!isNaN(number)) setToken1Amount(number);
                calculateOutputPrice();
              }}
            />

            <TokenSelector
              token={token1}
              setShowTokensList={setShowTokensList}
              setSelectedToken={setSelectedToken}
              id="1"
            />
          </div>

          <button
            onClick={() => reverse()}
            className="p-2 rounded-md bg-black border-2 border-stone-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <Arrow />
          </button>

          <div className="relative">
            <input
              type="number"
              className="px-4 h-24 bg-black w-full text-4xl appearance-none rounded-md outline-none flex-grow"
              placeholder="0"
              value={token2Amount}
              onChange={(e) => {
                const number = Number(e.target.value);
                if (!isNaN(number)) setToken2Amount(number);
              }}
            />

            <TokenSelector
              token={token2}
              setShowTokensList={setShowTokensList}
              setSelectedToken={setSelectedToken}
              id="2"
            />
          </div>
        </div>

        <button
          className="w-full rounded-lg bg-black font-bold p-3"
          onClick={() => executeSwap()}
        >
          Swap
        </button>
      </div>
    </>
  );
}
