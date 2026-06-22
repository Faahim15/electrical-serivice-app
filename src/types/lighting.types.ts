export interface LightingSectionProps {
  onUploadSingle: (uri: string) => Promise<string>;
  onDeleteSingle: (url: string) => Promise<void>;
  isUploading: boolean;
}

export interface LightingFieldProps {
  value: string;
  onChange: (value: any) => void;
}
