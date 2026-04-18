"""
Script to migrate data from local MongoDB to MongoDB Atlas
"""
import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import sys
from datetime import datetime

# Local MongoDB configuration
LOCAL_MONGO_URI = os.getenv('LOCAL_MONGO_URI', 'mongodb://localhost:27017/')
LOCAL_DB_NAME = os.getenv('LOCAL_DB_NAME', 'eduequi')

# MongoDB Atlas configuration
ATLAS_MONGO_URI = os.getenv('ATLAS_MONGO_URI')
ATLAS_DB_NAME = 'pinmypic'

def get_collections(db):
    """Get all collection names from a database"""
    return db.list_collection_names()

def transfer_collection(source_collection, target_collection, collection_name):
    """Transfer all documents from source to target collection"""
    print(f"\n📦 Transferring collection: {collection_name}")
    
    # Get all documents from source
    documents = list(source_collection.find())
    total_docs = len(documents)
    
    if total_docs == 0:
        print(f"   ⚠️  Collection '{collection_name}' is empty, skipping...")
        return 0
    
    print(f"   Found {total_docs} documents")
    
    # Insert documents into target
    if total_docs > 0:
        # Delete existing documents in target collection (optional - comment out if you want to keep existing)
        # target_collection.delete_many({})
        
        # Insert documents
        try:
            result = target_collection.insert_many(documents, ordered=False)
            inserted_count = len(result.inserted_ids)
            print(f"   ✅ Successfully inserted {inserted_count} documents")
            return inserted_count
        except Exception as e:
            print(f"   ❌ Error inserting documents: {str(e)}")
            # Try inserting one by one if bulk insert fails
            print(f"   🔄 Trying to insert documents one by one...")
            inserted_count = 0
            for doc in documents:
                try:
                    target_collection.insert_one(doc)
                    inserted_count += 1
                except Exception as e2:
                    print(f"   ⚠️  Failed to insert document with _id {doc.get('_id')}: {str(e2)}")
            print(f"   ✅ Inserted {inserted_count}/{total_docs} documents")
            return inserted_count
    
    return 0

def main():
    print("=" * 60)
    print("MongoDB Migration Script: Local → MongoDB Atlas")
    print("=" * 60)
    print(f"Source: {LOCAL_MONGO_URI} (Database: {LOCAL_DB_NAME})")
    print(f"Target: MongoDB Atlas (Database: {ATLAS_DB_NAME})")
    print("=" * 60)
    
    # Connect to local MongoDB
    print("\n🔌 Connecting to local MongoDB...")
    try:
        local_client = MongoClient(LOCAL_MONGO_URI, serverSelectionTimeoutMS=5000)
        local_client.server_info()  # Test connection
        local_db = local_client[LOCAL_DB_NAME]
        print(f"✅ Connected to local MongoDB (Database: {LOCAL_DB_NAME})")
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        print(f"❌ Failed to connect to local MongoDB: {str(e)}")
        print("   Make sure MongoDB is running locally and accessible at mongodb://localhost:27017/")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error connecting to local MongoDB: {str(e)}")
        sys.exit(1)
    
    # Connect to MongoDB Atlas
    print("\n🔌 Connecting to MongoDB Atlas...")
    try:
        atlas_client = MongoClient(ATLAS_MONGO_URI, serverSelectionTimeoutMS=10000)
        atlas_client.server_info()  # Test connection
        atlas_db = atlas_client[ATLAS_DB_NAME]
        print(f"✅ Connected to MongoDB Atlas (Database: {ATLAS_DB_NAME})")
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        print(f"❌ Failed to connect to MongoDB Atlas: {str(e)}")
        print("   Please check your connection string and network access")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error connecting to MongoDB Atlas: {str(e)}")
        sys.exit(1)
    
    # Get all collections from local database
    print(f"\n📋 Listing collections in local database '{LOCAL_DB_NAME}'...")
    try:
        collections = get_collections(local_db)
        if not collections:
            print(f"⚠️  No collections found in local database '{LOCAL_DB_NAME}'")
            print("   Please verify the database name is correct.")
            sys.exit(1)
        print(f"✅ Found {len(collections)} collection(s): {', '.join(collections)}")
    except Exception as e:
        print(f"❌ Error listing collections: {str(e)}")
        sys.exit(1)
    
    # Transfer each collection
    total_transferred = 0
    summary = []
    
    for collection_name in collections:
        try:
            source_collection = local_db[collection_name]
            target_collection = atlas_db[collection_name]
            
            count = transfer_collection(source_collection, target_collection, collection_name)
            total_transferred += count
            summary.append((collection_name, count))
        except Exception as e:
            print(f"❌ Error transferring collection '{collection_name}': {str(e)}")
            summary.append((collection_name, 0))
    
    # Print summary
    print("\n" + "=" * 60)
    print("Migration Summary")
    print("=" * 60)
    for collection_name, count in summary:
        status = "✅" if count > 0 else "⚠️"
        print(f"{status} {collection_name}: {count} documents")
    print("=" * 60)
    print(f"Total documents transferred: {total_transferred}")
    print("=" * 60)
    
    # Close connections
    local_client.close()
    atlas_client.close()
    print("\n✅ Migration completed!")

if __name__ == "__main__":
    main()


