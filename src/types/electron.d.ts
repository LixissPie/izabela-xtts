interface ElectronAPI {
  storeGet: (key: string) => Promise<any>;
  storeSet: (key: string, value: any) => Promise<boolean>;
  storeDelete: (key: string) => Promise<boolean>;
  storeHas: (key: string) => Promise<boolean>;
}

interface Window {
  electronAPI: ElectronAPI;
}