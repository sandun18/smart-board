package com.sbms.sbms_monolith.service;

import com.sbms.sbms_monolith.model.PaymentTransaction;
import com.sbms.sbms_monolith.model.User;
import com.sbms.sbms_monolith.model.Boarding;
import com.sbms.sbms_monolith.repository.UserRepository;
import com.sbms.sbms_monolith.repository.BoardingRepository;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.itextpdf.text.pdf.draw.LineSeparator;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.format.DateTimeFormatter;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentReceiptPdfService {

    private final UserRepository userRepository;
    private final BoardingRepository boardingRepository;

    public byte[] generate(PaymentTransaction tx) {

        try {
            Document doc = new Document(PageSize.A4, 36, 36, 36, 36);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(doc, out);
            doc.open();

            /* ---------- FETCH REAL DATA ---------- */

            Long studentId = tx.getIntent().getStudentId();
            Long ownerId   = tx.getIntent().getOwnerId();
            Long boardingId = tx.getIntent().getBoardingId();

            User student = userRepository.findById(studentId).orElse(null);
            User owner   = userRepository.findById(ownerId).orElse(null);
            Boarding boarding = boardingRepository.findById(boardingId).orElse(null);

            String studentName = student != null ? student.getFullName() : "N/A";
            String ownerName   = owner != null ? owner.getFullName() : "N/A";
            String boardingTitle = boarding != null ? boarding.getTitle() : "N/A";

            /* ---------- COLORS ---------- */
            BaseColor PRIMARY = new BaseColor(37, 99, 235);   // Blue
            BaseColor DARK = new BaseColor(15, 23, 42);
            BaseColor GRAY = new BaseColor(100, 116, 139);
            BaseColor SUCCESS = new BaseColor(34, 197, 94);

            /* ---------- FONTS ---------- */
            Font brand = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, PRIMARY);
            Font slogan = FontFactory.getFont(FontFactory.HELVETICA, 11, GRAY);

            Font section = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, DARK);
            Font label = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, GRAY);
            Font value = FontFactory.getFont(FontFactory.HELVETICA, 11, DARK);
            Font success = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, SUCCESS);

            /* ---------- HEADER ---------- */
            doc.add(new Paragraph("SMART BOARD", brand));
            doc.add(new Paragraph("Live Smarter. Manage Better.", slogan));
            doc.add(Chunk.NEWLINE);

            /* ---------- PAID SEAL ---------- */
            try {
                InputStream sealStream =
                        new ClassPathResource("pdf/paid-seal.png").getInputStream();
                Image seal = Image.getInstance(sealStream.readAllBytes());
                seal.scaleAbsolute(120, 120);
                seal.setAbsolutePosition(420, 700);
                doc.add(seal);
            } catch (Exception ignored) {}

            /* ---------- TITLE ---------- */
            doc.add(new Paragraph("PAYMENT RECEIPT", section));
            doc.add(new LineSeparator());
            doc.add(Chunk.NEWLINE);

            /* ---------- META TABLE ---------- */
            PdfPTable meta = new PdfPTable(2);
            meta.setWidthPercentage(100);

            addRow(meta, "Receipt No", tx.getTransactionRef(), label, value);
            addRow(meta, "Date",
                    tx.getPaidAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")),
                    label, value);
            addRow(meta, "Payment Method", tx.getMethod().name(), label, value);
            addRow(meta, "Status", "PAID", label, success);

            doc.add(meta);
            doc.add(Chunk.NEWLINE);

            /* ---------- PARTIES ---------- */
            PdfPTable parties = new PdfPTable(2);
            parties.setWidthPercentage(100);

            addBlock(parties, "STUDENT", studentName);
            addBlock(parties, "OWNER", ownerName);

            doc.add(parties);
            doc.add(Chunk.NEWLINE);

            /* ---------- BOARDING ---------- */
            doc.add(new Paragraph("Boarding: " + boardingTitle, value));
            doc.add(Chunk.NEWLINE);

            /* ---------- AMOUNTS ---------- */
            PdfPTable amounts = new PdfPTable(2);
            amounts.setWidthPercentage(100);

            addMoney(amounts, "Gross Amount", tx.getAmount());
            addMoney(amounts, "Platform Fee (2%)", tx.getPlatformFee());
            addMoney(amounts, "Gateway Fee (1%)", tx.getGatewayFee());

            PdfPCell netLabel = new PdfPCell(new Phrase("Net Amount to Owner", label));
            netLabel.setPadding(8);
            netLabel.setBorder(Rectangle.TOP);
            amounts.addCell(netLabel);

            PdfPCell netValue = new PdfPCell(
                    new Phrase("LKR " + tx.getNetAmount(), success));
            netValue.setPadding(8);
            netValue.setBorder(Rectangle.TOP);
            netValue.setHorizontalAlignment(Element.ALIGN_RIGHT);
            amounts.addCell(netValue);

            doc.add(amounts);

            /* ---------- FOOTER ---------- */
            doc.add(Chunk.NEWLINE);
            doc.add(new LineSeparator());
            doc.add(new Paragraph(
                    "This is a system-generated receipt.\n" +
                    "Powered by Smart Boarding Management System",
                    FontFactory.getFont(FontFactory.HELVETICA, 9, GRAY)
            ));

            doc.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("PDF generation failed", e);
        }
    }

    /* ---------- HELPERS ---------- */

    private void addRow(PdfPTable t, String l, String v, Font lf, Font vf) {
        t.addCell(cell(l, lf));
        t.addCell(cell(v, vf));
    }

    private void addBlock(PdfPTable t, String title, String name) {
        PdfPCell c = new PdfPCell();
        c.setPadding(10);
        c.setBorder(Rectangle.BOX);
        c.addElement(new Paragraph(title,
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11)));
        c.addElement(new Paragraph(name,
                FontFactory.getFont(FontFactory.HELVETICA, 12)));
        t.addCell(c);
    }

    private void addMoney(PdfPTable t, String label, Object value) {
        t.addCell(cell(label,
                FontFactory.getFont(FontFactory.HELVETICA, 11)));
        PdfPCell c = cell("LKR " + value,
                FontFactory.getFont(FontFactory.HELVETICA, 11));
        c.setHorizontalAlignment(Element.ALIGN_RIGHT);
        t.addCell(c);
    }

    private PdfPCell cell(String text, Font f) {
        PdfPCell c = new PdfPCell(new Phrase(text, f));
        c.setPadding(8);
        c.setBorder(Rectangle.NO_BORDER);
        return c;
    }
}
