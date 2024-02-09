interface DexInfo {
  liquidity_type: string;
  name: string;
  liquidity: string;
  pair: string;
}

interface NftInfo {
  value: string;
  NFT_id: string;
  amount: string;
  in_effect: string;
  NFT_percentage: string;
}

interface LpHolder {
  address: string;
  tag: string;
  value: string;
  is_contract: number;
  balance: string;
  percent: string;
  NFT_list: NftInfo[];
  is_locked: number;
}

export interface AuditResult {
  [key: string]: {
    anti_whale_modifiable: string;
    buy_tax: string;
    can_take_back_ownership: string;
    cannot_buy: string;
    cannot_sell_all: string;
    creator_address: string;
    creator_balance: string;
    creator_percent: string;
    dex: DexInfo[];
    external_call: string;
    hidden_owner: string;
    holder_count: string;
    honeypot_with_same_creator: string;
    is_anti_whale: string;
    is_blacklisted: string;
    is_honeypot: string;
    is_in_dex: string;
    is_mintable: string;
    is_open_source: string;
    is_proxy: string;
    is_whitelisted: string;
    lp_holder_count: string;
    lp_holders: LpHolder[];
    lp_total_supply: string;
    owner_address: string;
    owner_balance: string;
    owner_change_balance: string;
    owner_percent: string;
    personal_slippage_modifiable: string;
    selfdestruct: string;
    sell_tax: string;
    slippage_modifiable: string;
    token_name: string;
    token_symbol: string;
    total_supply: string;
    trading_cooldown: string;
    transfer_pausable: string;
  };
}

export interface AuditDataResponse {
  id: number;
  jsonrpc: string;
  result: AuditResult;
}
