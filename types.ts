
export interface UploadedFile {
  name: string;
  content: string;
}

export interface ConflictDetail {
  documentName: string;
  conflictingText: string;
}

export interface Conflict {
  issueTitle: string;
  conflicts: ConflictDetail[];
  explanation: string;
  suggestion: string;
}
