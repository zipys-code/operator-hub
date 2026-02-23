export interface OperatorResponse {
  uiMessage: {
    header: {
      messageType: string;
      sessionId: string;
    };
    responseData: {
      operatorList: {
        operator: Operator[];
      };
    };
  };
}

export interface Operator {
  recordId: string;
  operatorId: number;
  operatorName: string;
  tripQueryUrl: string;
  historyQueryUrl: string;
  adminStatusCode: string;
  adminStatusDesc: string;
  operationStatusCode: string;
  operationStatusDesc: string;
  retrievalInterval: number;
  previousCallsCount: number;
  predictionSystemIdList: {
    predictionSystemId: string[];
  };
  mainPredictionSystemId: string;
  mainPredictionSystemName: string | null;
  kavRazifPassword: string;
  kavRazifApiIpList: {
    kavRazifApiIp: string[];
  };
  saveInterfaceContentFlag: boolean;
  testingPeriodFlag: boolean;
  historyQueryEnabledFlag: boolean;
  vmProtocolVersionCode: string;
  vmProtocolVersionDesc: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string;
  lastQueryTime: string;
  lastSuccessfulQueryTime: string;
  lastHistorySyncTime: string;
}
