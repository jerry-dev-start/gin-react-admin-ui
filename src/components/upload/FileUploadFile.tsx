import { useUploader } from "@/hooks/useUploader";
import { InboxOutlined } from "@ant-design/icons";
import { message, type UploadProps } from "antd";
import Dragger from "antd/es/upload/Dragger";


export default function FileUploadFile(){

    const { uploadProcess } = useUploader();
    
    const props: UploadProps = {
        name: 'file',
        multiple: true,

        customRequest: uploadProcess, 
        
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log("上传中");
            }
            if (info.file.status === 'done') {
               console.log("上传完成");
            } else if (info.file.status === 'error') {
                 console.log("上传失败");
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (<>
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或将文件拖动至此区域以上传</p>
            <p className="ant-upload-hint">
            支持单个或批量上传。严禁上传公司数据或其他敏感文件
            </p>
        </Dragger>
    </>)
}