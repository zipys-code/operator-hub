const BASE_URL = "/api";

export async function postRequest<T>(endpoint: string, body: unknown): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  console.log("Attempting to fetch operators...", { url, body });
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchOperators() {
  const data = await postRequest<any>("/GetOperatorsUi", {
    uiMessage: {
      header: {
        messageType: "GetOperatorsUi",
        sessionId: "a9244e22-d829-4a9b-a41b-1fcde178fd22",
      },
    },
  });

  // בדיקה לפי ה-JSON ששלחת: הנתונים נמצאים בתוך operatorList.operator
  // אנחנו צריכים לוודא שהנתיב מדויק
  return data?.uiMessage?.responseData?.operatorList?.operator || [];
}
