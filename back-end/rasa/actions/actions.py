from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from pymongo import MongoClient

class ActionRecommendProduct(Action):
    def name(self):
        return "action_recommend_product"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: dict):
        # MongoDB connection
        client = MongoClient('mongodb://localhost:27017/')
        db = client['your_database']
        collection = db['your_collection']

        # Sample query (modify as necessary)
        products = list(collection.find({}))  # Get all products
        product_names = [product['name'] for product in products]

        dispatcher.utter_message(text=f"I recommend the following products: {', '.join(product_names)}")

        return []
