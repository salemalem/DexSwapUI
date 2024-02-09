// pages/api/paraswap-quote.js
import type { NextApiRequest, NextApiResponse } from "next";

// Assuming a simplified response type for the purpose of this example
type SwapQuoteResponse = {
  priceRoute: {
    srcToken: {
      address: string;
      symbol: string;
      decimals: number;
    };
    destToken: {
      address: string;
      symbol: string;
      decimals: number;
    };
    srcAmount: string;
    destAmount: string;
    bestRoute: Array<{
      exchange: string;
      percent: number;
      srcAmount: string;
      destAmount: string;
    }>;
  };
};

export default async function getSwapQuote(
  req: NextApiRequest,
  res: NextApiResponse<SwapQuoteResponse | { message: string }>
) {
  const { srcToken, destToken, amount, side } = req.query;

  // Validate required parameters
  if (!srcToken || !destToken || !amount || !side) {
    return res.status(400).json({ message: "Missing required query parameters: srcToken, destToken, amount, side" });
  }

  const url = `https://apiv5.paraswap.io/prices/?srcToken=${srcToken}&destToken=${destToken}&amount=${amount}&side=${side}&network=1`;

  try {
    const response = await fetch(url);

    // Check if the API call was successful
    if (!response.ok) {
      // If not, throw an error with the status code
      throw new Error(`ParaSwap API request failed with status: ${response.status}`);
    }

    const data: SwapQuoteResponse = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching swap quote from ParaSwap:', error);
    return res.status(500).json({ message: (error as Error).message || "An unexpected error occurred" });
  }
}