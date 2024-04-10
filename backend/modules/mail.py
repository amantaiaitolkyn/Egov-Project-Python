
import os
import smtplib
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


PDF_PATH = '/appp/output.pdf'
def send_email(email: str):
    sender = "your email"
    password = 'your password'
    receiver = email 
    subject = 'EGOV'
    message =  "Here is your PDF file"
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    
    try:
        server.login(sender, password)
        msg = MIMEMultipart()
        msg['From'] = sender
        msg['To'] = receiver
        msg['Subject'] = subject

        body = MIMEText(message)
        msg.attach(body)
        if os.path.exists(PDF_PATH):
            with open(PDF_PATH, 'rb') as pdf_file:
                pdf_attachment = MIMEApplication(pdf_file.read(), _subtype="pdf")
                pdf_file.close()
                pdf_attachment.add_header('Content-Disposition', 'attachment', filename='output.pdf')
                msg.attach(pdf_attachment)
        else:
            print(f"PDF file not found at {PDF_PATH}")
        server.sendmail(sender, receiver, msg.as_string())
    except Exception as ex:
        return f"{ex}\nError!"
    finally:
        server.quit()