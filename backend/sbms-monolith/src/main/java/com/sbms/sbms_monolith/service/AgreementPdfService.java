package com.sbms.sbms_monolith.service;

import com.sbms.sbms_monolith.dto.agreement.AgreementPdfResult;
import com.sbms.sbms_monolith.model.Registration;
import com.sbms.sbms_monolith.util.HashUtil;

import com.itextpdf.barcodes.BarcodeQRCode;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.events.Event;
import com.itextpdf.kernel.events.IEventHandler;
import com.itextpdf.kernel.events.PdfDocumentEvent;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.layout.Canvas;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.*;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

@Service
public class AgreementPdfService {

    private final S3Service s3Service;

    public AgreementPdfService(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    public AgreementPdfResult generateAndUploadAgreement(Registration r) {

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);

            pdf.addEventHandler(
                    PdfDocumentEvent.END_PAGE,
                    new WatermarkHandler()
            );

            Document doc = new Document(pdf);
            doc.setMargins(40, 40, 40, 40);

            // ================= HEADER =================
            Paragraph title = new Paragraph("BOARDING AGREEMENT")
                    .setBold()
                    .setFontSize(20)
                    .setFontColor(ColorConstants.WHITE)
                    .setTextAlignment(TextAlignment.CENTER);

            Div header = new Div()
                    .setBackgroundColor(ColorConstants.DARK_GRAY)
                    .setPadding(15)
                    .add(title);

            doc.add(header);
            doc.add(new Paragraph("\n"));

            // ================= STUDENT & OWNER =================
            Table partyTable = new Table(new float[]{1, 1})
                    .useAllAvailableWidth();

            partyTable.addCell(sectionCell("Student Details",
                    "Name: " + r.getStudent().getFullName() +
                            "\nEmail: " + r.getStudent().getEmail()));

            partyTable.addCell(sectionCell("Owner Details",
                    "Name: " + r.getBoarding().getOwner().getFullName()));

            doc.add(partyTable);
            doc.add(new Paragraph("\n"));

            // ================= BOARDING DETAILS =================
            Div boardingBox = new Div()
                    .setBorder(new SolidBorder(ColorConstants.GRAY, 1))
                    .setPadding(12);

            boardingBox.add(sectionTitle("Boarding Details"));
            boardingBox.add(new Paragraph("Boarding Title: " + r.getBoarding().getTitle()));
            boardingBox.add(new Paragraph("Key Money Paid: " + r.getBoarding().getKeyMoney()));
            boardingBox.add(new Paragraph("Move-in Date: " + r.getMoveInDate()));
            boardingBox.add(new Paragraph("Contract Duration: " + r.getContractDuration()));

            doc.add(boardingBox);
            doc.add(new Paragraph("\n"));

            // ================= SIGNATURES =================
            Table signTable = new Table(new float[]{1, 1})
                    .useAllAvailableWidth();

            signTable.addCell(signatureCell(
                    "Student Signature",
                    signatureImage(r.getStudentSignatureBase64())
            ));

            signTable.addCell(signatureCell(
                    "Owner Signature",
                    signatureImage(r.getOwnerSignatureBase64())
            ));

            doc.add(signTable);
            doc.add(new Paragraph("\n"));

            // ================= QR + FOOTER =================
            Table footer = new Table(new float[]{1, 1})
                    .useAllAvailableWidth();

            footer.addCell(new Cell()
                    .add(new Paragraph("Verify Agreement Online")
                            .setBold())
                    .setBorder(Border.NO_BORDER)
                    .setVerticalAlignment(VerticalAlignment.MIDDLE));

            footer.addCell(new Cell()
                    .add(generateQrCode(r, pdf))
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setBorder(Border.NO_BORDER));

            doc.add(footer);

            doc.close();

            byte[] pdfBytes = baos.toByteArray();
            String pdfHash = HashUtil.sha256(pdfBytes);

            String pdfUrl = s3Service.uploadBytes(
                    pdfBytes,
                    "agreements/" + r.getId() + ".pdf",
                    "application/pdf"
            );

            return new AgreementPdfResult(pdfUrl, pdfHash);

        } catch (Exception e) {
            throw new RuntimeException("Agreement PDF generation failed", e);
        }
    }

    // ================= HELPERS =================

    private Cell sectionCell(String title, String content) {
        return new Cell()
                .add(sectionTitle(title))
                .add(new Paragraph(content))
                .setPadding(10)
                .setBorder(new SolidBorder(ColorConstants.GRAY, 1));
    }

    private Paragraph sectionTitle(String text) {
        return new Paragraph(text)
                .setBold()
                .setFontSize(13)
                .setFontColor(ColorConstants.BLUE);
    }

    private Cell signatureCell(String title, Image img) {
        return new Cell()
                .add(new Paragraph(title).setBold())
                .add(img)
                .setPadding(10)
                .setBorder(new SolidBorder(ColorConstants.GRAY, 1))
                .setTextAlignment(TextAlignment.CENTER);
    }

    private Image signatureImage(String base64) throws IOException {

        String clean = base64.contains(",")
                ? base64.split(",")[1]
                : base64;

        byte[] bytes = Base64.getDecoder().decode(clean);
        ImageData data = ImageDataFactory.create(bytes);

        return new Image(data)
                .scaleToFit(180, 80)
                .setMarginTop(10);
    }

    private Image generateQrCode(Registration r, PdfDocument pdf) {

        String verifyUrl =
                "https://localhost:8080/api/verify/" + r.getId();

        BarcodeQRCode qrCode = new BarcodeQRCode(verifyUrl);
        var qrForm = qrCode.createFormXObject(
                ColorConstants.BLACK,
                pdf
        );

        return new Image(qrForm)
                .scaleToFit(110, 110);
    }

    // ================= WATERMARK =================

    private static class WatermarkHandler implements IEventHandler {

        @Override
        public void handleEvent(Event event) {

            PdfDocumentEvent docEvent = (PdfDocumentEvent) event;
            Rectangle pageSize = docEvent.getPage().getPageSize();

            PdfCanvas canvas = new PdfCanvas(docEvent.getPage());
            Canvas modelCanvas = new Canvas(canvas, pageSize);

            Paragraph watermark =
                    new Paragraph("SMART BOARDING MANAGEMENT SYSTEM")
                            .setFontColor(ColorConstants.LIGHT_GRAY)
                            .setFontSize(48)
                            .setOpacity(0.15f);

            modelCanvas.showTextAligned(
                    watermark,
                    pageSize.getWidth() / 2,
                    pageSize.getHeight() / 2,
                    docEvent.getDocument().getPageNumber(docEvent.getPage()),
                    TextAlignment.CENTER,
                    VerticalAlignment.MIDDLE,
                    45
            );

            modelCanvas.close();
        }
    }
}
