package com.sbms.sbms_monolith.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendResetToken(String to, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject("🔐 Password Reset Request");

            String html = """
            	    <div style="font-family: 'Poppins', Arial, sans-serif; padding: 0; margin: 0; background: #eef2f7;">
            	      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            	        
            	        <!-- Card -->
            	        <div style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 25px rgba(0,0,0,0.15);">
            	          
            	          <!-- Header -->
            	          <div style="background: linear-gradient(135deg, #0ea5e9, #7dd3fc); padding: 25px; text-align: center;">
            	            <h2 style="color: #fff; margin: 0; font-weight: 700; font-size: 24px;">
            	              🔐 Password Reset Request
            	            </h2>
            	          </div>
            	          
            	          <!-- Content -->
            	          <div style="padding: 30px; color: #333; font-size: 16px; line-height: 1.6;">
            	            <p>Hello,</p>
            	            <p>You requested to reset your password. Use the token below:</p>

            	            <div style="
            	              background: #0ea5e9;
            	              color: #fff;
            	              padding: 14px 25px;
            	              text-align: center;
            	              display: inline-block;
            	              border-radius: 10px;
            	              font-size: 20px;
            	              letter-spacing: 3px;
            	              margin: 20px 0;
            	              font-weight: 700;">
            	              %s
            	            </div>

            	            <p>This token is valid for <strong>10 minutes</strong>.</p>
            	            <p>If you did not make this request, please ignore this email.</p>
            	          </div>

            	          <!-- Footer -->
            	          <div style="background: #f1f5f9; padding: 18px; text-align: center; color: #555; font-size: 14px;">
            	            <strong>Spiral Softwares</strong><br/>
            	            Owned by <strong>Mr. Thareesha Marasinghe</strong>
            	          </div>

            	        </div>
            	      </div>
            	    </div>
            	    """.formatted(token);


            helper.setText(html, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send reset email", e);
        }
    }

    // 🔐 OTP Email
    public void sendOtpEmail(String to, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject("🔐 Your OTP Code");

            String html = """
            	    <div style="font-family: 'Poppins', Arial, sans-serif; padding: 0; margin: 0; background: #eef2f7;">
            	      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">

            	        <!-- Card -->
            	        <div style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 25px rgba(0,0,0,0.15);">

            	          <!-- Header -->
            	          <div style="background: linear-gradient(135deg, #10b981, #4ade80); padding: 25px; text-align: center;">
            	            <h2 style="color: #fff; margin: 0; font-weight: 700; font-size: 24px;">
            	              🔐 Email Verification
            	            </h2>
            	          </div>

            	          <!-- Body -->
            	          <div style="padding: 30px; color: #333; font-size: 16px; line-height: 1.6;">
            	            <p>Your One-Time Password (OTP) is:</p>

            	            <div style="
            	              background: #10b981;
            	              color: #fff;
            	              padding: 14px 25px;
            	              text-align: center;
            	              display: inline-block;
            	              border-radius: 10px;
            	              font-size: 22px;
            	              letter-spacing: 3px;
            	              margin: 20px 0;
            	              font-weight: 700;">
            	              %s
            	            </div>

            	            <p>This OTP is valid for <strong>10 minutes</strong>.</p>
            	            <p>Please do not share it with anyone.</p>
            	          </div>

            	          <!-- Footer -->
            	          <div style="background: #f1f5f9; padding: 18px; text-align: center; color: #555; font-size: 14px;">
            	            <strong>Spiral Softwares</strong><br/>
            	            Owned by <strong>Mr. Thareesha Marasinghe</strong>
            	          </div>

            	        </div>
            	      </div>
            	    </div>
            	    """.formatted(otp);


            helper.setText(html, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }
    
    
    @Async 
    public void sendPaymentReceipt(
            String toEmail,
            String studentName,
            byte[] pdfBytes,
            String receiptNumber
    ) {
        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("✅ Payment Successful | Receipt #" + receiptNumber);

            String html = """
            <div style="font-family: 'Poppins', Arial, sans-serif;
                        background:#eef2f7; padding:30px;">
              
              <div style="max-width:650px; margin:auto;
                          background:#ffffff; border-radius:18px;
                          overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.15);">
                
                <!-- Header -->
                <div style="background:linear-gradient(135deg,#2563eb,#60a5fa);
                            padding:28px; text-align:center;">
                  <h1 style="color:white; margin:0; font-size:26px;">
                    💳 Payment Successful
                  </h1>
                  <p style="color:#dbeafe; margin-top:6px;">
                    Smart Boarding Management System
                  </p>
                </div>

                <!-- Body -->
                <div style="padding:30px; color:#1e293b; font-size:16px; line-height:1.7;">
                  <p>Hi <strong>%s</strong>,</p>

                  <p>
                    Your payment has been <strong style="color:#22c55e;">successfully processed</strong>.
                    Please find your official payment receipt attached to this email.
                  </p>

                  <div style="
                      background:#f1f5f9;
                      border-left:6px solid #22c55e;
                      padding:16px;
                      border-radius:10px;
                      margin:20px 0;">
                    <strong>Receipt No:</strong> %s<br/>
                    <strong>Status:</strong> PAID ✅
                  </div>

                  <p>
                    This receipt can be used for future reference or disputes.
                  </p>

                  <p>
                    Thank you for choosing <strong>Smart Board</strong>.
                  </p>

                  <p style="margin-top:30px;">
                    Regards,<br/>
                    <strong>Smart Board Team</strong><br/>
                    <span style="color:#64748b; font-size:14px;">
                      Live Smarter. Manage Better.
                    </span>
                  </p>
                </div>

                <!-- Footer -->
                <div style="background:#f8fafc;
                            padding:18px; text-align:center;
                            font-size:13px; color:#64748b;">
                  © 2026 Smart Boarding Management System<br/>
                  Spiral Softwares · Sri Lanka
                </div>
              </div>
            </div>
            """.formatted(studentName, receiptNumber);

            helper.setText(html, true);

            // 📎 Attach PDF
            helper.addAttachment(
                    "Payment-Receipt-" + receiptNumber + ".pdf",
                    () -> new java.io.ByteArrayInputStream(pdfBytes)
            );

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send payment receipt email", e);
        }
    }
}
