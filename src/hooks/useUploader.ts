import { request } from '@/api/request';
import type { InitUploadResponse, UploadFile } from '@/types/upload_file';
import type { UploadProps } from 'antd';
import { useCallback } from 'react';
import SparkMD5 from 'spark-md5';

// 获取 customRequest 里的参数类型 (即你想要的 RcCustomRequestOptions)
// 通过 TS 的类型推导获取
type AntdCustomRequestOptions = Parameters<NonNullable<UploadProps['customRequest']>>[0];

export const useUploader = () => {
    const CHUNK_SIZE = 5 * 1024 * 1024
    const MAX_CONCURRENCY = 3; // 最大并发上传数

    // 1. 计算 MD5 的方法（加上类型约束）
    const calculateMD5 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
        const spark = new SparkMD5.ArrayBuffer();
        const reader = new FileReader();
        
        reader.readAsArrayBuffer(file);
        reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target?.result instanceof ArrayBuffer) {
            spark.append(e.target.result);
            resolve(spark.end());
            } else {
            reject(new Error('文件读取失败'));
            }
        };
        reader.onerror = () => reject(new Error('文件读取出错'));
        });
    };
  
    const uploadProcess = useCallback(async (options: AntdCustomRequestOptions): Promise<void> => {
        const { file, onProgress, onSuccess, onError } = options;

        // 因为 options.file 类型较为复杂（可能是 File | Blob | RcFile），这里做个转换
        const actualFile = file as File;

        try{
            if (actualFile.size <= CHUNK_SIZE) {
                const formData = new FormData();
                formData.append('file', actualFile);
                const response = await request.post<UploadFile>('/gra/file/uploadSimple', formData, {
                    onUploadProgress(progressEvent) {
                        if (progressEvent.total) {
                            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            // 告诉 AntD 当前进度
                            onProgress?.({ percent });
                        }
                    },
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                onSuccess?.(response);
                return;
            } 
            // --- 情况 B: 分片上传 ---
            // 计算哈希
            const md5: string = await calculateMD5(actualFile);
            console.log('启动分片上传...');
            // 2. 初始化分片上传 (Init)
            const initResponse = await request.post<InitUploadResponse>('/gra/file/chunkInit', {
                fileName: actualFile.name,
                fileSize: actualFile.size,
                md5: md5,
            });
            // 3. 秒传判断
            if (initResponse.isExisted) {
                onProgress?.({ percent: 100 });
                onSuccess?.(initResponse); 
                return;
            }
            const { uploadId, uploadedChunks = [] } = initResponse;
            const totalSize = actualFile.size;
            const totalChunks = Math.ceil(totalSize / CHUNK_SIZE);

            // 4. 准备待上传的任务队列
            const tasks: number[] = [];
            for (let i = 0; i < totalChunks; i++) {
                if (!uploadedChunks.includes(i)) {
                    tasks.push(i);
                }
            }

            // 记录当前已完成的总片数（包含后端已有的和本次刚传完的）
            let completedCount = uploadedChunks.length;

            // 5. 并发上传控制
            const uploadChunk = async (index: number) => {
                const start = index * CHUNK_SIZE;
                const end = Math.min(totalSize, start + CHUNK_SIZE);
                const chunkBlob = actualFile.slice(start, end);

                const formData = new FormData();
                formData.append('file', chunkBlob);
                formData.append('index', index.toString());
                formData.append('uploadId', uploadId);

                await request.post('/gra/file/uploadChunk', formData);
                
                // 增加完成数，并更新整体进度
                completedCount++;
                const totalPercent = Math.floor((completedCount / totalChunks) * 100);
                onProgress?.({ percent: Math.min(totalPercent, 99) }); // 合并前最高显示99%
            };

            // 简单的并发控制执行
            const executing: Promise<void>[] = [];
            for (const index of tasks) {
                const p = uploadChunk(index).then(() => {
                    executing.splice(executing.indexOf(p), 1);
                });
                executing.push(p);
                if (executing.length >= MAX_CONCURRENCY) {
                    await Promise.race(executing);
                }
            }
            await Promise.all(executing);

            // 6. 全部片传完，请求合并 (Complete)
            const completeResponse = await request.post<UploadFile>('/gra/file/chunkComplete', {
                uploadId,
                fileName: actualFile.name,
                totalChunks,
            });

            onProgress?.({ percent: 100 });
            onSuccess?.(completeResponse);
        }catch (err) {
            // 错误回调
            onError?.(err as Error);
        }

    },[]);

    return { uploadProcess };
};