interface Props {
  token: string;
}

export function Chart({ token }: Props) {
  const url = `https://dexscreener.com/ethereum/${token}?embed=1&theme=dark&info=0`;

  return (
    <iframe
      src={url}
      className="flex-grow outline-none col-start-5 col-end-13 w-full h-full row-span-2"
    />
  );
}
