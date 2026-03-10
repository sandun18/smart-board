package com.sbms.sbms_monolith.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class S3Service {

    private final S3Client s3Client;

    @Value("${aws.s3.bucketName}")
    private String bucketName;

    public S3Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String uploadFile(MultipartFile file, String folderPrefix) {

        String key = folderPrefix + UUID.randomUUID() + "_" + file.getOriginalFilename();

        try {
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(key)
                            .contentType(file.getContentType())
                            .acl(ObjectCannedACL.PUBLIC_READ)  // PUBLIC READ
                            .build(),
                    RequestBody.fromBytes(file.getBytes())
            );

            return "https://" + bucketName + ".s3.amazonaws.com/" + key;

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }
    
    
    public String uploadBytes(byte[] data, String key, String contentType) {

        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .contentType(contentType)
                        .contentDisposition("inline")                // 🔑 important
                        .acl(ObjectCannedACL.PUBLIC_READ)  
                        .build(),
                software.amazon.awssdk.core.sync.RequestBody.fromBytes(data)
        );

        return "https://" + bucketName + ".s3.amazonaws.com/" + key;
    }


    public String uploadFile(MultipartFile file) {
        return uploadFile(file, "");
    }

    public List<String> uploadFiles(List<MultipartFile> files, String folderPrefix) {

        List<String> uploadedUrls = new ArrayList<>();

        for (MultipartFile f : files) {
            uploadedUrls.add(uploadFile(f, folderPrefix));
        }

        return uploadedUrls;
    }

    public void deleteFile(String fileUrl) {

        // Extract S3 key from full URL
        String key = fileUrl.substring(fileUrl.indexOf(".com/") + 5);

        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build()
        );
    }
    
    
    
    public byte[] downloadFile(String fileUrl) {

        String key = fileUrl.substring(fileUrl.indexOf(".com/") + 5);

        ResponseBytes<GetObjectResponse> object =
                s3Client.getObjectAsBytes(
                        GetObjectRequest.builder()
                                .bucket(bucketName)
                                .key(key)
                                .build()
                );

        return object.asByteArray();
    }
}
