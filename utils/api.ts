export async function apiFetcher<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, init);
  const data = (await response.json()) as T;
  return { response: response.status, data };
}
