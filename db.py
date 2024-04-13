from pymongo import MongoClient

# Replace the following variables with your actual details
username = 'adminUser'
password = 'adminadmin'

# Create the MongoDB connection URI
# connection_uri = f"mongodb://{username}:{password}@localhost:27017?authSource=admin"
connection_uri = f"mongodb://localhost:27017/"

# Connect to MongoDB
client = MongoClient(connection_uri)

# mongodb://localhost:27017/