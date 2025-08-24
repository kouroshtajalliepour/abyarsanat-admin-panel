type uploadOptions ={
    headers: any,
    body: any, 
    url: string
}

export function useUpload (){

    function mock(file:any) {
        return `http://my-domain.com/test-image-${Math.floor(Math.random() * 100)}`        
    }

    function uploadUsingSignedUrl(res:any, file:any){
        
        return new Promise(async (resolve, reject) =>{
            console.log("🚀 ~ file: useUpload.ts:14 ~ uploadUsingSignedUrl ~ res:", res)

            try {
                const formData = new FormData()
                Object.entries(res.upload).forEach(([field, value]:any) => {
                    formData.append(field, value);
                });
                formData.append('ContentType', file.type)
                formData.append('file', file)
                await $fetch(res.url, {
                    method: 'POST',
                    body: formData
                });
          
                resolve(
                  `https://${res.upload.bucket}.s3.ir-thr-at1.arvanstorage.com/${res.upload.key}`
                )
            } catch (error: any) {
                console.log(error)
                reject(error)
            }
        })
    }


    return {
        mock,
        uploadUsingSignedUrl
    }
}