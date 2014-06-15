package no.javazone;

import java.util.Random;
import java.util.Set;

import org.junit.Ignore;
import org.junit.Test;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;

public class MongoTest {

	@Test
	@Ignore
	public void skal() throws Exception {
		MongoClient mongoClient = new MongoClient();
		DB db = mongoClient.getDB("javazone");

		System.out.println("COLLECTIONS");
		Set<String> collections = db.getCollectionNames();
		for (String string : collections) {
			System.out.println(string);
		}

		DBCollection coll = db.getCollection("feedback");

		System.out.println("INSERTS");
		for (int i = 0; i < 100; i++) {
			BasicDBObject dbObject = new BasicDBObject("talkId", System.currentTimeMillis())
					.append("rating", new Random().nextInt(6))
					.append("comment", "Bra talk :)");
			coll.insert(dbObject);
			System.out.println(i);
		}

		System.out.println("FIND ONE");
		DBObject object = coll.findOne();
		System.out.println(object);

		System.out.println("COUNT");
		System.out.println(coll.getCount());

		System.out.println("ALLE");
		DBCursor cursor = coll.find();
		try {
			while (cursor.hasNext()) {
				System.out.println(cursor.next());
			}
		} finally {
			cursor.close();
		}

		System.out.println("SØK etter rating=4");
		BasicDBObject query = new BasicDBObject("rating", 4);

		cursor = coll.find(query);

		try {
			while (cursor.hasNext()) {
				System.out.println(cursor.next());
			}
		} finally {
			cursor.close();
		}

		System.out.println("SØK etter rating>2");
		BasicDBObject query2 = new BasicDBObject("rating", new BasicDBObject("$gt", 2));

		cursor = coll.find(query2);

		try {
			while (cursor.hasNext()) {
				System.out.println(cursor.next());
			}
		} finally {
			cursor.close();
		}
	}
}
