const BASE_URL = "http://localhost:18322";

export async function postRequest<T>(endpoint: string, body: unknown): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    credentials: "omit",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchOperators() {
  return postRequest<import("@/types/operator").OperatorResponse>("/GetOperatorsUi", {
    uiMessage: {
      header: {
        messageType: "GetOperatorsUi",
        sessionId: "a9244e22-d829-4a9b-a41b-1fcde178fd22",
      },
    },
  });
}
