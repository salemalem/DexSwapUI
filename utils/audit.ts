const headers = new Headers();
headers.append("Host", "quaint-orbital-isle.quiknode.pro");
headers.append(
  "User-Agent",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0"
);
headers.append("Accept", "*/*");
headers.append("Accept-Language", "en-US,en;q=0.5");
headers.append("Accept-Encoding", "gzip, deflate, br");
headers.append("Content-Type", "application/json");
headers.append("Content-Length", "109");
headers.append("Referer", "https://unidexai.xyz/");
headers.append("Origin", "https://unidexai.xyz");
headers.append("Sec-Fetch-Dest", "empty");
headers.append("Sec-Fetch-Mode", "cors");
headers.append("Sec-Fetch-Site", "cross-site");
headers.append("Sec-GPC", "1");
headers.append("Connection", "keep-alive");
headers.append("TE", "trailers");

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const token = req.body.token; // Assuming you're sending token in the request body
    const requestBody = {
      method: "gp_tokenSecurity",
      params: [token],
      id: 42,
      jsonrpc: "2.0",
    };

    try {
      const response = await fetch(
        "https://quaint-orbital-isle.quiknode.pro/139ce259bfc400c1f76445c20826eaf95d38780b/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonData = await response.json();
      res.status(200).json(jsonData);
    } catch (e) {
      const error = e as Error;
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
