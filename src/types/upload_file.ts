export interface UploadFile {
    fileUrl: string;
    fileName: string
}

/**
 * 分片上传初始化响应接口
 */
export interface InitUploadResponse {
  /** 任务唯一标识（通常为文件MD5） */
  uploadId: string;
  /** 已成功上传的分片索引列表，例如 [0, 1, 2] */
  uploadedChunks: number[];
  /** 是否触发秒传（如果为 true，则无需继续上传分片） */
  isExisted: boolean;
  /** 文件访问地址（仅在 isExisted 为 true 或上传完成后返回） */
  fileUrl?: string; // 对应 Go 的 omitempty
}