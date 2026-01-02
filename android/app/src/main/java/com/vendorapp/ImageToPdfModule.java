package com.vendorapp;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.pdf.PdfDocument;
import android.net.Uri;
import android.os.Environment;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;

public class ImageToPdfModule extends ReactContextBaseJavaModule {
    
    private final ReactApplicationContext reactContext;
    
    public ImageToPdfModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }
    
    @Override
    public String getName() {
        return "ImageToPdfModule";
    }
    
    @ReactMethod
    public void convertImagesToPdf(ReadableArray imageUris, String outputFileName, Promise promise) {
        try {
            PdfDocument pdfDocument = new PdfDocument();
            
            // Loop through all images
            for (int i = 0; i < imageUris.size(); i++) {
                String imageUri = imageUris.getString(i);
                
                // 🔥 Debug log
                android.util.Log.d("ImageToPdfModule", "Processing URI: " + imageUri);
                
                // Load bitmap from URI
                Bitmap bitmap = loadBitmapFromUri(imageUri);
                
                if (bitmap == null) {
                    promise.reject("ERROR", "Failed to load image from: " + imageUri);
                    return;
                }
                
                android.util.Log.d("ImageToPdfModule", "Bitmap loaded: " + bitmap.getWidth() + "x" + bitmap.getHeight());
                
                // Create PDF page with bitmap dimensions
                PdfDocument.PageInfo pageInfo = new PdfDocument.PageInfo.Builder(
                    bitmap.getWidth(), 
                    bitmap.getHeight(), 
                    i + 1
                ).create();
                
                PdfDocument.Page page = pdfDocument.startPage(pageInfo);
                Canvas canvas = page.getCanvas();
                
                // Draw bitmap on canvas
                canvas.drawBitmap(bitmap, 0, 0, null);
                pdfDocument.finishPage(page);
                
                // Recycle bitmap to free memory
                bitmap.recycle();
            }
            
            // Save PDF to file
            File outputDir = reactContext.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS);
            if (outputDir == null) {
                promise.reject("ERROR", "Could not access storage directory");
                return;
            }
            
            File outputFile = new File(outputDir, outputFileName);
            
            FileOutputStream fos = new FileOutputStream(outputFile);
            pdfDocument.writeTo(fos);
            pdfDocument.close();
            fos.close();
            
            android.util.Log.d("ImageToPdfModule", "PDF saved at: " + outputFile.getAbsolutePath());
            
            // Return file path
            promise.resolve(outputFile.getAbsolutePath());
            
        } catch (Exception e) {
            android.util.Log.e("ImageToPdfModule", "Error: " + e.getMessage());
            e.printStackTrace();
            promise.reject("ERROR", e.getMessage());
        }
    }
    
    private Bitmap loadBitmapFromUri(String uriString) {
        try {
            // 🔥 Handle different URI formats
            
            // Case 1: file:// URI
            if (uriString.startsWith("file://")) {
                String filePath = uriString.replace("file://", "");
                File file = new File(filePath);
                
                if (!file.exists()) {
                    android.util.Log.e("ImageToPdfModule", "File does not exist: " + filePath);
                    return null;
                }
                
                FileInputStream fis = new FileInputStream(file);
                Bitmap bitmap = BitmapFactory.decodeStream(fis);
                fis.close();
                return bitmap;
            }
            
            // Case 2: content:// URI
            else if (uriString.startsWith("content://")) {
                Uri uri = Uri.parse(uriString);
                InputStream inputStream = reactContext.getContentResolver().openInputStream(uri);
                
                if (inputStream == null) {
                    android.util.Log.e("ImageToPdfModule", "Could not open content URI: " + uriString);
                    return null;
                }
                
                Bitmap bitmap = BitmapFactory.decodeStream(inputStream);
                inputStream.close();
                return bitmap;
            }
            
            // Case 3: Absolute file path
            else if (uriString.startsWith("/")) {
                File file = new File(uriString);
                
                if (!file.exists()) {
                    android.util.Log.e("ImageToPdfModule", "File does not exist: " + uriString);
                    return null;
                }
                
                return BitmapFactory.decodeFile(uriString);
            }
            
            // Case 4: Unknown format
            else {
                android.util.Log.e("ImageToPdfModule", "Unknown URI format: " + uriString);
                return null;
            }
            
        } catch (Exception e) {
            android.util.Log.e("ImageToPdfModule", "Error loading bitmap: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}