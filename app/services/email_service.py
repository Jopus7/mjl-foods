import os
import resend

from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv(
    "RESEND_API_KEY"
)


def send_order_email(
    email: str,
    order_number: str,
    delivery_time: str
):
    try:
        resend.Emails.send({
            "from":
            "onboarding@resend.dev",

            "to":
            email,

            "subject":
            f"Zamówienie {order_number}",

            "html": f"""
                <div
                style="
                    font-family: Arial;
                    padding: 20px;
                "
                >
                <h1>
                     MJL Foods
                </h1>

                <h2>
                    Zamówienie przyjęte
                </h2>

                <p>
                    Numer zamówienia:
                    <strong>
                    {order_number}
                    </strong>
                </p>

                <p>
                    Szacowany czas dostawy:
                    <strong>
                    {delivery_time}
                    </strong>
                </p>

                <hr>

                <p>
                    Dziękujemy za
                    zamówienie 
                </p>
                </div>
                """
        })

    except Exception as e:
        print(
            f"Email error: {e}"
        )