from pymongo import MongoClient

# Replace the following variables with your actual details
# username = 'admin'
# password = 'password'
username = 'admin'
password = 'password'

# Create the MongoDB connection URI
connection_uri = f"mongodb://{username}:{password}@localhost:27017?authSource=admin"

# Connect to MongoDB
client = MongoClient(connection_uri)