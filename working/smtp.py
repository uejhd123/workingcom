import smtplib
from email.message import EmailMessage
import getpass

def send_email(subject, body, to):
    msg = EmailMessage()
    msg.set_content(body)

    msg['Subject'] = subject
    msg['From'] = 'workingcommail@mail.ru'
    msg['To'] = to

    user = 'workingcommail'
    password = 'ePdAsHEt57NSdbWsHrtq'
    server = smtplib.SMTP_SSL('smtp.mail.ru', 465)

    try:
        server.login(user, password)
        server.send_message(msg)
        print("Email sent successfully")
    except smtplib.SMTPAuthenticationError:
        print("Failed to authenticate")
    finally:
        server.quit()
