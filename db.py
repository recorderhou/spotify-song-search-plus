from pymongo import MongoClient

# Replace the following variables with your actual details
username = 'adminUser'
password = 'adminadmin'
database_name = 'distdb0'

# Create the MongoDB connection URI
connection_uri = f"mongodb://{username}:{password}@localhost:27017/{database_name}"

# Connect to MongoDB
client = MongoClient(connection_uri)

# Select your database
mongo_db = client[database_name]