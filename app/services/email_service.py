import os
import resend

from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")


def send_order_email(
    email: str,
    order_number: str,
    delivery_time: str,
    order_id: str
):
    try:
        # Zmień localhost:5173 na domenę produkcyjną w przyszłości
        status_url = f"http://localhost:5173/status/{order_id}"

        resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to": email,
            "subject": f"Zamówienie {order_number}",
            "html": f"""
                <div style="font-family: Arial; padding: 20px;">
                    <h1>MJL Foods</h1>
                    <h2>Zamówienie przyjęte</h2>
                    <p>Numer zamówienia: <strong>{order_number}</strong></p>
                    <p>Szacowany czas dostawy: <strong>{delivery_time}</strong></p>
                    
                    <div style="margin: 25px 0;">
                        <a href="{status_url}" style="background-color: #ff4757; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Sprawdź status zamówienia live →
                        </a>
                    </div>

                    <hr>
                    <p>Dziękujemy za zamówienie</p>
                </div>
                """
        })
    except Exception as e:
        print(f"Email error: {e}")