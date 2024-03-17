# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []
from rasa_sdk import Action
import openai
import os

class FallbackAction(Action):
    def name(self):
        return "action_default_fallback"

    def run(self, dispatcher, tracker, domain):
        user_input = tracker.latest_message.get('text')
        # Call ChatGPT API
        gpt_response = self.call_chatgpt_api(user_input)
        # Send response back to the user
        dispatcher.utter_message(text=gpt_response)
        return []
    
    def call_chatgpt_api(self, user_input):
        # Retrieve API key from environment variable
        openai.api_key = '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'
        if openai.api_key is None:
            raise ValueError("OpenAI API key is not set. Please set the OPENAI_API_KEY environment variable.")

        # Call completion endpoint
        response = openai.Completion.create(
            engine="davinci",  # You can choose the model you prefer
            prompt=user_input,
            max_tokens=50  # Adjust according to the desired response length
        )
        return response.choices[0].text.strip()


    
## openai.api_key = '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'

