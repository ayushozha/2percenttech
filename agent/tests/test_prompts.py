import unittest

from app.prompts import system_prompt


class SystemPromptTests(unittest.TestCase):
    def test_uses_current_public_metrics(self):
        prompt = system_prompt("en")

        self.assertIn("52 events", prompt)
        self.assertIn("150K+ attendee network", prompt)
        self.assertIn("3-5 events planned monthly", prompt)
        self.assertNotIn("25 events", prompt)
        self.assertNotIn("6,300+", prompt)

    def test_does_not_request_email_again_for_a_saved_request(self):
        prompt = system_prompt("en")

        self.assertIn("request is saved", prompt)
        self.assertIn("do not ask for their email", prompt)


if __name__ == "__main__":
    unittest.main()
